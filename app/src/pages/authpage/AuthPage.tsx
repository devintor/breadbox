import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { Header } from "../../components/headers/Header";
import Login from "../../components/auth/Login";
import { useIsAuth } from "../../components/context/UserContext";
import Register from "../../components/auth/Register";


export function AuthPage() {
    const navigate = useNavigate();
    
    const isAuth = useIsAuth();
    if (isAuth) {
        navigate("/home");
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header/>
            <Routes>
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Routes>

            <Outlet />
        </div>
    )
}