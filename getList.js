const token = 'BQD5uQYybG083STsHtCGHqC0KrNpfjQWr79qfhJUCNMJxgtZoaJQme1ujAxGNXSScTOTyz2qbdZfapeiIlmqKSocGS17fBRnWmawCH7itmmpFQcTJOPC2XyeAQZI7ZOGmhdJ3lN7jhPJJzTRDIz-OVsEQhsPVeruWaHceL03XGSGqoboUJCbg0t7t2TlunpvbmItH4WzVO5a1hyOQLGSoZBapUSGXSCFglvdBvNErOG3KR1auTLrpJjrTcign2dWV0iDyn-BbuvufCDr4TfJXdFWZPTNcSPzm1o3U8ssTKI3qWqnEISoxJaPIxmPejHOuVeACR4HKAsU-zf3L28y'
const fetch = require('node-fetch');



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


