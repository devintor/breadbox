import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
    Activity,
    ArrowUpRight,
    CircleUser,
    CreditCard,
    DollarSign,
    Menu,
    Package2,
    Search,
    Users,
  } from "lucide-react"

  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "../../components/ui/sheet"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"

  import { Button } from "../../components/ui/button"
  import { Input } from "../../components/ui/input"
import { Header } from "../../components/headers/Header";
import Profile from "../../components/auth/Profile";


export function MembersPage({isAuth}) {
    const [members, setMembers] = useState<QueryDocumentSnapshot[]>();

    const fetchMembers = async () => {
        
        try {
            const membersRef = collection(db, "Users");
            const membersSnap = await getDocs(membersRef);
            setMembers(membersSnap.docs);
            
            // setMembers(membersSnap);
            // console.log(members);
        } catch (error: any) {
            console.error(error.message);
        }
        

    };
    
    useEffect(() => {
        fetchMembers();
    }, []);



    return (
    <div className="flex min-h-screen w-full flex-col">
      <Header isAuth={isAuth}/>
      {/* <Profile /> */}
      <h1>Members</h1>
      <ul>
        {members && members.map((member: QueryDocumentSnapshot) => (
            <li key={member.id}>
                <p>&emsp;{member.data().fullName}</p>
                <p>&emsp;&emsp;{member.data().email}</p>
                <img src={member.data().photo} width={"60px"}/>
                &emsp;
            </li>
        ))}
        </ul>
    </div>
    )
}