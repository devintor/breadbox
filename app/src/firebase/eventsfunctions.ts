import { getDocs, collection, addDoc, serverTimestamp, onSnapshot, DocumentSnapshot } from "firebase/firestore"
import { db } from "./firebase-config"
import { EventType } from "../lib/types"


export const streamEvents = (observer: any) => {
    onSnapshot(collection(db, "Events"), observer)
}

export const processEvent = (document: DocumentSnapshot): EventType => {
    
    
    return {
        id: document.id,
        ...document.data(),
        
    }
}

export const createEvent = async (event: EventType) => {
    return await addDoc(collection(db, 'Events'), {
        ...event,
        createdAt: serverTimestamp(),
    })
}