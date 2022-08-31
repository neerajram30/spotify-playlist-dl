#! /usr/bin/env node
 const fetch = require('node-fetch');




const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const dotenv = require('dotenv');
const YouTube = require("youtube-sr").default;
const yts = require( 'yt-search' )
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const download = require('./getList')

const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
let inquirer  = require('inquirer')
const { type } = require('os');
const path ='/home/neeraj/Music/'

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
  console.log(me.body.id);
}

async function getUserPlaylists(id) {
  const data = await spotifyApi.getUserPlaylists(id);
  let playlists = []

  for (let playlist of data.body.items) {
    //console.log(playlist.name + " " + playlist.id)
    //let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    playlists.push({'name':playlist.name,'value':playlist.id})
    //getSearch(tracks);
    // const tracksJSON = { tracks }
    // let data = JSON.stringify(tracksJSON);
    // console.log(data);
    //fs.writeFileSync(playlist.name+'.json', data);
  }
  console.log(playlists);
 inquirer.prompt([
  {
    type:'list',
    name:'Playlists',
    message:'Select the playlist',
    choices:playlists,
  }

 ]).then((answer)=>{
  console.log(answer.Playlists)
  getPlaylistTracks(answer.Playlists)
  
 })
}

async function getPlaylistTracks(playlistId) {

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
  console.log(tracks)
  for(i in tracks){
    getSearch(tracks[i])
  }
}

function getSearch(track){
  // for(i in tracks){
    YouTube.searchOne(track)
    .then(res => {
      downloadSongs(res.url, track)
      //console.log('url: '+res.url + 'track name: '+track);
    }) // https://www.youtube.com/watch?v=XXXXXXX
    .catch(console.error);
  // }
}

 function downloadSongs(urls, track_name){
   urls = urls.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
   url = urls[2]
   //console.log(url+track_name);
   getDownload(url, track_name)
 

}

function getDownload(url, track_name){
  
  let stream = ytdl(url, {
    quality: 'highestaudio',
  });
  

  let start = Date.now();
  ffmpeg(stream)
  .audioBitrate(128)
  .save(
    path+track_name+'.mp3'
    )
    .on('progress', p => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${p.targetSize}kb downloaded`);
    })
    .on('end', () => {
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
    });
}