import './App.css'
import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState, useEffect, useCallback } from 'react'

const spotifyApi = new SpotifyWebApi()

const test_user = [] // model data base entry?? contains topSongs,topArtists

function App() {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [topArtists, setTopArtists] = useState([])
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
          Track Similarity: { (trackSimScore)}%
        </div>
        <div>
          Songs: {(tracks)}
        </div>
        <div>
          Artists: {(artists)}
        </div>
        <div>
          Genres: {genres}
        </div>

{//Initialize test user, copy of current user
}        <button onClick={() => {
          spotifyApi.getMyTopTracks({limit: 50})
          .then((response) => {
            let result = response.items.map(a => a.name)
            test_user.[0] = ((Object.values(result)))
            setTopTracks(result)
            })

            spotifyApi.getMyTopArtists({limit: 50})
            .then((response) => {
              let result = response.items.map(a => a.name) // naming object a and returning value of field named 'name'
              test_user[1] = ((Object.values(result)))
              setTopArtists(result)
            })


          }
        }>init test user</button>

        <button onClick={() => {
          //Can repeat this for artist, genre, etc
          let similarity = topTracks.filter(function(val) { // filters current users topTracks with other users'
            return test_user[0].indexOf(val) != -1
          })
          setTrackSimilarity((similarity.length/topTracks.length)*100)

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
