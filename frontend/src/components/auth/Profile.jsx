import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile() {
    // const [fname, setFname] = useState("");
    // const [lname, setLname] = useState("");
    // const [major, setMajor] = useState("");
    // const [interests, setInterests] = useState([]);
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
    
    const navigate = useNavigate();
    
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            try {
                const docRef = doc(db, "Users", user.uid);
                const docSnap = await getDoc(docRef);
                setUserDetails(docSnap.data());
                console.log(docSnap.data());
            } catch {
                navigate('/login');
            }
        })
        

    };
    
    useEffect(() => {
        fetchUserData();
    }, []);

    async function handleLogout() {
        try {
            await auth.signOut();
            console.log("User logged out successfully!");
            toast.success("User logged out successfully!", {
                position: "top-center",
              });
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error.message);
            toast.error(error.message, {
                position: "bottom-center",
              });
        }
    }

    async function handleEdit() {
        setIsEditing(true);
    }
    async function handleLeaveEdit() {
        setIsEditing(false);
    }

    async function handleDelete() {
        try {
            const user = auth.currentUser;

            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(user, provider);
            deleteDoc(doc(db, "Users", user.uid));
            await deleteUser(user);
            console.log("User deleted successfully!");
            toast.success("User deleted successfully!", {
                position: "top-center",
            });
            
            
            navigate('/login');
        } catch (error) {
            console.error("Error deleting user:", error.message);
            toast.error(error.message, {
                position: "bottom-center",
              });
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();

        try {
          const user = auth.currentUser;
          console.log(user);
          if (user) {
            const { firstName, lastName, major } = userDetails;

            if (!firstName || !lastName || !major) {
                return toast.error("All fields are required", {
                    position: "bottom-center",
                });
            }
            await setDoc(doc(db, "Users", user.uid), {
              email: userDetails.email,
              photo: userDetails.photo,
              firstName,
              lastName,
              fullName: `${firstName} ${lastName}`,
              major
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
        handleLeaveEdit();
      };

    return (
    <div className="auth-wrapper">
        <div className="auth-inner">
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
                            {/* <div>
                                <p>Email: {userDetails.email}</p>
                                <p>First Name: {userDetails.firstName}</p>
                                <p>Last Name: {userDetails.lastName}</p>
                            </div> */}

                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userDetails.email}
                                    // placeholder="Last Name"
                                    onChange={(e) => {
                                        setUserDetails((prevUserDetails) => ({
                                            ...prevUserDetails,
                                            email: e.target.value,
                                        }))}}
                                />
                            </div>

                            <div className="mb-3">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userDetails.firstName}
                                    // placeholder="First Name"
                                    onChange={(e) => {
                                        setUserDetails((prevUserDetails) => ({
                                            ...prevUserDetails,
                                            firstName: e.target.value,
                                        }))}}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userDetails.lastName}
                                    // placeholder="Last Name"
                                    onChange={(e) => {
                                        setUserDetails((prevUserDetails) => ({
                                            ...prevUserDetails,
                                            lastName: e.target.value,
                                        }))}}
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label>Major</label>
                                <select value={userDetails.major} className="form-control" onChange={(e) => {
                                    setUserDetails((prevUserDetails) => ({
                                        ...prevUserDetails,
                                        major: e.target.value,
                                    }))}} required>
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
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete Account
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-secondary" style={{position: "absolute"}} onClick={handleEdit}>
                                Edit
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
                                <p>Major: {userDetails.major}</p>
                            </div>
                            <button className="btn btn-primary" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </>
                    
            ) : (
                <p>Loading...</p>
            )}
        </div>
    </div>
    );
}
export default Profile;