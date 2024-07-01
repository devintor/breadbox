import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import React, { useState } from 'react';
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyACtvwa5uXyqLiUrGL_7YsrzdJMUpg6YYQ",
  authDomain: "nsbebreadbox.firebaseapp.com",
  projectId: "nsbebreadbox",
  storageBucket: "nsbebreadbox.appspot.com",
  messagingSenderId: "409133768719",
  appId: "1:409133768719:web:85d1205787c3a58f8fc37a",
  measurementId: "G-Z47467K4M9"
};

const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);

const auth = getAuth(firebase);

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      console.log(result);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      setUser(result.user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      
      console.log(error)
    });
  }
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}!</h1>
          <p>Your email address is {user.email}</p>
          <button onClick={() => 
            signOut(auth).then(() => {
              console.log("Sign-out successful.");
              window.location.reload();
            }).catch((error) => {
              console.log("An error happened.");
            })
          }>Sign out</button>
        </div>
      ) : (
        <div>
          <button onClick={handleSignIn}>Sign in with Google</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
export default App;