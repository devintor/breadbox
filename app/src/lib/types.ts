import { DocumentReference, Timestamp } from "firebase/firestore"

export type EventType = {
    id: string,
    title?: string,
    description?: string,
    company?: string,
    food?: string,
    place?: string,
    image?: string,
    startTime?: Timestamp,
    endTime?: Timestamp,
    createdAt?: Timestamp,
    updatedAt?: Timestamp,
    attendees?: DocumentReference[],
    registrees?: DocumentReference[],
    ratings?: number[],
    projection?: any,
    
    duration?: number,
    setting?: string,
    status?: string,
    time?: string,
}