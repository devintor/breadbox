import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebase-config";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Header } from "../headers/Header";

function Register({isAuth}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
        if (user){
            const userRef = doc(db, "Users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                console.log("User is already logged in\nNavigating to profile");
                navigate('/profile');
            }
            
        }
    });
}, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          fullName: fname + " " + lname,
          firstName: fname,
          lastName: lname,
          photo: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  function toggleVisibility() {
    var pw = document.getElementById("password");
    if (pw.type === "password") {
      pw.type = "text";
    } else {
      pw.type = "password";
    }
  }

  return (
    <>
    <div className="auth-wrapper">
    <div className="auth-inner">
    <form onSubmit={handleRegister}>
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email Address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <button type="button" className="btn" data-toggle="button" aria-pressed="false" autoComplete="off" id="eye" onClick={toggleVisibility}>
            <img src="https://cdn0.iconfinder.com/data/icons/feather/96/eye-16.png" alt="eye" />
        </button>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already Registered? <a href="/login">Login</a>
      </p>
    </form>
    </div>
    </div>
    </>
  );
}
export default Register;