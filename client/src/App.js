import './App.css'
import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState, useEffect, useCallback } from 'react'

const spotifyApi = new SpotifyWebApi()

let usr1 = new Object()
let usr2 = {}
const test_users = []

function App() {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [trackSimScore, setTrackSimilarity] = useState([])

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
          Track Similarity: { Object.keys(trackSimScore)}
        </div>
        <div>
          Songs: {Object.keys(tracks)}
        </div>
        <div>
          Artists: {Object.keys(artists)}
        </div>
        <div>
          Genres: {genres}
        </div>
        <button onClick={() => {
          if (test_users[0] == null) {
            test_users[0] = usr1

            spotifyApi.getMyTopTracks({limit: 50})
            .then((response) => {
              let result = response.items.map(a => a.name)
              setTrackSimilarity(result)
              })

              spotifyApi.getMyTopArtists({limit: 50})
              .then((response) => {
                let result = response.items.map(a => a.name) // naming object a and returning value of field named 'name'
                test_users.push(result)
              })
          }
          /*else if (test_users[1] == null){

            test_users[1] = usr2

            spotifyApi.getMyTopTracks({limit: 50})
            .then((response) => {
              let result = response.items.map(a => a.name)
              usr2["topSongs"] = result
              })

              spotifyApi.getMyTopArtists({limit: 50})
              .then((response) => {
                let result = response.items.map(a => a.name) // naming object a and returning value of field named 'name'
                usr2["topArtists"] = result
              })
            }*/

            let similarity = []
            setArtists(test_users[0])



          }

              //grab your songs
              //grab friends songs from data base
              //var arr = mysongs.filter(function sim(yoursongs) => {
              //mysongs.indexOf(yoursongs) != -1
            //}




        }>Track Similarity</button>

        <button onClick={() => {
          spotifyApi.getMyTopTracks({limit: 50})
          .then((response) => {
            let result = response.items.map(a => a.name)
            setTracks(result)
          })

          spotifyApi.getMyTopArtists({limit: 50})
          .then((response) => {
            let result = response.items.map(a => a.name) // naming object a and returning value of field named 'name'
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
