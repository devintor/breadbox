import { FC, useEffect, useState } from 'react';
import { processEvent, streamEvents } from '../../firebase/eventsfunctions';
import { EventType } from '../../lib/types';
import EventItem from './EventItem';
import { useNavigate } from 'react-router-dom';
import { QuerySnapshot } from 'firebase/firestore';

const Events: FC = () => {
    const [events, setEvents] = useState<EventType[]>()
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = streamEvents({
            next: (querySnapshot: QuerySnapshot) => {
                const events = querySnapshot
                    .docs.map(docSnapshot => processEvent(docSnapshot))
                console.log(events)
                setEvents(events)
            },
            error: (error: Error) => console.log(error)
        })
        return unsubscribe;
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