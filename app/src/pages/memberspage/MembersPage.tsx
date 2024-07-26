import { useEffect, useState } from "react";
import { db } from "../../config/firebase-config";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";

export function MembersPage() {
    const [members, setMembers] = useState<QueryDocumentSnapshot[]>();

    const fetchMembers = async () => {
        
        try {
            const membersRef = collection(db, "Users");
            const membersSnap = await getDocs(membersRef);
            setMembers(membersSnap.docs);
            
        } catch (error: any) {
        }
        

    };
    
    useEffect(() => {
        fetchMembers();
    }, []);



    return (
    <div className="flex min-h-screen w-full flex-col">
      <h1>Members</h1>
      <ul>
        {members && members.map((member: QueryDocumentSnapshot) => (
            <li key={member.id}>
                <p>&emsp;{member.data().fullName}</p>
                <p>&emsp;&emsp;{member.data().email}</p>
                <img src={member.data().photo || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"} width={"60px"}/>
                &emsp;
            </li>
        ))}
        </ul>
    </div>
    )
}