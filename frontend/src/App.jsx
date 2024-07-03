// import './App.css';
// import './components/listoftodo/ListOfTodo'
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import { useState, useEffect } from 'react';
// import ListOfTodo from './components/listoftodo/ListOfTodo';

// function App() {
//   const [auth, setAuth] = useState(false || window.localStorage.getItem('auth')=='true');
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     firebase.auth().onAuthStateChanged((userCred)=>{
//       if(userCred){
//         setAuth(true);
//         window.localStorage.setItem('auth','true');
//         userCred.getIdToken().then((token)=>{
//           setToken(token);
//         });
//       }
//     })
//   }, []);

//   const provider = new firebase.auth.GoogleAuthProvider();
//   provider.setCustomParameters({
//     'login_hint': 'user@usc.edu'
//   });

//   const loginWithGoogle = () => {
//     firebase
//       .auth()
//       .signInWithPopup(provider)
//       .then((userCred) => {
//         if(userCred){
//           setAuth(true);
//           window.localStorage.setItem('auth','true');
//         }
//       });
//   }
//   return (
//     <div>
//       {auth ? (
//         <ListOfTodo token={token}/>
//       ) : (
//         <button onClick={loginWithGoogle}>Login With Google</button>
//       )}
//     </div>
//   )
// }

// export default App;

import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/Register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/Profile";
import { useState } from "react";
import { auth } from "./config/firebase-config";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/profile" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;