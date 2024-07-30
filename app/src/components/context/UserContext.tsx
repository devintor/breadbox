import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";


const UserContext = createContext<User | null>(null);
const ProfileContext = createContext<any>(null);
const IsAuthContext = createContext<boolean | null>(null);

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);


  const fetchProfileData = async () => {
        
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          setIsAuth(true);
          setProfile(docSnap.data());
        } catch (error: any) {
        }
      } else {
        setIsAuth(false);
      }

    })

  };


  useEffect(() => {
      fetchProfileData();
  }, []);

  return (
    <>
    <ProfileContext.Provider value={profile}>
      <UserContext.Provider value={user}>
        <IsAuthContext.Provider value={isAuth}>
          {children}
        </IsAuthContext.Provider>
      </UserContext.Provider>
    </ProfileContext.Provider>
    </>
  );
};

export const useUser = () => {
  return useContext(UserContext);
}

export const useProfile = () => {
  return useContext(ProfileContext);
}

export const useIsAuth = () => {
  return useContext(IsAuthContext);
}