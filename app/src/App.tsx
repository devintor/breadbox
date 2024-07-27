import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";


import { Header } from "./components/headers/Header";

import { HomePage } from "./pages/homepage/HomePage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { auth } from "./config/firebase-config";
import { User } from 'firebase/auth';

import { ContextProvider } from "./components/context/UserContext";
import { AuthPage } from "./pages/authpage/AuthPage";
import { EventsPage } from "./pages/eventspage/EventsPage";
import { EventsEditPage } from "./pages/eventspage/EventsEditPage";
import { MembersPage } from "./pages/memberspage/MembersPage";
import { ProfilePage } from "./pages/profilepage/ProfilePage";
import { Dashboard } from "./pages/nav-samples/Dashboard";
import { Settings } from "./pages/nav-samples/Settings";
import { Transactions } from "./pages/nav-samples/Transactions";
import { TooltipProvider } from "./components/ui/tooltip";
import { EventsQueriedPage } from "./pages/eventspage/EventsQueriedPage";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(true);

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
      <TooltipProvider>
    <Router>
      <div className="App">
      
        <Header />
            <Routes>
              <Route index element={<HomePage />} />
              
            
              <Route path="/admin/events" element={isAuth ? <EventsPage /> : <Navigate to='/auth' />} />
              <Route path="/admin/events/:eventParam/edit" element={isAuth ? <EventsEditPage /> : <Navigate to='/auth' />} />
              <Route path="/admin/members" element={isAuth ? <MembersPage /> : <Navigate to='/auth' />} />
              <Route path="/admin/dashboard" element={isAuth ? <Dashboard /> : <Navigate to='/auth' />} />
              <Route path="/admin/transactions" element={isAuth ? <Transactions /> : <Navigate to='/auth' />} />
              <Route path="/admin/settings" element={isAuth ? <Settings /> : <Navigate to='/auth' />} />

              <Route path="/profile" element={isAuth ? <ProfilePage /> : <Navigate to='/auth' />} />

              <Route path="*" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/events" element={<HomePage />} />
              
              <Route path="/events/search/:searchParam" element={<EventsQueriedPage />} />
              <Route path="/auth/*" element={<AuthPage />} />
            </Routes>
            <ToastContainer/>
      </div>
    </Router>
    </TooltipProvider>
    </ContextProvider>
  );
}

export default App;