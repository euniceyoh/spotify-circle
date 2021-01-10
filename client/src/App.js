import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState, useEffect, useCallback } from 'react'
import firestoredb, {saveSimilarityScore, addNewFriend} from './firebase'
import {getHashParams, trackSimilarity, artistsSimilarity, genreSimilarity} from './functions'
import BubbleChart from '@weknow/react-bubble-chart-d3';

export default function App() {
  const [currentUser, setCurrentUser] = useState('')

  const spotifyApi = new SpotifyWebApi()
  const params = getHashParams()
  const token = params.access_token
  if(token) {
    spotifyApi.setAccessToken(token)
  }

  spotifyApi.getMe()
    .then((user) => {
      setCurrentUser(user.id) // a string right
  })


  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Spotify Circle</h1>
        <div id="login">
          <form action='http://localhost:8888/login'>
            <input type="submit" value="Login to Spotify" />
          </form>
        </div>
        <div>
          Your ID: {currentUser}
        </div>
        <TextBox userId={currentUser}/>
      </header>
    </div>
  )
}

function TextBox(props) {
 let user = props.userId 

  const[inputValue, setInputValue] = useState('') // aka id of friend
  const[data, setData] = useState([])
  // similarity
  const [similarityScore, setSimScore] = useState(0)
  const [trackSimScore, setTrackSimilarity] = useState(0)
  const [artistsSimScore, setArtistsSimilarity] = useState(0)
  const [genreSimScore, setGenreSimilarity] = useState(0)
  // me
  const [genres, setGenres] = useState([])
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState([])
  // friend
  const [fgenres, setfGenres] = useState([])
  const [fartists, setfArtists] = useState([])
  const [ftracks, setfTracks] = useState([])
  // friend list
  const [fList, setFList] = useState([
    {id: 20201},
  ])

  // get current user's ID
  // get top tracks for current user

  let calculateScore = () => {
      const docRef = firestoredb.collection('users').doc(user)
      docRef.get().then((doc) => {
        if(doc.exists) {
          let data = doc.data();
          setData(data)
          setGenres(data.genres)
          setArtists(data.artists)
          setTracks(data.trackId)
        }
      }).catch(function(error) {
        setData(null)
      })
      const fdocRef = firestoredb.collection('users').doc(inputValue)
      fdocRef.get().then((doc) => {
        if(doc.exists) {
          let data = doc.data();
          setData(data) // reusing
          setfGenres(data.genres)
          setfArtists(data.artists)
          setfTracks(data.trackId)
        }
      }).catch(function(error) {
        setData(null)
      })
    }

    let calculateScore2 = () => {
      let ts = trackSimilarity(tracks, ftracks)
      // setTrackSimilarity(ts)
      let as = artistsSimilarity(artists, fartists)
      // setArtistsSimilarity(as)
      let gs = genreSimilarity(genres, fgenres)
      // setGenreSimilarity(gs)

      setTracks(ts)
      setArtists(as)
      setGenres(gs)
      let sum = ts + as + gs
      setSimScore(sum)

      // writing to firebase
      addNewFriend(user, inputValue)
      saveSimilarityScore(user, inputValue, sum)
    }

    let getFriendList = () => {
      const docRef = firestoredb.collection('users').doc(user).collection('friendsList')
      docRef.get().then((snapshot) => {
        snapshot.forEach(function(doc) {
          // populate in {key:value}
          // friendList[doc.id] = doc.data() 
        })
      }).catch(function(error) {
        setFList(null)
      })
    }

  return (
      <div>
      <form onSubmit={
        () => {
          calculateScore()
          calculateScore2()}
        }> 
        {/* show personal bubble  */}
        <label>
          <input type="text" value={inputValue} onChange={(event) => {
            setInputValue(event.target.value)
            }} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        Similarity Score: {similarityScore}
      </div>
      <div>
        Friend List: {fList}
      </div>
      <button onClick={
        () => {getFriendList()}
      }> 
        {/* show friend bubble */}
        Show Friend
      </button>
      </div>
    )
}

