
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase-config";
import { setDoc, getDoc, doc } from "firebase/firestore";
const interestOptions = 
    [
        "Software Engineering",
        "Consulting",
        "Product Management",
        "Product Engineering",
        "Engineering Management",
        "Supply Chain",
        "Automotive Engineering",
        "Finance/Fin-tech",
        "Aerospace Engineering"
    ]
function NewEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [company, setCompany] = useState("");
  const [interests, setInterests] = useState([]);
  const [usersRsvp, setUsersRsvp] = useState([]);
  const [usersAttended, setUsersAttended] = useState([]);
  
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(db, "Events", );
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        await setDoc(eventRef, {
          id: eventRef.id,
          title,
          date,
          company,
          interests,
          usersRsvp,
          usersAttended
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleCreateEvent}>
          <h3>Create Event</h3>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              placeholder="Date"
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Company</label>
            <input
              type="text"
              className="form-control"
              placeholder="Company"
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Interests</label>
            <select value={interests} onChange={(e) => setInterests(e.target.value)}>
              {interestOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Users RSVP</label>
            <textarea
              className="form-control"
              placeholder="Users RSVP"
              onChange={(e) => setUsersRsvp(e.target.value.split(","))}
              required
            />
          </div>
          <div className="mb-3">
            <label>Users Attended</label>
            <textarea
              className="form-control"
              placeholder="Users Attended"
              onChange={(e) => setUsersAttended(e.target.value.split(","))}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewEvent;