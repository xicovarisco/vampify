import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Spotify from 'spotify-web-api-js';
import _ from 'lodash';
import {
  CardComponent,
  Header,
  Footer,
  SnackbarComponent,
  DialogComponent
} from '../common';
import { utils } from '../lib/utils';
import { playlistUtils } from '../lib/playlists';
import { songUtils } from '../lib/songs';

// Styles
import './App.scss';

export default function App() {
  const [accessToken, setAccessToken] = useState();
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [searchedSongs, setSearchedSongs] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const spotify = new Spotify();

  useEffect(() => {
    // Check whether we already have an access token
    const hash = utils.getHashParams();
    if (hash && hash.access_token) {
      setAccessToken(hash.access_token);
      onPullPlaylists(hash.access_token);
    } else {
      setIsTokenExpired(true);
    }
  }, []);

  // Trigger every time we change the access token
  useEffect(() => {
    if (accessToken) spotify.setAccessToken(accessToken);
  }, [accessToken]);

  const onPullPlaylists = (access_token = accessToken) => {
    spotify.setAccessToken(access_token);

    spotify.getUserPlaylists()
        .then((response) => {
          if (response && response.items) {
            setUserPlaylists(response.items);
          }
        })
        .catch(() => {
          setIsTokenExpired(true);
        });
  };

  const onResetState = () => {
    setSearchedSongs([]);
    setSavedSongs([]);
    onPullPlaylists(accessToken);
  };

  // Render items in an appropriate grid
  const renderItems = ({ items, type }) => {
    if (accessToken && _.size(items) === 0) return <CircularProgress />;
    return (
      _.map(items, (item) => {
        const itemImage = type === 'search' ? songUtils.getImage(item) : playlistUtils.getImage(item);
        const cardArgs = {
          id: item.id,
          name: item.name,
          image: itemImage,
          description: item.description,
          uri: item.uri
        };
        if (type === 'search') {
          cardArgs.onAddToSavedPlaylist = (songsSelected) => {
            setSavedSongs(savedSongs.concat(songsSelected));
            setSnackbarMessage(`Song ${_.get(songsSelected, 'name')} saved`);
          };
        }
        return (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <CardComponent {...cardArgs} />
          </Grid>
        );
      })
    );
  };

  const renderGrid = ({
    title,
    className,
    items,
    type,
    btnAction
  }) => {
    return (
      <Container maxWidth="md" className={`itemsGrid ${className}`}>
        <div className="titleContainer">
          <h1>{title}</h1>
          {btnAction}
        </div>
        <Grid container spacing={4}>
          {renderItems({ items, type })}
        </Grid>
      </Container>
    );
  };

  return (
    <>
      <Header
        isDisabled={isTokenExpired}
        onSearchPlaylist={(value) => {
          if (value) {
            spotify.searchTracks(value, { limit: 5 })
              .then((response) => {
                if (_.size(response, 'tracks.items') > 0) {
                  setSearchedSongs(response.tracks.items);
                }
              });
          } else {
            setSearchedSongs([]);
          }
        }}
      />
      <div className="appComponent">
        <div className="heroContainer">
          <Container maxWidth="sm">
            <h1 className="flexCenter">
              Vampify <span className="mleft5" role="img" aria-label="a">✌️</span>
            </h1>
            <h5>
              Vampify allows you to easily search for songs and add them to a new playlist on Spotify
            </h5>
            <div className="mtop30">
              {isTokenExpired && (
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      href="http://localhost:8888/login"
                    >
                      Login to Spotify
                    </Button>
                  </Grid>
                </Grid>
              )}
            </div>
          </Container>
        </div>
        {!isTokenExpired && _.size(savedSongs) > 0 && renderGrid({
          title: 'Saved Songs',
          className: 'savedSongsContainer',
          items: savedSongs,
          type: 'savedSongs',
          btnAction: (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Save to Spotify
            </Button>
          )
        })}
        {!isTokenExpired && _.size(searchedSongs) > 0 && renderGrid({
          title: 'Search Results',
          className: 'searchContainer',
          items: searchedSongs,
          type: 'search'
        })}
        {!isTokenExpired && _.size(userPlaylists) > 0 && renderGrid({
          title: 'User playlists',
          className: 'playlists',
          items: userPlaylists,
          type: 'userPlaylists'
        })}
        <SnackbarComponent
          open={!!snackbarMessage}
          message={snackbarMessage}
          onClose={() => setSnackbarMessage('')}
        />
        <DialogComponent
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Add to Playlist"
          description="What should be the playlist&apos;s name?"
          inputPlaceholder="Playlist name"
          onConfirm={async (name) => {
            setOpenDialog(false);
            // Get current connected user
            const user = await spotify.getMe();
            // Creates a playlist
            const playlistCreated = await spotify.createPlaylist(_.get(user, 'id'), { name });
            // Add songs to playlist
            // Creates a comma separate variable to hold all the URI's to add to a playlist
            const uris = _.map(savedSongs, (song) => song.uri);
            await spotify.addTracksToPlaylist(_.get(playlistCreated, 'id'), uris);

            // Show Snackbar
            setSnackbarMessage(`Playlist ${name} created successfully`);

            // Reset State
            onResetState();
          }}
        />
      </div>
      <Footer />
    </>
  );
}
