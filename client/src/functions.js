import { useCallback } from "react";

export {getHashParams, trackSimilarity, artistsSimilarity, genreSimilarity}

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

  // Track Similarity
 function trackSimilarity(usr1Tracks, usr2Tracks){
    let similarity = usr1Tracks.filter((val) => { // filters current users topTracks with other users'
      return usr2Tracks.indexOf(val) !== -1
    })
    let albums = usr1Tracks
    return (similarity.length)///usr1Tracks.length)*100  // to be nice
  }

    // Artists Similarity
  function artistsSimilarity(usr1Artists, usr2Artists){
  let similarity = usr1Artists.filter((val) => {
    return usr2Artists.indexOf(val) !== -1
  })
  return (similarity.length)///usr1Artists.length)*100
  // setArtistsSimilarity((similarity.length/usr1Artists.length)*100)
}

// Genre Similarity
function genreSimilarity(usr1Genres, usr2Genres){
  let similarity = usr1Genres.filter((val) => {
    return usr2Genres.indexOf(val) !== -1
  })
  return (similarity.length)///usr1Genres.length)*100
  // setGenreSimilarity((similarity.length/usr1Genres.length)*100)
}

// Overall Similarity
function computeSimilarity(usr1){

//   let usr1Artists = getTopArtists(usr1)
//   let usr1Genres = getTopGenres(usr1)

//   let usr2Tracks = getTopTracks(usr2)
//   let usr2Artists = getTopArtists(usr2)
//   let usr2Genres = getTopGenres(usr2)

//   let trackSimScore = trackSimilarity(usr1Tracks, usr2Tracks)
//   let artistsSimScore = artistsSimilarity(usr1Artists, usr2Artists)
//   let genreSimScore = genreSimilarity(usr1Genres, usr2Genres)

//   let sum = trackSimScore + artistsSimScore + genreSimScore
//   sum = sum/3
//   return sum
}
