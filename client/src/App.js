import './App.css'
import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState } from 'react'

const spotifyApi = new SpotifyWebApi()

function App() {

  const params = getHashParams()
  const token = params.access_token
  if(token) {
    spotifyApi.setAccessToken(token)
  }

  // const [loggedIn, setLoggedIn] = useState(token ? true : false)
  const [artist, setArtist] = useState('EXAMPLE')

  // console.log(params)
  // console.log('hello word')

  return (
    <div className="App">
      <header className="App-header">
        <a href='http://localhost:8888'>Login to Spotify</a>
        <div>
          Your Current Song: {artist}
        </div>
        <button onClick={() => {
          spotifyApi.getMyCurrentPlaybackState()
          .then((response) => {
            setArtist(response.item.name)
          })
        }}>Click</button>
      </header>
    </div>
  )
}

function getHashParams() {
  var hashParams = {}
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
     e = r.exec(q)
  }
  return hashParams
}

export default App;
