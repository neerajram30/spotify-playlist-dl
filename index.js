#! /usr/bin/env node
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const dotenv = require('dotenv');
const YouTube = require("youtube-sr").default;
const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
let inquirer = require('inquirer')
dotenv.config();
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

//configure spotify api
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
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
      getUser()
      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];
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

//Get the users
async function getUser() {
  const me = await spotifyApi.getMe();
  console.log('Welcome to spotify smart downloader '+ me.body.display_name);
  getUserPlaylists(me.body.id);
}
//Get uses playlist
async function getUserPlaylists(id) {
  const data = await spotifyApi.getUserPlaylists(id);
  let playlists = []
  for (let playlist of data.body.items) {
    playlists.push({ 'name': playlist.name, 'value': playlist.id })
  }
  inquirer.prompt([
    {
      type: 'list',
      name: 'Playlists',
      message: 'Select the playlist',
      choices: playlists,
    }
  ]).then((answer) => {
    getPlaylistTracks(answer.Playlists)

  })
}

//Get the tracks inside a playlist
async function getPlaylistTracks(playlistId) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track.name + ' ' + track.artists[0].name);
  }

  console.log('Tracks in play list are');
  console.log('--------------------------------------------------------------------------------------');  
  for (i in tracks){
    console.log(tracks[i]);
  }
  console.log('--------------------------------------------------------------------------------------');

  inquirer.prompt([
    {
      type: 'list',
      name: 'confirmation',
      message: 'Do you want to download songs ?',
      choices: ['Yes', 'No'],
    }

  ]).then((answer) => {
    if (answer.confirmation == 'Yes') {
      for (i in tracks) {
        getSearch(tracks[i]);
      }
    
    }
    else {
      getUser();
    }
    
  })
}


//Search youtube for songs links
function getSearch(track) {
  YouTube.searchOne(track)
    .then(res => {
      downloadSongs(res.url, track)
    }) 
    .catch(console.error);
}

//Extract the id from the youtube url
function downloadSongs(urls, track_name) {
  urls = urls.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  url = urls[2]
  getDownload(url, track_name)
}

//Download the songs from youtube id
function getDownload(url, track_name) {
  let stream = ytdl(url, {
    quality: 'highestaudio',
  });
  ffmpeg(stream)
    .audioBitrate(128)
    .save(
      process.env.MUSIC_DIRECTORY + track_name + '.mp3'
    )
    .on('progress', p => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(` downloaded ${p.targetSize}kb`);
    })
    .on('end', () => {
      console.log(`\n${track_name} downloaded succesfully`);
    });
}