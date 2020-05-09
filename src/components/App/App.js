import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { CardComponent } from '../common';

// Styles
import './App.scss';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Album() {
  return (
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
                <Button variant="contained" color="primary">
                  Main call to action
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  Secondary action
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
      <Container maxWidth="md">
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <CardComponent />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
