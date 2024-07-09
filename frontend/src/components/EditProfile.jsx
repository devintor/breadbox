import React, { useEffect, useState } from "react";
import { deleteUser } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

function EditProfile() {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [major, setMajor] = useState("");
    const [interests, setInterests] = useState([]);
  
    const [userDetails, setUserDetails] = useState(null);
  
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (!user){
        window.location.href = "/login" // no profile to display --> back to login
      }
        console.log(user);

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          fullName: fname + " " + lname,
          firstName: fname,
          lastName: lname,
          major: major
        });
      }
      console.log("User Saved Successfully!!");
      toast.success("User Saved Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };


  // replace with handle Delete
  async function handleDelete() {
    auth.onAuthStateChanged(async (user) => {
        try {
            await deleteUser(user);
            window.location.href = "/login";
            console.log("User deleted out successfully!");
        } catch (error) {
            console.error("Error deleting user:", error.message);
        }
    });
  }


  return (
    <div>
        {userDetails ? (
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
                </div>
                <select value={major} onChange={(e) => setMajor(e.target.value)} required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                </button>
            </>
        ) : (
            <p>Loading...</p>
        )}
    </div>
  );
}
export default EditProfile;