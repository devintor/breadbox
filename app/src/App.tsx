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
import { auth } from "./firebase/firebase-config";

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
import Events from "./components/events/Events";
import CreateEvent from "./components/events/CreateEvent";
import { EventType } from "./lib/types";
import { QuerySnapshot } from "firebase/firestore";
import { streamEvents, processEvent, calculateEventStatus } from "./firebase/eventsfunctions";


function App() {
  const [isAuth, setIsAuth] = useState<boolean>(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  });

  const [time, setTime] = useState(new Date());

  useEffect(()=> {
    setInterval(()=>setTime(new Date()), 1000)
  },[])

  const [events, setEvents] = useState<EventType[]>()

  useEffect(()=> {
    const eventsLive = events?.map(event => calculateEventStatus(event, time))
    
    if (eventsLive) {
      setEvents(eventsLive)
    }
  }, [time])

  useEffect(() => {
      const unsubscribe = streamEvents({
        next: (querySnapshot: QuerySnapshot) => {
          const events = querySnapshot
            .docs.map(docSnapshot => processEvent(docSnapshot))
            .sort((a, b) => {
              if (!a.startTime) return 1;
              if (!b.startTime) return -1;
              return a.startTime.seconds - b.startTime.seconds;
            });
          console.log(events);
          setEvents(events);
        },
          error: (error: Error) => console.log(error)
      })
      return unsubscribe;
  }, [setEvents])

  
  return (
    <ContextProvider>
      <TooltipProvider>
        <Router>
          <div className="App">
            <Header />
            <p>{time.toLocaleTimeString()}</p>
                <Routes>
                  <Route index element={<HomePage />} />
                  
                
                  <Route path="/admin/events" element={isAuth ? <EventsPage events={events || []} /> : <Navigate to='/auth' />} />
                  <Route path="/admin/events/:eventId/edit" element={isAuth ? <EventsEditPage events={events || []} /> : <Navigate to='/auth' />} />
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
    // <Router>
    //   <Routes>
    //     <Route path="/admin/events" element={<EventsPage events={events || []} />} />
    //     <Route path="/admin/events/create" element={<CreateEvent />} />
    //   </Routes>
    // </Router>
  );
}

export default App;