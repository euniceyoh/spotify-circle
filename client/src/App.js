import './App.css'
import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState, useEffect, useCallback } from 'react'

const spotifyApi = new SpotifyWebApi()

function App() {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])

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

  const params = getHashParams()
  const token = params.access_token
  if(token) {
    spotifyApi.setAccessToken(token)
  }

  return (
    <div className="App">
      <header className="App-header">
        <a href='http://localhost:8888'>Login to Spotify</a>
        <div>
          Songs: {tracks}
        </div>
        <div>
          Artists: {artists}
        </div>
        <div>
          Genres: {genres}
        </div>

        <button onClick={() => {
          spotifyApi.getMyTopTracks()
          .then((response) => {
            let result = response.items.map(a => a.name)
            setTracks(result)
          })

          spotifyApi.getMyTopArtists()
          .then((response) => {
            let result = response.items.map(a => a.name)
            setArtists(result)
          })

          spotifyApi.getMyTopArtists()
          .then((response) => {
            let result = response.items.map(a => a.genres[0])
            setGenres(result)
          })

        }}>CLICK ME</button>

      </header>
    </div>
  )
}

export default App;
