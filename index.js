#! /usr/bin/env node
 const fetch = require('node-fetch');
// const token = 'BQCYDrPxV4k5rGBVMnyP_Xrg2lLQ3n8a8pgitv4AYReJGiqDq7DFwyjaSssZrD_I8vNKVTrcimN0sXXcAC3LP1QQT9inFy265Jqs5PeUGqYJ0H0MAxoifWtR0fhCujYrnGbReojwxec1zXWb9bPra9TDd8GMgbvmVlhv7pDxbKS6F33pxNbZRecIJ8xCQUpLZqjY4CHNd0AnsyENm4mdoXTl6DE5MpaROT1N8l1wLOg4FN9KV82IpSduKKjO97cKotQW4pkH_-ay25wlDzzEe-tPRXhVDVgNyPr_w36NPeIyGW3-iqn-BMD1AvsGUYOIgQ';
// const SpotifyWebApi = require('spotify-web-api-node');


// const spotifyApi = new SpotifyWebApi({
//   clientId: '161616d04b6847a1ab4adae981f96c0b',
//   clientSecret: '2bf30e2822f148cd95a4a0935eaca2a6',
//   redirectUri: 'http://localhost:8888/callback'
// });


// spotifyApi.getPlaylist('5qwUpzOKpeEn6EJt4PSgOp')
//   .then(function(data) {
//     console.log('Some information about this playlist', data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });



const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const playlist = require('./getList')

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

const spotifyApi = new SpotifyWebApi({
  clientId: '161616d04b6847a1ab4adae981f96c0b',
  clientSecret: '2bf30e2822f148cd95a4a0935eaca2a6',
  redirectUri: 'http://localhost:8888/callback'
});

const app = express();

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);
      
      
      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.send('Success! You can now close the window.');
        
      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];
        

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
        
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);

//playlist.getPlaylist(token)
 
  