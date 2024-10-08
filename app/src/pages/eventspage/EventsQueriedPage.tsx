
import {
    MoreHorizontal,
    ChevronLeft,
  } from "lucide-react"


  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"

  import { Button } from "../../components/ui/button"
  import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { FormEvent, useEffect, useState } from "react";
import { QueryDocumentSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { getQuery, getQueryResult } from "../../components/events/ProcessQuery";
import { useIsAuth } from "../../components/context/UserContext";
import { SearchBar } from "../../components/ui/searchbar";



export function EventsQueriedPage() {
    const isAuth = useIsAuth();
    
    const { searchParam } = useParams();
    const [userInput, setUserInput] = useState<string | undefined>(searchParam)

    const navigate = useNavigate();
  
    const [events, setEvents] = useState<QueryDocumentSnapshot[]>();

    const fetchEvents = async () => {
        if (userInput) {
            try {
                setEvents((await getQueryResult(userInput))?.docs);
            } catch (error: any) {
                toast.error(error.message, {
                    position: "bottom-center",
                });
            }
        }
      
    };

  async function handleDeleteEvent(eventId: string) {

    try {
        deleteDoc(doc(db, "Events", eventId));
        toast.success("Event deleted successfully!", {
            position: "top-center",
        });

        fetchEvents();
    } catch (error: any) {
        toast.error(error.message, {
            position: "bottom-center",
          });
    }
}
  
    useEffect(() => {
        fetchEvents();
    }, [userInput]);

  
    return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate('/events')}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <form name="event-query" className="flex-1 sm:flex-initial" onSubmit={(e: FormEvent) => {
                        e.preventDefault()
                        navigate(`/events/search/${userInput}`)
                    }}>
                        <div className="relative flex items-center text-muted-foreground focus-within:text-black">
                            <SearchBar
                                id="event-query"
                                type="search"
                                className="pr-3 pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                defaultValue={userInput || ''}
                                placeholder="Search for events..."
                                onChange={(e)=>{
                                    setUserInput(e.target.value)
                                }}
                            />
                        </div>
                    </form>
                </div>
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <h3 className="flex-1 shrink-0 text-xl tracking-tight sm:grow-0">
                            Showing results for <span className="font-semibold"><a href="">{getQuery(userInput)}</a></span>
                        </h3>
                        <CardDescription>
                            From user input of "{userInput}"
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
                                    
                                    {isAuth && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                    
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
                                        {event.data().title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{event.data().status}</Badge>
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
                                    {isAuth && (
                                        <TableCell>
                                            <AlertDialog>
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
                                                <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.id}/edit`)}>Edit</DropdownMenuItem>
                                                <AlertDialogTrigger asChild><DropdownMenuItem>Delete</DropdownMenuItem></AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this event
                                                        and remove its data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    )}
                                
                                </TableRow>
                            ))}

                    </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                    Showing <strong>1-{events?.length}</strong> of <strong>{events?.length}</strong> events
                    </div>
                </CardFooter>
                </Card>
            </div>
        </main>
    </div>
    )
}