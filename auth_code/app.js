var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');
var port = process.env.PORT || 8888

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
          url: 'https://api.spotify.com/v1/me/top/artists?' + 
          querystring.stringify({
            time_range: 'short_term',
            limit: 5,
            offset: 0,
          }),
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // step 3: use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          // console.log(body.items[0].name); // contains a paging object 
          // let artists = body.items
          // artists.forEach(printArtistName)
          // function printArtistName(value) {
          //   console.log(value.name)
          // }
        });

        // get user's top artists 
        spotifyApi
        .getMyTopArtists({time_range: 'short_term', limit:10, offset: 0}) // accepts JSON object with set of options
        .then(function(data) { // success callback 
          let topArtists = data.body.items
          topArtists.forEach(print)
          function print(value) {
            console.log(value.name)
          }
        }, function(err) { // error callback 
          console.error('Something went wrong!', err)
        })
      
        // get user's top tracks
        spotifyApi.getMyTopTracks({time_range: 'short_term', limit:10, offset: 0})
        .then(function(data) {
          let topTracks = data.body.items
          topTracks.forEach(print)
          function print(value) {
            console.log(value.name)
          }
        }, function(err) {
          console.log('Something went wrong!', err)
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

// setting up a GET route that will be fetched within client side React app 
app.get('/express_backend', (req,res) => {
  res.send({express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'})
})

// important 




