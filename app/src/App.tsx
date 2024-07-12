import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// styles for this kit
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import Register from "./components/auth/Register";

import NewEvent from "./components/events/NewEvent";
import { Header } from "./components/headers/Header";

// import pages
import { HomePage } from "./pages/homepage/HomePage";
// import LandingPage from "./components/homepage/HomePage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { auth } from "./config/firebase-config";
import { User } from 'firebase/auth';

import { ContextProvider } from "./components/context/UserContext";
import { AuthPage } from "./pages/authpage/AuthPage";
import { EventsPage } from "./pages/eventspage/EventsPage";
import { MembersPage } from "./pages/memberspage/MembersPage";
import { ProfilePage } from "./pages/profilepage/ProfilePage";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  });
  
  return (
    <ContextProvider>
    <Router>
      <div className="App">
      
        {/* <Header /> */}
            <Routes>
              {/* <Route
                path="/"
                element={user ? <Navigate to="/profile" /> : <Login />}
              /> */}
              <Route index element={<HomePage />} />
              
              <Route path="/home" element={<HomePage />} />
              <Route path="/auth/*" element={<AuthPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/members" element={<MembersPage/>} />

              <Route path="/profile" element={<ProfilePage />} />

              {/* implement this later */}
              {/* <Route path="*" element={<NoMatch />} /> */}

              {/* <Route path="/login" element={<Login isAuth={isAuth}/>} />
              <Route path="/register" element={<Register isAuth={isAuth}/>}/>
              <Route path="/events/new" element={<NewEvent/>} /> */}
              
            </Routes>
            <ToastContainer/>
      </div>
    </Router>

    </ContextProvider>
  );
}

export default App;