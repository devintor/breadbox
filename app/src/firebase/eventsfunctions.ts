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
        const startDate: Date = document.data()?.startTime?.toDate()
        
        const hours = startDate?.getHours();

        const place = document.data()?.place;

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

        var duration;
        if (document.data()?.startTime && document.data()?.endTime) {
            duration = durationCalc(document.data()?.startTime, document.data()?.endTime)
        }
        

        return {
            id: document.id,
            ...document.data(),
            duration: duration,
            time: time,
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



