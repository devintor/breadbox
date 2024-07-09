import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase-config";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

function Profile() {
    const [major, setMajor] = useState("");
    const [interests, setInterests] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const majorOptions = 
    [
        "Non-Engineering",
        "Aerospace Engineering",
        "Applied and Computational Mathematics",
        "Applied Mechanics",
        "Astronautical Engineering",
        "Biomedical Engineering",
        "Chemical Engineering",
        "Civil Engineering",
        "Computer Engineering and Computer Science",
        "Computer Science",
        "Computer Science Games",
        "Computer Science & Business Administration",
        "Electrical Engineering",
        "Environmental Engineering",
        "Industrial and Systems Engineering",
        "Mechanical Engineering",
        "Physics/Computer Science",
        "Petroleum Engineering"
    ];
    
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
        
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
                console.log(docSnap.data());
            } else {
                console.log("User is not logged in");
            }
        });

    };
    
    useEffect(() => {
        fetchUserData();
    }, []);

    async function handleLogout() {
        try {
            await auth.signOut();
            window.location.href = "/login";
            console.log("User logged out successfully!");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    }

    async function handleEdit() {
        setIsEditing(true);
    }
    async function handleLeaveEdit() {
        setIsEditing(false);
    }

    async function handleDelete() {
        const user = auth.currentUser;
        try {
            deleteDoc(doc(db, "Users", user.uid));
            await deleteUser(user);
            window.location.href = "/login";
            console.log("User deleted out successfully!");
        } catch (error) {
            console.error("Error deleting user:", error.message);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
          const user = auth.currentUser;
          console.log(user);
          if (user) {
            await setDoc(doc(db, "Users", user.uid), {
              email: user.email,
              photo: user.photoURL,
            //   fullName: fname + " " + lname,
            //   firstName: fname,
            //   lastName: lname,
              major: major
            });
          }
          console.log("User Saved Successfully!!");
        } catch (error) {
          console.log(error.message);
        }
        handleLeaveEdit();
      };

    return (
        <div>
            {userDetails ? (
                <>
                    {isEditing ? (
                        <>
                            <button className="btn btn-secondary" style={{position: "absolute"}} onClick={handleLeaveEdit}>
                                Back
                            </button>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={userDetails.photo}
                                    width={"40%"}
                                    style={{ borderRadius: "50%" }}
                                />
                            </div>
                            <h3>Welcome {userDetails.fullName}</h3>
                            <div>
                                <p>Email: {userDetails.email}</p>
                                <p>First Name: {userDetails.firstName}</p>
                                <p>Last Name: {userDetails.lastName}</p>
                            </div>
                            <div className="mb-3">
                                <label>Major</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={userDetails.major || "Major"}
                                    onChange={(e) => setMajor(e.target.value)}
                                />
                                <select value={major} className="form-control" onChange={(e) => setMajor(e.target.value)} required>
                                    <option value="">{userDetails.major || "Select your major"}</option>
                                    {majorOptions.map((majorOption) => (
                                        <option key={majorOption} value={majorOption}>
                                            {majorOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={handleSave}>
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={userDetails.photo}
                                    width={"40%"}
                                    style={{ borderRadius: "50%" }}
                                />
                            </div>
                            <h3>Welcome {userDetails.fullName}</h3>
                            <div>
                                <p>Email: {userDetails.email}</p>
                                <p>First Name: {userDetails.firstName}</p>
                                <p>Last Name: {userDetails.lastName}</p>
                                <p>Major: {userDetails.major}</p>
                            </div>
                            <button className="btn btn-primary" onClick={handleLogout}>
                                Logout
                            </button>
                            <button className="btn btn-secondary" onClick={handleEdit}>
                                Edit
                            </button>
                        </>
                    )}
                </>
                    
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
export default Profile;