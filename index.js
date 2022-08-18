#! /usr/bin/env node
const fetch = require('node-fetch');
const token = 'BQCYDrPxV4k5rGBVMnyP_Xrg2lLQ3n8a8pgitv4AYReJGiqDq7DFwyjaSssZrD_I8vNKVTrcimN0sXXcAC3LP1QQT9inFy265Jqs5PeUGqYJ0H0MAxoifWtR0fhCujYrnGbReojwxec1zXWb9bPra9TDd8GMgbvmVlhv7pDxbKS6F33pxNbZRecIJ8xCQUpLZqjY4CHNd0AnsyENm4mdoXTl6DE5MpaROT1N8l1wLOg4FN9KV82IpSduKKjO97cKotQW4pkH_-ay25wlDzzEe-tPRXhVDVgNyPr_w36NPeIyGW3-iqn-BMD1AvsGUYOIgQ';


fetch('https://api.spotify.com/v1/playlists/5qwUpzOKpeEn6EJt4PSgOp',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(json => {
    // console.log(json.tracks.items[0].track.name);
    let songs = json.tracks.items;

    for (i in songs) {
      song = songs[i];
      console.log(song.track.name);
      // Do something...
    }
  })
  .catch(err => console.log(err));    