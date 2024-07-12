import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase-config";
import { deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
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
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";


export function AuthPage({isAuth}) {
    const navigate = useNavigate();

    if (isAuth) {
        navigate("/home");
    }

    return (
    <div className="flex min-h-screen w-full flex-col">
      <Header isAuth={isAuth}/>
        <Login />
    </div>
    )
}