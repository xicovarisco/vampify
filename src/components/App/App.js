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
  SnackbarComponent
} from '../common';
import { utils } from '../lib/utils';

// Styles
import './App.scss';

export default function App() {
  const [accessToken, setAccessToken] = useState();
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [searchedPlaylists, setSearchedPlaylists] = useState([]);
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const spotify = new Spotify();

  useEffect(() => {
    // Check whether we already have an access token
    const hash = utils.getHashParams();
    if (hash && hash.access_token) {
      setAccessToken(hash.access_token);
      onPullPlaylists(hash.access_token);
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

  const renderPlaylists = (playlistsToRender) => {
    if (accessToken && playlistsToRender.length === 0) return <CircularProgress />;
    return (
      playlistsToRender.map((playlist) => {
        const playlistImage = _.get(playlist, 'image') || _.get(playlist, 'images[0].url');
        return (
          <Grid item key={playlist.id} xs={12} sm={6} md={4}>
            <CardComponent
              id={playlist.id}
              name={playlist.name}
              image={playlistImage}
              description={playlist.description}
              onAddToSavedPlaylist={(playlistSelected) => {
                setSavedPlaylists(savedPlaylists.concat(playlistSelected));
                setSnackbarMessage(`Playlist ${_.get(playlistSelected, 'name')} saved`);
              }}
            />
          </Grid>
        );
      })
    );
  };

  const renderSpotifyPlaylists = () => {
    const hasSearchedPlaylists = _.size(searchedPlaylists) > 0;
    const playlistsToRender = hasSearchedPlaylists ? searchedPlaylists : userPlaylists;
    return (
      <Container maxWidth="md" className="playlists">
        <h1>{hasSearchedPlaylists ? 'Searched Playlists' : 'User playlists'}</h1>
        <Grid container spacing={4}>
          {renderPlaylists(playlistsToRender)}
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
            spotify.searchPlaylists(value, { limit: 5 })
              .then((response) => {
                if (_.size(response, 'playlists.items') > 0) {
                  setSearchedPlaylists(response.playlists.items);
                }
              });
          } else {
            setSearchedPlaylists([]);
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
              Vampify allows you to easily search and add new playlists to your own Spotify account
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
        {!isTokenExpired && renderSpotifyPlaylists()}
        {_.size(savedPlaylists) > 0 && (
          <Container maxWidth="md" className="savedPlaylists">
            <h1>Saved Playlists</h1>
            <Grid container spacing={4}>
              {renderPlaylists(savedPlaylists)}
            </Grid>
          </Container>
        )}
        <SnackbarComponent
          open={!!snackbarMessage}
          message={snackbarMessage}
          onClose={() => setSnackbarMessage('')}
        />
      </div>
      <Footer />
    </>
  );
}
