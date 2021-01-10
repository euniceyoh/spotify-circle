var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');
var port = process.env.PORT || 8888
var spotifyAccountId

var admin = require("firebase-admin"); // firebase initialization 

var serviceAccount = require("./spotify-circle-key.json");
const { createSecureServer } = require('http2');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spotify-circle-76dff-default-rtdb.firebaseio.com"
});

const db = admin.firestore()

var client_id = 'c01d88ef446b4302be8ffb1b0f1c6838'; // Your client id
var client_secret = 'b22d35a168064f81ba19541c09fd1b8c'; // Your secret
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri
var spotifyApi = new SpotifyWebApi();

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

// step 1: have app request authorization; user logs in & authorizes access
app.get('/login', function(req, res) {

  var state = generateRandomString(16); // ?
  res.cookie(stateKey, state); // ?

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-read-playback-state'; // determines access permissions user grants
  res.redirect('https://accounts.spotify.com/authorize?' + // prompts user to authorize access
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri, // uri to redirect to after use grants/denies permission
      state: state, // optional
      show_dialog: 'true' // forces user to approve app again
    }));
});

// step 2: have app request tokens; spotify returns access & refresh tokens
app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code, // authorization code returned from request to Account
        redirect_uri: redirect_uri, // used for validation only
        grant_type: 'authorization_code' // required
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    // Spotify Web API returns JSON object !!!
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        spotifyApi.setAccessToken(access_token)

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // get user profile 
        spotifyApi.getMe()
        .then(function(data) {
          console.log('Some information about the authenticated user', data.body);
          const userInfo = {
            name: data.body.display_name,
            email: data.body.email,
          }
          // create new user doc
          let docRef = db.collection('users').doc(data.body.id)
          createUser()

          async function createUser() {
            await docRef.set(userInfo)
          }
          spotifyAccountId = data.body.id
          return data.body.id
        })
        .then(function(accountId) { // how to effectively use accountId
          return spotifyApi.getMyTopArtists({time_range: 'medium_term', limit:50, offset: 0})
        })
        .then(function(data) {
          console.log(spotifyAccountId)
          let artists = data.body.items
          let genres = []
          let artistNames = []
          for(i in artists) {
            artistNames.push(artists[i].name)
            for(j in artists[i].genres) {
              genres.push(artists[i].genres[j])
            }
          }
          let uniqueGenres = [...new Set(genres)]

          console.log('unique set: ')
          for(i in uniqueGenres) {
            console.log(uniqueGenres[i])
          }

          let docRef = db.collection('users').doc(spotifyAccountId)
          addGenre()

          async function addGenre() {
            await docRef.set({genres: uniqueGenres}, {merge: true})
            await docRef.set({artists: artistNames}, {merge: true})
          }

          return spotifyApi.getMyTopTracks({time_range: 'medium_term', limit:50, offset: 0})
        })
        .then(function(data) {
          let tracksData = data.body.items
          let trackInfo = []

          for(i in tracksData) {
            trackInfo.push(tracksData[i].id)
          }

          let docRef = db.collection('users').doc(spotifyAccountId)
          addTracks()

          async function addTracks() {
            await docRef.set({trackId: trackInfo}, {merge: true})
          }
        }) 
        .catch(function(err) {
          console.error(err)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// step 4: spotify returns new access token to app
app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

const cityRef = db.collection('users').doc('12132229959');
get()

async function get() {
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }

}

