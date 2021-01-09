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

//  Initialize Firestore
const db = firebase.firestore();

// Getter functions
export const getFriendsList = userId => {
    return db.collection('users').doc(userId).collection('friendsList').get();
};

export const getTopTracks = userId => {
    return db.collection('users').doc(userId).get('topTracks');
};

export const getTopArtists = userId => {
    return db.collection('users').doc(userId).get('topArtists');
};

export const getTopGenres = userId => {
    return db.collection('users').doc(userId).get('topGenres');
}


// If friend is registered in database, add friend doc to user's friend list in firebase and vice versa
export const addNewFriend = (userId, friendId) => {
    let friendRef = db.collection('users').doc(friendId);
    let userRef = db.collection('users').doc(userId);

    // Check that friendId is a valid id in users collection
    friendRef.get().then(function(doc) {
        if (doc.exists) {
            // Check if friend exists in user's friendlist
            userRef.collection('friendsList').doc(friendId).get().then(function(doc) {
                if (doc.exists) {
                    console.log('Friend ' + friendId + 'already exists in user friendList');
                } else {
                    // Add friend to user's friendlist
                    db.collection('users').doc(userId).collection('friendsList').doc(friendId).set({
                        similarityScore: null
                    })
                    .then(function() {
                        console.log("Friend's document successfully written to user's friends list!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });

                    // Add user to friend's friendlist
                    db.collection('users').doc(friendId).collection('friendsList').doc(userId).set({
                        similarityScore: null
                    })
                    .then(function() {
                        console.log("User's document successfully written to friend's friends list!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });
                    }
            }).catch(function(error) {
                    console.log("Error getting document:", error);
            }); 
        } else {
            // doc.data() will be undefined in this case
            console.log("Friend does not exist in database!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
};

// Write similarity score into both user's and friend's documents within respective friend lists
export const saveSimilarityScore = (userId, friendId, similarityScore) => {
    // Note: firestore does not allow repeating fields in a document

    // Add or overwrite similarity score for friend's document within user's friendList
    db.collection('users').doc(userId).collection('friendsList').doc(friendId).set({
        similarityScore: similarityScore
    })
    .then(function() {
        console.log("Similarity score successfully written into user's friend list!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    // Add or overwrite similarity score for user's  document within friend's friendList
    db.collection('users').doc(friendId).collection('friendsList').doc(userId).set({
        similarityScore: similarityScore
    })
    .then(function() {
        console.log("Similarity score successfully written to friend's friends list!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
};
