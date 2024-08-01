import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";
import { QueryDocumentSnapshot, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge";


export function HomePage() {
  
  const [events, setEvents] = useState<QueryDocumentSnapshot[]>();

  const average = (array: number[]) => {
    var sum = 0;
    
    array.forEach(element => {
      sum += element;
    });

    return (sum / array.length);
  }
  
  const fetchEvents = async () => {
      
    try {
        const eventsRef = collection(db, "Events");
        const eventsSnap = await getDocs(eventsRef);
        setEvents(eventsSnap.docs);

    } catch (error: any) {
    }
    
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="w-full py-20 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <Badge>Platform</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                  Upcoming Events
                </h2>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                  See what we have planned this semester
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 py-12 md:px-6 lg:px-8">
              {events?.map((event) => (
                <div key={event.id} className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link to="#" className="block">
                    <img src={event.data().image || '/placeholder.svg'} alt={event.data().title} width={600} height={400} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{event.data().title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {event.data().description}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4">
                          Avg Rating: {event.data().ratings && average(event.data().ratings)}
                      </p>
                      <Button variant="link">Read More</Button>
                    </div>
                  </Link>
                  
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
    )
}