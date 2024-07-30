import { FC, useEffect, useState } from 'react';
import { getEvents, streamEvents } from '../../firebase/eventsfunctions';
import { EventType } from '../../lib/types';
import EventItem from './EventItem';
import { useNavigate } from 'react-router-dom';
import { DocumentSnapshot, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const Events: FC = () => {
    const [events, setEvents] = useState<EventType[]>()
    const navigate = useNavigate();

    const mapDocToEvent = (document: DocumentSnapshot): EventType => {
        return {
            id: document.id,
            ...document.data()
        }
    }

    useEffect(() => {
        streamEvents({
            next: (querySnapshot: QuerySnapshot) => {
                const events = querySnapshot
                    .docs.map(docSnapshot => mapDocToEvent(docSnapshot))
                console.log(events)
                setEvents(events)
            },
            error: (error: Error) => console.log(error)
        })
    }, [setEvents])


    return (
        <>
        <button onClick={() => navigate('/admin/events/create')}>+</button>
        {
            events?.map(event => <EventItem key={event.id} item={event} />
            )
        }
        </>
    )
}

export default Events;