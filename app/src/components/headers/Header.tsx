import { Link, useNavigate } from "react-router-dom";

import {
    CircleUser,
    Menu,
  } from "lucide-react"

  import {
    Sheet,
    SheetContent,
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


  import { useProfile, useIsAuth } from "../context/UserContext";
import { handleLogout } from "../auth/Profile";

import uscnsbe from "../../assets/uscnsbe.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FuzzyishSearchBar } from "../events/FuzzyishSearchBar";

export function Header() {
  const isAuth = useIsAuth();
  const profile = useProfile();

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/home"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Button variant="ghost" size="icon"><img src={uscnsbe} width="85%"></img></Button>
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            to="/admin/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Requests*
          </Link>
          <Link
            to="/admin/transactions"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Transactions
          </Link>
          <Link
            to="/admin/events"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Events
          </Link>
          <Link
            to="/admin/members"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Members
          </Link>
          <Link
            to="/admin/settings"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/home"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Button variant="ghost" size="icon"><img src={uscnsbe} width="85%"></img></Button>
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                to="/admin/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Requests
              </Link>
              <Link
                to="/admin/transactions"
                className="text-muted-foreground hover:text-foreground"
              >
                Transactions
              </Link>
              <Link
                to="/admin/events"
                className="text-muted-foreground hover:text-foreground"
              >
                Events
              </Link>
              <Link
                to="/admin/members"
                className="text-muted-foreground hover:text-foreground"
              >
                Members
              </Link>
              <Link
                to="/admin/settings"
                className="hover:text-foreground"
              >
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <FuzzyishSearchBar/>
          {isAuth==null ? (
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser color="white" className="h-6 w-6" />  
                <span className="sr-only">Toggle user menu</span>
            </Button>
          ) : (
            isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-full w-full sm:flex">
                      <AvatarImage src={profile.photo} alt="Avatar" />
                      <AvatarFallback>{profile.firstName[0] + profile.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile"><DropdownMenuItem>Edit profile</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" className="rounded-full px-2" onClick={() => {navigate('/auth')}}>
               <CircleUser color="white" className="h-6 w-6" />  
                 <span style={{marginLeft: "5px", marginRight: "5px"}}>Sign In</span>
               </Button>
            )
          )
        }
        </div>
      </header>
  )
}