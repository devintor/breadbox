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
import { Badge } from "../../components/ui/badge";


export function HomePage() {
    
    return (
    <div className="flex min-h-screen w-full flex-col">
      <Header/>
      {/* <Profile /> */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <Badge>Platform</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                  Something new!
                </h2>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                  Managing a small business today is already tough.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2"></div>
                <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
                <p className="text-muted-foreground text-base">
                  Our goal is to streamline SMB trade, making it easier and faster
                  than ever.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2"></div>
                <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
                <p className="text-muted-foreground text-base">
                  Our goal is to streamline SMB trade, making it easier and faster
                  than ever.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2"></div>
                <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
                <p className="text-muted-foreground text-base">
                  Our goal is to streamline SMB trade, making it easier and faster
                  than ever.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2"></div>
                <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
                <p className="text-muted-foreground text-base">
                  Our goal is to streamline SMB trade, making it easier and faster
                  than ever.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2"></div>
                <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
                <p className="text-muted-foreground text-base">
                  Our goal is to streamline SMB trade, making it easier and faster
                  than ever.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-muted rounded-md aspect-video mb-2"></div>
                <h3 className="text-xl tracking-tight">Pay supplier invoices</h3>
                <p className="text-muted-foreground text-base">
                  Our goal is to streamline SMB trade, making it easier and faster
                  than ever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}