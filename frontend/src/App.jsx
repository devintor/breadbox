import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import React, { useState } from 'react';
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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