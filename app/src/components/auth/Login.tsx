import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../../config/firebase-config";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import uscnsbe from '../../assets/uscnsbe.png'


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    
    const navigate = useNavigate();
    
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user){
                const userRef = doc(db, "Users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    navigate('/home');
                } else {
                    navigate('/profile')
                }

                
            }
        });
    }, []);



    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
            toast.success("User logged in Successfully", {
                position: "top-center",
            });
        } catch (error: any) {

            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    };

    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
            const user = result.user;
            if (user) {
                const userRef = doc(db, "Users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(doc(db, "Users", user.uid), {
                        email: user.email,
                        fullName: user.displayName,
                        firstName: user.displayName?.split(" ")[0],
                        lastName: user.displayName?.split(" ")[1],
                        photo: user.photoURL
                    });
                }
                toast.success("User logged in Successfully", {
                    position: "top-center",
                });
                navigate("/home");
            }
        });
    }

    return (
        <>
        <div className="auth-wrapper">
            <div className="auth-inner">

                <h3>Login</h3>
                <p style={{textAlign: "center"}}>Use your @usc.edu address</p>
                
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={uscnsbe} width={"90%"}/>
                </div>

                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary" onClick={() => handleSubmit}>
                        Submit
                    </button>
                </div>
                
                <p className="continue-p">&#8212; or continue with &#8212;</p>

                <div className="d-grid">
                    <button className="btn btn-light" onClick={googleLogin}>
                        <img src={"/google.svg"} style={{float: "left", marginRight: "-30px"}}/>
                            Google
                    </button>
                </div>
                
                <p className="forgot-password text-right">
                    New User <a href="/auth/register">Register Here</a>
                </p>

            </div>
        </div>
        </>
  );
}

export default Login;