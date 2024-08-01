import { getDocs, collection, addDoc, serverTimestamp, onSnapshot, DocumentSnapshot, Timestamp, deleteDoc, doc } from "firebase/firestore"
import { db } from "./firebase-config"
import { EventType } from "../lib/types"
import { toast } from "react-toastify";

const durationCalc = (startTime: Timestamp, endTime: Timestamp) => {
    const duration = Math.ceil((endTime.seconds - startTime.seconds) / 1800) * 30;
    return duration;
}

export const streamEvents = (observer: any) => {
    onSnapshot(collection(db, "Events"), observer)
}

export const processEvent = (document: DocumentSnapshot): EventType => {
    if (document) {
        var event: EventType = {
            id: document.id,
            ...document.data()
        }

        const startDate: Date = document.data()?.startTime?.toDate()
        
        const hours = startDate?.getHours();
        if (hours) {
            if (hours >= 18) {
                event.time = "Evening";
            } else if (hours >= 12) {
                event.time = "Afternoon";
            } else if (hours >= 6) {
                event.time = "Morning";
            } else if (hours < 6) {
                event.time = "Overnight";
            }
        }

        const place = document.data()?.place;
        if (place) {
            if (new RegExp("quad", 'i').test(place)) {
                event.setting = "Outdoor";
            } else {
                event.setting = "Indoor";
            }
        }
        
        if (document.data()?.startTime && document.data()?.endTime) {
            event.duration = durationCalc(document.data()?.startTime, document.data()?.endTime)
        }
        

        return event
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

export const createEvent = () => {
    // const navigate = useNavigate();
    return addDoc(collection(db, "Events"), {
        title: "Untitled Event",
        status: "Draft",
        createdAt: serverTimestamp()
    })
  };

export const handleDeleteEvent = (eventId: string) => {
    try {
        deleteDoc(doc(db, "Events", eventId));
        toast.success("Event deleted successfully!", {
            position: "top-center",
        });
    } catch (error: any) {
        toast.error(error.message, {
            position: "bottom-center",
            });
    }
}



