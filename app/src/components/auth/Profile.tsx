import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Header } from "../headers/Header";

export default function Profile() {

    const [profileLocal, setProfileLocal] = useState<any>();
    console.log(profileLocal);

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

    // const interestOptions = 
    // [
    //     "Software Engineering",
    //     "Consulting",
    //     "Product Management",
    //     "Product Engineering",
    //     "Engineering Management",
    //     "Supply Chain",
    //     "Automotive Engineering",
    //     "Finance/Fin-tech",
    //     "Aerospace Engineering"
    // ]
    
    const navigate = useNavigate();
    
    const fetchProfileData = async () => {
        
        auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/auth');
            } else if (user) {
                try {
                    const docRef = doc(db, "Users", user.uid);
                    const docSnap = await getDoc(docRef);
                    setProfileLocal(docSnap.data());
                    console.log(docSnap);
                } catch {
                    
                }
            }
            
        })

        
        

    };
    
    useEffect(() => {
        fetchProfileData();
    }, []);

    console.log(profileLocal);

    async function handleLogout() {
        try {
            await auth.signOut();
            console.log("User logged out successfully!");
            toast.success("User logged out successfully!", {
                position: "top-center",
              });
            navigate(-1);
        } catch (error: any) {
            console.error("Error logging out:", error.message);
            toast.error(error.message, {
                position: "bottom-center",
              });
        }
    }


    async function handleDelete() {
        const user = auth.currentUser;

        if (user) {
            try {

                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
                deleteDoc(doc(db, "Users", user.uid));
                await deleteUser(user);
                console.log("User deleted successfully!");
                toast.success("User deleted successfully!", {
                    position: "top-center",
                });
                
                
                navigate('/auth');
            } catch (error: any) {
                console.error("Error deleting user:", error.message);
                toast.error(error.message, {
                    position: "bottom-center",
                  });
            }
        }
    
    }

    async function handleEditProfile() {
        try {
          const user = auth.currentUser;
          console.log(user);
          if (user) {
            const { firstName, lastName, major } = profileLocal;

            if (!firstName || !lastName || !major) {
                return toast.error("All fields are required", {
                    position: "bottom-center",
                });
            }
            await updateDoc(doc(db, "Users", user.uid), {
              ...profileLocal,
            });
          }
          console.log("User Saved Successfully!!");
          toast.success("User Saved Successfully!!", {
            position: "top-center",
          });
        } catch (error: any) {
          console.log(error.message);
          toast.error(error.message, {
            position: "bottom-center",
          });
        }
      };

    return (
    <>
    <div className="auth-wrapper">
        <div className="auth-inner">
            {profileLocal ? (
                <>
                    {(console.log(profileLocal))}
                            <button className="btn btn-secondary" style={{position: "absolute"}} onClick={() => {navigate(-1)}}>
                                Back
                            </button>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={profileLocal.photo}
                                    width={"40%"}
                                    style={{ borderRadius: "50%" }}
                                />
                            </div>
                            <h3>Welcome {profileLocal?.fullName}</h3>
                            {/* <div>
                                <p>Email: {profileLocal.email}</p>
                                <p>First Name: {profileLocal.firstName}</p>
                                <p>Last Name: {profileLocal.lastName}</p>
                            </div> */}

                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profileLocal?.email}
                                    // placeholder="Last Name"
                                    onChange={(e) => {
                                        setProfileLocal((prevProfileLocal: any) => ({
                                            ...prevProfileLocal,
                                            email: e.target.value,
                                        }))}}
                                />
                            </div>

                            <div className="mb-3">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profileLocal?.firstName}
                                    // placeholder="First Name"
                                    onChange={(e) => {
                                        setProfileLocal((prevProfileLocal: any) => ({
                                            ...prevProfileLocal,
                                            firstName: e.target.value,
                                            fullName: e.target.value + " " + prevProfileLocal.lastName
                                        }))}}
                                />
                            </div>

                            <div className="mb-3">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profileLocal?.lastName}
                                    // placeholder="Last Name"
                                    onChange={(e) => {
                                        setProfileLocal((prevProfileLocal: any) => ({
                                            ...prevProfileLocal,
                                            lastName: e.target.value,
                                            fullName: prevProfileLocal.firstName + " " + e.target.value
                                        }))}}
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label>Major</label>
                                <select value={profileLocal?.major} className="form-control" onChange={(e) => {
                                    setProfileLocal((prevProfileLocal: any) => ({
                                        ...prevProfileLocal,
                                        major: e.target.value,
                                    }))}} required>
                                    <option value="">{profileLocal?.major || "Select your major"}</option>
                                    {majorOptions.map((majorOption) => (
                                        <option key={majorOption} value={majorOption}>
                                            {majorOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button className="btn btn-primary" onClick={handleEditProfile}>
                                Save Changes
                            </button>
                            <button className="btn btn-primary" onClick={handleLogout}>
                                Log Out
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete Account
                            </button>
                        
                </>
                    
            ) : (
                <p>Loading...</p>
            )}
        </div>
    </div>
    </>
    );
}

export async function handleLogout() {
    try {
        await auth.signOut();
        console.log("User logged out successfully!");
        toast.success("User logged out successfully!", {
            position: "top-center",
          });
    } catch (error: any) {
        console.error("Error logging out:", error.message);
        toast.error(error.message, {
            position: "bottom-center",
          });
    }
}