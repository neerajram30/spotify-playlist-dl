// const token = 'BQC9Cb_d9AoXQokQUJJ-aVmLXxAqvuYTAOCTk8f-sy7jRj4LwrlK5U3K5mrDkGre6WO-zd8iU2K9gYZxKyU9QPJfGTaWPJv-7mTzTD6MGNJRIoqK7P-mOaoe2iSvmC-NySWHjz-oQ4MSsl7oYrtrqQtKYz9DJfAV8ZXn7PfH6P41S7AvnUgtTjXGlb3-a9mW0GE54TvqHLiRQffxtTjsTnEEMuhanjy3lsuW3ZY0UIM8fbVYm9UF01lU1v_zUaAOLP3ApIi2F101KsYpMGMGek0N43TcDvph4xbWDziFf__z5shSXQytMWXzS34xkn1vvFv3A7O_vdMaZ3AZSBnh'
// const spotify = require('./index');
// console.log(spotify);
// const fetch = require('node-fetch');
// const SpotifyWebApi = require('spotify-web-api-node')

// const spotifyWebApi = new SpotifyWebApi();
// spotifyWebApi.setAccessToken(token)


//     fetch('https://api.spotify.com/v1/playlists/5qwUpzOKpeEn6EJt4PSgOp',
//     {
//        method: 'GET',
//        headers: {
//         Authorization: `Bearer ${token}`
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

// async function getMyPlaylist(){

//     const me = await spotifyWebApi.getMe();
//     console.log('Name ->' + me.body.display_name);
//     getUserPlaylists(me.body.id);
// }
// getMyPlaylist()


// async function getUserPlaylists(id) {
//   const data = await spotifyWebApi.getUserPlaylists(id);
//   let playlists = []

//   for (let playlist of data.body.items) {
//     console.log(playlist.name + " " + playlist.id)
//     //let tracks = await getPlaylistTracks(playlist.id, playlist.name);
//      //console.log(tracks);

//     // const tracksJSON = { tracks }
//     // let data = JSON.stringify(tracksJSON);
//     // console.log(data);
//     //fs.writeFileSync(playlist.name+'.json', data);
//   }
// }

const playlist_id = "5qwUpzOKpeEn6EJt4PSgOp"
const spotifyApi = require('./index')



  spotifyApi.getPlaylistTracks(playlist_id, {
    offset: 1,
    limit: 100,
    fields: 'items'
  }).then((data)=>{
    console.log('data======>'+data);
  })

  
    
  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  // let tracks = [];

  // for (let track_obj of data.body.items) {
  //   const track = track_obj.track
  //   tracks.push(track.name + ' ' + track.artists[0].name);
  //    console.log(track.name + " : " + track.artists[0].name)
  //   //console.log(tracks);
  // }

  
  // console.log("---------------+++++++++++++++++++++++++")
  


