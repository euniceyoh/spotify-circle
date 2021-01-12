# spotify-circle

Spotify analyzer that compares multiple user's music tastes and ranks them based on similarity.

## Inspiration 
* Popular Spotify analyzers such as “How Bad is Your Music Taste” AI, Obscurify, Receiptify, etc.


## Functionality
* Authenticate spotify user account
* Similarity algorithm: 
  * Compare using top 50: [(API Endpoint Reference)](https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/)
    * genres
    * artists
    * tracks 
* Use calculation to create bubble sizes 
* Create a bubble chart with friends similarity scores
* Add a friend using spotify account id 

## Technologies
* [Firebase](https://firebase.google.com/docs/firestore/quickstart#node.js) 
* Node.js
* Express.js
* React.js
* [Spotify Web Api](https://developer.spotify.com/documentation/web-api/) 
* [Spotify Web Api Wrapper](https://github.com/thelinmichael/spotify-web-api-node)
* D3.js 


## Next Steps
* Optimize similarity score algorithm
  * Top Albums 
  * Audio Analytics
* Add page to display friend profiles and shared top tracks
* Optimize visualization
  * Connect data to bubble visuals
  * Update UI
