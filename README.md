# Spotify Playlist Downloader

Spotify Playlist Downloader is simple command line tool to import the spotify playlist to local storage. 

## Installation

Clone this repository by using
```sh
git clone https://github.com/neerajram30/spotify-playlist-dl.git
```
Then navigate to the directory spotify-playlist-dl an use command

```sh
npm install
```
to install all the required libraries.

## Setting up

Create .env file in the root directory of the project and configure it as follows.
```sh
CLIENT_ID = 'YOUR SPOTIFY CLIENT ID'
CLIENT_SECRET = 'YOUR SPOTIFY CLIENT SECRET'
MUSIC_DIRECTORY = 'DIRECTORY'
```
Replace YOUR SPOTIFY CLIENT ID with your spotify client id, YOUR SPOTIFY CLIENT SECRET with your spotify client secret and replace DIRECTORY with the local directory in which you have to save the music files. 


## How to run ?

In terminal use given command to run the tool.

```sh
node index
```

you will be prompted in terminal like this.

>HTTP Server up. Now go to http://localhost:8888/login in your browser.

Now copy and paste the given link in any browser. Then give your login credentials and login to spotify. Now you will be prompted with option to select your playlist. Select the playlist that you have to download. 
Then you will see the list of songs in the playlist and a confirmation message will be shown, you can select 'Yes' to continue with the download and you can select 'No' to exit.  












