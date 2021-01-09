import './App.css'
import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState, useEffect, useCallback } from 'react'
import { firestoredb } from './firebase'

const spotifyApi = new SpotifyWebApi()



function App() {
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [currentUser, setCurrentUser] = useState([])
  const [otherUser, setOtherUser] = useState([])

  const [trackSimScore, setTrackSimilarity] = useState([])
  const [artistsSimScore, setArtistsSimilarity] = useState([])
  const [genreSimScore, setGenreSimilarity] = useState([])
  const [similarityScore, setSimScore] = useState([])

  // Gets current user's ID
  spotifyApi.getMe()
    .then((user) => {
      setCurrentUser(user.id)
    })

    // Track Similarity
    function trackSimilarity(usr1Tracks, usr2Tracks){
      let similarity = usr1Tracks.filter((val) => { // filters current users topTracks with other users'
        return usr2Tracks.indexOf(val) != -1
      })
      setTrackSimilarity((similarity.length/usr1Tracks.length)*100)
    }

    // Artists Similarity
    function artistsSimilarity(usr1Artists, usr2Artists){
      let similarity = usr1Artists.filter((val) => { // filters current users topTracks with other users'
        return usr2Artists.indexOf(val) != -1
      })
      setArtistsSimilarity((similarity.length/usr1Artists.length)*100)
    }

    // Genre Similarity
    function genreSimilarity(usr1Genres, usr2Genres){
      let similarity = usr1Genres.filter((val) => { // filters current users topTracks with other users'
        return usr2Genres.indexOf(val) != -1
      })
      setGenreSimilarity((similarity.length/usr1Genres.length)*100)
    }

    // Overall Similarity
    function computeSimilarity(usr1, usr2){
      let usr1Tracks = getTopTracks(usr1)
      let usr1Artists = getTopArtists(usr1)
      let usr1Genres = getTopGenres(usr1)

      let usr2Tracks = getTopTracks(usr2)
      let usr2rtists = getTopArtists(usr2)
      let usr2Genres = getTopGenres(usr2)

      trackSimilarity(usr1Tracks, usr2Tracks)
      artistsSimilarity(usr1Artists, usr2Artists)
      genreSimilarity(usr1Genres, usr2Genres)

      let sum = trackSimScore + artistsSimScore + genreSimScore
      sum = sum/3
      setSimScore(sum)
      saveSimilarityScore(user1, usr2, similarityScore)

    }

    class TextBox extends React.Component {
      constructor(props) {
        super(props);
        this.state = {value: ''};
      }

      handleChange = (event) => {
        this.setState({value: event.target.value});
      }

      handleSubmit = (event) => {
        setOtherUser(this.state.value)


        addNewFriend(currentUser, otherUser)
        addNewFriend(otherUser, currentUser)
        computeSimilarity(currentUser, otherUser)


        event.preventDefault();
      }

      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
      }
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
          Your ID: {currentUser}
        </div>
        <div>
          Track Similarity: { similarityScore }%
        </div>

        <TextBox/>

      </header>
    </div>
  )
}

export default App;
