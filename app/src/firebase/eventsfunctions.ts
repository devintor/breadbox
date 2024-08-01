import { getDocs, collection, addDoc, serverTimestamp, onSnapshot, DocumentSnapshot, Timestamp } from "firebase/firestore"
import { db } from "./firebase-config"
import { EventType } from "../lib/types"


export const streamEvents = (observer: any) => {
    onSnapshot(collection(db, "Events"), observer)
}

export const processEvent = (document: DocumentSnapshot): EventType => {
    if (document) {
        const currentDate = new Date();
        const startDate: Date = document.data()?.startTime.toDate()
        const endDate: Date = document.data()?.endTime.toDate()

        const hours = startDate.getHours();

        const place = document.data()?.place;
        
        
        var status = "Draft"
        if (startDate < currentDate && endDate < currentDate) {
            status = "Past"
        } else if (startDate < currentDate && endDate > currentDate) {
            status = "Active"
        } else if (startDate > currentDate && endDate > currentDate) {
            status = "Upcoming"
        }

        var time = "Overnight";
        if (hours >= 18) {
            time = "Evening";
        } else if (hours >= 12) {
            time = "Afternoon";
        } else if (hours >= 6) {
            time = "Morning";
        }

        var setting = "Indoor";
        if (new RegExp("quad", 'i').test(place)) {
            setting = "Outdoor";
        }

        return {
            id: document.id,
            ...document.data(),
            duration: durationCalc(document.data()?.startTime, document.data()?.endTime),
            time: time,
            status: status,
            setting: setting,
        }

    }
    return {}
}

export const calculateEventStatus = (event: EventType, currentDate: Date): EventType => {
    if (event) {
        const startDate = event.startTime?.toDate();
        const endDate = event.endTime?.toDate();

        var status = "Draft"
        if (startDate && endDate) {
            if (startDate < currentDate && endDate < currentDate) {
                status = "Past"
            } else if (startDate < currentDate && endDate > currentDate) {
                status = "Active"
            } else if (startDate > currentDate && endDate > currentDate) {
                status = "Upcoming"
            }
        }
        
        return {
            ...event,
            status: status
        }
    }

    return {}

}

const durationCalc = (startTime: Timestamp, endTime: Timestamp) => {
    const duration = Math.ceil((endTime.seconds - startTime.seconds) / 1800) * 30;
    return duration;
}



export const createEvent = async (event: EventType) => {
    return await addDoc(collection(db, 'Events'), {
        ...event,
        createdAt: serverTimestamp(),
    })
}