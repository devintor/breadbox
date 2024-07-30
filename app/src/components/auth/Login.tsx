import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../../config/firebase-config";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import uscnsbe from '../../assets/uscnsbe.png'
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


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



    const handleSubmit = async () => {
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

//     return (
//         <>
//         <div className="auth-wrapper">
//             <div className="auth-inner">

//                 <h3>Login</h3>
//                 <p style={{textAlign: "center"}}>Use your @usc.edu address</p>
                
//                 <div style={{ display: "flex", justifyContent: "center" }}>
//                     <img src={uscnsbe} width={"90%"}/>
//                 </div>

//                 <div className="mb-3">
//                     <label>Email address</label>
//                     <input
//                         type="email"
//                         className="form-control"
//                         placeholder="Enter email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label>Password</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         placeholder="Enter password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>

//                 <div className="d-grid">
//                     <button className="btn btn-primary" onClick={handleSubmit}>
//                         Submit
//                     </button>
//                 </div>
                
//                 <p className="continue-p">&#8212; or continue with &#8212;</p>

//                 <div className="d-grid">
//                     <button className="btn btn-light" onClick={googleLogin}>
//                         <img src={"/google.svg"} style={{float: "left", marginRight: "-30px"}}/>
//                             Google
//                     </button>
//                 </div>
                
//                 <p className="forgot-password text-right">
//                     New User <a href="/auth/register">Register Here</a>
//                 </p>

//             </div>
//         </div>
//         </>
//   );

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                    Use your @usc.edu address
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={uscnsbe} width={"90%"}/>
                </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to=""
                      className="ml-auto inline-block text-sm underline text-muted-foreground"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                  
                </div>
                <Button variant="default" type="submit" className="w-full" onClick={handleSubmit}>
                  Submit
                </Button>
                {/* <p className="text-balance text-muted-foreground text-center text-xs">&#8212; or continue with &#8212;</p>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
                <div className="relative flex items-center">
                    <img src={"/google.svg"} className="absolute ml-3 h-5 w-5"/>
                    <Button variant="outline" className="pr-3 pl-8 w-full" onClick={googleLogin}>
                        Login with Google
                    </Button>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account? <a href="/auth/register" className="underline text-primary">Sign Up</a>
                {/* <Link to="/auth/register" className="underline">
                  Sign up
                </Link> */}
              </p>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      )
}

export default Login;