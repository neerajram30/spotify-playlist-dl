const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const spotifyApi = require('./index') 
console.log(spotifyApi);

// let id = '7wNb0pHyGuI';
// let path ='/home/neeraj/Works/spotify-playlist-downloader/static/' 

// function getDownload(url){
  
//   let stream = ytdl(url, {
//     quality: 'highestaudio',
//   });
  

//   let start = Date.now();
//   ffmpeg(stream)
//   .audioBitrate(128)
//   .save(
//     path+`${url}.mp3`
//     )
//     .on('progress', p => {
//       readline.cursorTo(process.stdout, 0);
//       process.stdout.write(`${p.targetSize}kb downloaded`);
//     })
//     .on('end', () => {
//       console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
//     });
// }