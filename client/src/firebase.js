import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCpghKtDDicPFsyO1340ZlTqvTv-CLkCR4",
    authDomain: "spotify-circle-76dff.firebaseapp.com",
    databaseURL: "https://spotify-circle-76dff-default-rtdb.firebaseio.com",
    projectId: "spotify-circle-76dff",
    storageBucket: "spotify-circle-76dff.appspot.com",
    messagingSenderId: "641874987404",
    appId: "1:641874987404:web:50997de6851e1f7667aea9",
    measurementId: "G-91M1Y3GKZC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestoredb = firebase.firestore()

export default firestoredb;