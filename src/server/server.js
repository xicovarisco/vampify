/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = 'd069ad8a85ce43e1a6bf23f9c4b6b803'; // Your client id
const client_secret = 'cd7701c7acfa46c88976a66821d94abf'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(`${__dirname}/public`))
   .use(cors())
   .use(cookieParser());

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private';
  const query = querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state
  });
  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
});

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    const query = querystring.stringify({
        error: 'state_mismatch'
    });
    res.redirect(`http://localhost:3000/#${query}`);
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
          Authorization: `Basic ${(new Buffer(`${client_id}:${client_secret}`).toString('base64'))}`
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token } = body;

        const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (errorArg, responseArg, bodyArg) => {
            if (errorArg) console.log('err', errorArg);
            if (responseArg) console.log('err', responseArg);
            console.log('bodyArg', bodyArg);
        });

        // we can also pass the token to the browser to make requests from there
        const query = querystring.stringify({
            access_token,
            refresh_token
        });
        res.redirect(`http://localhost:3000/#${query}`);
      } else {
          const query = querystring.stringify({
              error: 'invalid_token'
          });
        res.redirect(`http://localhost:3000/#${query}`);
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        Authorization: `Basic ${(new Buffer(`${client_id}:${client_secret}`).toString('base64'))}`
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token } = body;
      res.send({
        access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
