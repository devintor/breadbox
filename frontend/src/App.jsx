import './App.css';
import './components/listoftodo/ListOfTodo'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useState, useEffect } from 'react';
import ListOfTodo from './components/listoftodo/ListOfTodo';

function App() {
  const [auth, setAuth] = useState(false || window.localStorage.getItem('auth')=='true');
  const [token, setToken] = useState('');


  useEffect(() => {
    firebase.auth().onAuthStateChanged((userCred)=>{
      if(userCred){
        setAuth(true);
        window.localStorage.setItem('auth','true');
        userCred.getIdToken().then((token)=>{
          setToken(token);
        });
      }
    })
  }, []);

  const loginWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((userCred) => {
        if(userCred){
          setAuth(true);
          window.localStorage.setItem('auth','true');
        }
      });
  }
  return (
    <div>
      {auth ? (
        <ListOfTodo token={token}/>
      ) : (
        <button onClick={loginWithGoogle}>Login With Google</button>
      )}
    </div>
  )
}

export default App;