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
const dotenv = require('dotenv');
const YouTube = require("youtube-sr").default;
const ytsearch = require('youtube-search-without-api-key')
const yts = require( 'yt-search' )
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ytdl = require('ytdl-core');
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

const YD = new YoutubeMp3Downloader({
  "ffmpegPath": "/home/neeraj/snap/ffmpeg",                                          // FFmpeg binary location
  "outputPath": "/home/neeraj/mp3",    // Output file location (default: the home directory)
  "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
  "queueParallelism": 2,                  // Download parallelism (default: 1)
  "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
  "allowWebm": false                      // Enable download from WebM sources (default: false)
});

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

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);
      console.log(spotifyApi);
      
      getMyPlaylist()
      
      
      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.send('Success! You can now close the window.');

        

//     fetch('https://api.spotify.com/v1/playlists/5qwUpzOKpeEn6EJt4PSgOp',
//     {
//        method: 'GET',
//        headers: {
//         Authorization: `Bearer ${access_token}`
//       }
//     })
//     .then(res => res.json())
//     .then(json => {
//       // console.log(json.tracks.items[0].track.name);
//       let songs = json.tracks.items;
  
//       for (i in songs) {
//         song = songs[i];
//         console.log(song.track.name);
//         // Do something...
//     }
// })
// .catch(err => console.log(err));    
        
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

module.exports = spotifyApi;
 
async function getMyPlaylist(){

  const me = await spotifyApi.getMe();
  console.log('Name ->' + me.body.display_name);
  getUserPlaylists(me.body.id);
}

async function getUserPlaylists(id) {
  const data = await spotifyApi.getUserPlaylists(id);
  let playlists = []

  for (let playlist of data.body.items) {
    //console.log(playlist.name + " " + playlist.id)
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    //console.log(tracks);
    getSearch(tracks);
    // const tracksJSON = { tracks }
    // let data = JSON.stringify(tracksJSON);
    // console.log(data);
    //fs.writeFileSync(playlist.name+'.json', data);
  }
}

async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track.name + ' ' + track.artists[0].name);
    // console.log(track.name + " : " + track.artists[0].name)
    //console.log(tracks);
  }


  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

async function getSearch(tracks){
  let results = []
  for(i in tracks){
    YouTube.searchOne(tracks[i])
    .then(res => {
      downloadSongs(res.url)
    }) // https://www.youtube.com/watch?v=XXXXXXX
    .catch(console.error);
  }
}

async function downloadSongs(urls){
  urls = urls.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  url = urls[2]
  console.log(url);
//   let info = await ytdl.getInfo(urls);
// let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
// console.log('Formats with only audio: ' + audioFormats.length);
}