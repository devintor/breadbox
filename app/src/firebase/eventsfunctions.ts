import { getDocs, collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore"
import { db } from "./firebase-config"
import { EventType } from "../lib/types"

export const getEvents = async (): Promise<EventType[]> => {
    return (
        await getDocs(collection(db, 'Events'))
            .then(result => result.docs)
            .then(docs => docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // title: doc.data().title,
                // description: doc.data().description,
                // company: doc.data().company,
                // food: doc.data().string,
                // place: doc.data().place,
                // image: string,
                // startTime: Timestamp,
                // endTime: Timestamp,
                // createdAt: Timestamp,
                // updatedAt: Timestamp,
                // attendees: DocumentReference[],
                // registrees: DocumentReference[],
                // ratings: number[],
                
                duration: 60,
                setting: "string",
                status: "string",
                time: "string",
            })))
    )
}

export const streamEvents = async (observer) => {
    onSnapshot(collection(db, "Events"), observer)
}

export const createEvent = async (event: EventType) => {
    return await addDoc(collection(db, 'Events'), {
        ...event,
        createdAt: serverTimestamp(),
    })
}