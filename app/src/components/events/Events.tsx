import { FC, useEffect, useState } from 'react';
import { getEvents } from '../../firebase/eventsfunctions';
import { EventType } from '../../lib/types';
import EventItem from './EventItem';

const Events: FC = () => {
    
    const [events, setEvents] = useState<EventType[]>()

    useEffect(() => {
        getEvents()
            .then(events => {
                console.log(events)
                setEvents(events)})
    }, [])


    return (
        <>
        {
            events?.map(event => <EventItem key={event.id} item={event} />
            )
        }
        </>
    )
}

export default Events;