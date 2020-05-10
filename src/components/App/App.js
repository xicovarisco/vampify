import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Spotify from 'spotify-web-api-js';
import _ from 'lodash';
import { CardComponent, Header, Footer } from '../common';
import { utils } from '../lib/utils';

// Styles
import './App.scss';

export default function App() {
  const [accessToken, setAccessToken] = useState();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [searchedPlaylists, setSearchedPlaylists] = useState([]);
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
        });
  };

  const renderPlaylists = () => {
    let playlistToRender = userPlaylists;
    if (_.size(searchedPlaylists) > 0) {
      playlistToRender = searchedPlaylists;
    }
    if (accessToken && playlistToRender.length === 0) return <CircularProgress />;
    return (
        playlistToRender.map((playlist) => (
          <Grid item key={playlist.id} xs={12} sm={6} md={4}>
            <CardComponent
              name={playlist.name}
              image={playlist.images[0].url}
              description={playlist.description}
            />
          </Grid>
        ))
    );
  };

  return (
    <>
      <Header
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
            </div>
          </Container>
        </div>
        <Container maxWidth="md" className="playlists">
            <h1>{_.size(searchedPlaylists) > 0 ? 'Searched Playlists' : 'User playlists'}</h1>
            <Grid container spacing={4}>
                {renderPlaylists()}
            </Grid>
        </Container>
      </div>
      <Footer />
    </>
  );
}
