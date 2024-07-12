import { useNavigate } from "react-router-dom";

import { Header } from "../../components/headers/Header";
import { useIsAuth } from "../../components/context/UserContext";
import Profile from "../../components/auth/Profile";


export function ProfilePage() {
    const navigate = useNavigate();
    
    const isAuth = useIsAuth();
    
    if (isAuth==false) {
        navigate("/auth");
    }

    return (
    <div className="flex min-h-screen w-full flex-col">
      <Header/>
        <Profile />
    </div>
    )
}