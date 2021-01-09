// import './App.css'

import SpotifyWebApi from 'spotify-web-api-js'
import React, { useState, useEffect, useCallback } from 'react'
import { firestoredb } from './firebase'
import Home from './components/Home'
import LoginButton from './components/Button'

const spotifyApi = new SpotifyWebApi()

function App() {
  return (
    <div>
      <Home />
      <LoginButton />
    </div>
  )
}

export default App;

//   function getHashParams() {
//     var hashParams = {}
//     var e, r = /([^&;=]+)=?([^&;]*)/g,
//         q = window.location.hash.substring(1);
//     e = r.exec(q)
//     while (e) {
//        hashParams[e[1]] = decodeURIComponent(e[2]);
//        e = r.exec(q)
//     }
//     return hashParams
//   }

//   const params = getHashParams()
//   const token = params.access_token
//   if(token) {
//     spotifyApi.setAccessToken(token)
//   }



