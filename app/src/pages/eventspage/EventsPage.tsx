
import {
    File,
    ListFilter,
    PlusCircle,
    MoreHorizontal,
  } from "lucide-react"


  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"

  import { Button } from "../../components/ui/button"
  import { Badge } from "../../components/ui/badge"
import { Header } from "../../components/headers/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useEffect, useState } from "react";
import { QueryDocumentSnapshot, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export function EventsPage() {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<QueryDocumentSnapshot[]>();

  const createEvent = async () => {
    
  }

  const fetchEvents = async () => {
      
      try {
          const eventsRef = collection(db, "Events");
          const eventsSnap = await getDocs(eventsRef);
          setEvents(eventsSnap.docs);

          console.log(events);
      } catch (error: any) {
          console.error(error.message);
      }
      
  };

  async function handleDeleteEvent(eventId: string) {

    try {
        deleteDoc(doc(db, "Events", eventId));
        console.log("Event deleted successfully!");
        toast.success("Event deleted successfully!", {
            position: "top-center",
        });

        fetchEvents();
    } catch (error: any) {
        console.error("Error deleting event:", error.message);
        toast.error(error.message, {
            position: "bottom-center",
          });
    }
}
  
  useEffect(() => {
      fetchEvents();
  }, []);

  

  // return (
  //   <div className="flex min-h-screen w-full flex-col">
  //     <Header/>
  //     {/* <h1>Events</h1>
  //     <ul>
  //       {events && events.map((event: QueryDocumentSnapshot) => (
  //           <li key={event.id}>
  //               <p>&emsp;{event.data().title}</p>
  //               <p>&emsp;&emsp;{event.data().place}</p>
  //               <p>&emsp;&emsp;{event.data().food}</p>
  //               <p>&emsp;&emsp;{event.data().startTime}</p>
  //               <img src={event.data().photo} width={"60px"}/>
  //               &emsp;
  //           </li>
  //       ))}
  //       </ul> */}
  //       {events?.map((event) => (
  //         <div key={event.id}>
  //           <h2>{event.data().title}</h2>
  //           <p>{event.data().place}</p>
  //           <p>{event.data().food}</p>
  //           <p>{event.data().company}</p>
  //           <p>{event.data().ratings}</p>
  //           <img src={event.data().image} width={"300px"}/>
            
  //           {/* <p>Event Date: {event.data().startTime.toDate().toLocaleString()}</p> */}
  //         </div>
  //       ))}
  //   </div>
  // )
  
    return (
    <div className="flex min-h-screen w-full flex-col">
      {/* <Profile /> */}
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="history" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Upcoming</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button size="sm" className="h-8 gap-1" onClick={() => navigate(`/admin/events/${window.btoa("New Event")}/edit`)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Event
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Manage your events and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Location</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Food</TableHead>
                    <TableHead className="hidden md:table-cell">Company Sponsors</TableHead>
                    <TableHead className="hidden md:table-cell">RSVPs</TableHead>
                    <TableHead className="hidden md:table-cell">Attendees</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    

                  {events?.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="hidden sm:table-cell">
                        {event.data().image ? (
                          <img
                            alt="Event image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={event.data().image}
                            width="64"
                          />
                        ) : (
                          <img
                            alt="Event image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src='/placeholder.svg'
                            width="64"
                          />
                        )
                        }
                      </TableCell>
                      <TableCell className="font-medium">
                        {event.id}
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline">Upcoming</Badge>
                        </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {event.data().food || "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.data().company || "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.data().usersRegistered ? event.data().usersRegistered.length : "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.data().usersAttended ? event.data().usersAttended.length : "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.data().startTime?.seconds ? new Date(event.data().startTime.seconds * 1000).toLocaleDateString('en-US') : "TBD"}
                      <br></br>
                      {event.data().startTime?.seconds ? new Date(event.data().startTime.seconds * 1000).toLocaleTimeString('en-US', { hour12: true, second: undefined }) : ""}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.data().place || "TBD"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/admin/events/${window.btoa(event.id)}/edit`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}

                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-3</strong> of <strong>3</strong> events
                </div>
              </CardFooter>
            </Card>
            </TabsContent>
          </Tabs>
        </main>
    </div>
    )
}