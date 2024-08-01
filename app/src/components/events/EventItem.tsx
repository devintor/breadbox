import { FC } from 'react';
import { EventType } from '../../lib/types';

type Props = {
    item: EventType
}

const EventItem: FC<Props> = ({item}: Props) => {
    return (
        <>
            <p>{item.title}</p>
            <p>{item.description}</p>
        </>
    )
}

export default EventItem;