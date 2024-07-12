import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext<User | null>(null);
const ProfileContext = createContext<any>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  

  const fetchProfileData = async () => {
        
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          setProfile(docSnap.data());
        } catch (error: any) {
          console.error(error.message)
        }
      }

    })

  };

  useEffect(() => {
      fetchProfileData();
      // console.log(profile);
  }, []);

  return (
    <>
    <ProfileContext.Provider value={profile}>
      <UserContext.Provider value={user}>
      {children}
      </UserContext.Provider>
    </ProfileContext.Provider>
    </>
  );
};

export const useUser = () => {
  // console.log(useContext(UserContext));
  return useContext(UserContext);
}

export const useProfile = () => {
  return useContext(ProfileContext);
}