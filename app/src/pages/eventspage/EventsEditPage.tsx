import {
    ChevronLeft,
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { useNavigate, useParams } from "react-router-dom"
import { FC, FormEvent, useEffect, useState } from "react"
import { db } from "../../firebase/firebase-config"
import { Timestamp, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { DateTimePicker } from "../../components/ui/datetimepicker"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import data from "../../components/events/events.json"
import { Recommend } from "../../components/events/Recommend"
import { EventType } from "../../lib/types"
import { handleSaveEvent } from "../../firebase/eventsfunctions"

type Props = {
    events: EventType[]
  }

export const EventsEditPage: FC<Props> = ({events}: Props) => {
    const { eventId } = useParams();
    // const eventId:string = eventParam || '';
    
    const [event, setEvent] = useState<EventType>({id: "loading"})

    useEffect(()=>{
        var event = events.find((event)=>event.id==eventId)
        if (event) {
            setEvent(event)
        }
    },[events])

    useEffect(()=> {
        console.log(event)
    }, [event])

    const navigate = useNavigate();

    const [imageQuery, setImageQuery] = useState<string>();
    const [imagesSearched, setImagesSearched] = useState<any>();
    const [imageSelected, setImageSelected] = useState<string>();
    

    const fetchImages = async (imageQuery: string) => {
        try {
            const response = await fetch(`http://localhost:3000/${imageQuery}`);
            const data = await response.json();
            const images = data.images_results;
            return images;
        } catch (err) {
            return null;
        }

    };


    useEffect(() => {
        if (event) {
            let localVals = window.localStorage.getItem("Event Rec Values")
            if (localVals && localVals != "{}") {
                let parsedVals = JSON.parse(localVals);
                let proj = 0
                if (event.food) {
                    proj += parsedVals.food[event.food];
                }
                if (event.company) {
                    proj += parsedVals.company[event.company];
                }
                if (event.setting) {
                    proj += parsedVals.setting[event.setting];
                }
                if (event.time) {
                    proj += parsedVals.time[event.time];
                }

                if (proj != 0) {
                    setEvent((prev: any) => ({
                        ...prev,
                        projection: {
                            rating: proj,
                            calculatedAt: parsedVals.calculatedAt
                        }
                    }));
                }
                
            }
        }
    }, [event?.company, event?.food, event?.time, event?.duration, event?.setting, event?.place])

    useEffect(() => {
        const startDate = event?.startTime?.toDate();
        const endDate = event?.endTime?.toDate();

        if (startDate && !endDate) {
            const adjStart = startDate.setHours(startDate.getHours() + 19)

            const adjEnd = startDate.setHours(startDate.getHours() + 2)

            setEvent((prev: any) => ({
                ...prev,
                startTime: Timestamp.fromMillis(adjStart),
                endTime: Timestamp.fromMillis(adjEnd),
            }))
        }

        if (startDate && endDate) {
            if (startDate > endDate) {
                var adjEnd = startDate;
                adjEnd.setHours(adjEnd.getHours() + 2);

                setEvent((prev: any) => ({
                    ...prev,
                    endTime: Timestamp.fromDate(adjEnd),
                }))
            }
            
        }
    }, [event?.startTime, event?.endTime])

    async function handleDeleteEvent() {
        try {
            if (event.id) {
                await deleteDoc(doc(db, "Events", event.id));
                toast.success("Event deleted successfully!", {
                    position: "top-center",
                });
            }
            
            
            
            navigate('/admin/events');
        } catch (error: any) {
            toast.error(error.message, {
                position: "bottom-center",
                });
        }
    }

    function handleImageSearch(e: FormEvent) {
        e.preventDefault();
        if (!imageQuery) {
        } else {
            fetchImages(imageQuery).then(images => {
              setImagesSearched(images);
            });
        }
    }

    return (

    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {event ? (
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate('/admin/events')}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {event.title || "Untitled Event"}
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        {event.status}
                    </Badge>
                    
                    {event.projection?.rating ? (
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        {`Projected Rating ${(new Date(event.projection?.calculatedAt?.seconds * 1000)).toLocaleDateString()}: ${event.projection?.rating}`}
                    </Badge>
                    ) : ('')}
                    
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
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
                                    <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Recommend/>
                        <Button size="sm" onClick={() => handleSaveEvent(event).then(() => navigate("/admin/events"))}>Save Event</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            className="w-full"
                                            defaultValue={event.title!="Untitled Event" ? event.title : ''}
                                            placeholder="Enter a title"
                                            onChange={(e)=>{
                                                setEvent((prevEvent: any) => ({
                                                    ...prevEvent,
                                                    title: e.target.value,
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            defaultValue={event.description}
                                            placeholder="Enter a description"
                                            className="min-h-32"
                                            onChange={(e)=>{
                                                setEvent((prevEvent: any) => ({
                                                    ...prevEvent,
                                                    description: e.target.value,
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-07-chunk-1">
                            <CardHeader>
                                <CardTitle>Location and Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            defaultValue={event.place}
                                            placeholder="Enter a location"
                                            className="w-full"
                                            onChange={(e) => {
                                                setEvent((prevEvent: any) => ({
                                                ...prevEvent,
                                                place: e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="grid gap-3">
                                            <Label>Start Time</Label>
                                            <DateTimePicker
                                                granularity="minute"
                                                value={event.startTime?.toDate()}
                                                onChange={(date) => {
                                                    if (date) {
                                                        const startTime = Timestamp.fromDate(date);
                                                        setEvent((prev: any) => ({
                                                            ...prev,
                                                            startTime: startTime
                                                        }))
                                                    }
                                                }}
                                                hourCycle={12}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label>End Time</Label>
                                            <DateTimePicker
                                                granularity="minute"
                                                value={event.endTime?.toDate()}
                                                onChange={(date) => {
                                                    if (date) {
                                                        const endTime = Timestamp.fromDate(date);
                                                        setEvent((prev: any) => ({
                                                            ...prev,
                                                            endTime: endTime
                                                        }))
                                                    }
                                                }}
                                                hourCycle={12}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-3">
                            <CardHeader>
                                <CardTitle>Corporate Sponsor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label>Company</Label>
                                        <Select
                                            defaultValue={event.company}
                                            onValueChange={(value)=>{
                                                setEvent((prevEvent: any) => ({
                                                    ...prevEvent,
                                                    company: value,
                                                }))
                                            }}
                                        >
                                            <SelectTrigger id="company" aria-label="Select company">
                                                <SelectValue placeholder={event.company || "Select company"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data.companyOptions.map((option: string) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-07-chunk-3">
                            <CardHeader>
                                <CardTitle>Food</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label>Food</Label>
                                        <Select
                                            defaultValue={event.food}
                                            onValueChange={(value)=>{
                                                setEvent((prevEvent: any) => ({
                                                    ...prevEvent,
                                                    food: value,
                                                }))
                                            }}
                                        >
                                            <SelectTrigger id="food" aria-label="Select food">
                                                <SelectValue placeholder={event.food || "Select food"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data.foodOptions.map((option: string) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                            <CardHeader>
                                <CardTitle>Event Images</CardTitle>

                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <img
                                        alt="Event image"
                                        className="w-full rounded-md object-cover"
                                        height="auto"
                                        src={event.image || '/placeholder.svg'}
                                        width="300"
                                    />
                                    <Dialog onOpenChange={()=>{
                                        setImageQuery(undefined)
                                        setImageSelected(undefined)
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Edit Image</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Image Options</DialogTitle>
                                                <DialogDescription>Use the search bar to find a relevant graphic</DialogDescription>
                                            </DialogHeader>
                                            
                                            
                                            <Label htmlFor="image-query">Image Query</Label>
                                           <form name="image-query" onSubmit={(e: FormEvent) => handleImageSearch(e)}>
                                            <Input
                                                    id="image-query"
                                                    type="text"
                                                    className="w-full"
                                                    placeholder={event.company}
                                                    onChange={(e)=>{
                                                        setImageQuery(e.target.value)
                                                    }}
                                                />
                                                <Button type="submit">Search</Button>
                                            </form>
                                            {imagesSearched!=undefined ? (
                                                <>
                                            <div className="grid auto-rows-max items-start gap-1 grid-cols-3 lg:gap-4">
                                                {imagesSearched.slice(0,6).map((imageSearched:any) => (
                                                <Card
                                                    key={imageSearched.title}
                                                    className="bg-white shadow-md overflow-hidden transition-all ease-in-out duration-300 hover:scale-105"
                                                    onClick={()=>{
                                                        setImageSelected(imageSearched.original)
                                                        }}>
                                                    
                                                    <img
                                                        alt="Product image"
                                                        className="object-cover "
                                                        height="100%"
                                                        src={imageSearched.original || '/placeholder.svg'}
                                                    />
                                                </Card>
                                                ))}
        
                                            </div>
                                            
                                            </>
                                            ):(
                                                <>
                                                {imageQuery ? (
                                                <Label>Loading...</Label>
                                                ) : (
                                                    <></>
                                                )}
                                                </>
                                            )}
                                            {imageSelected!=undefined && (
                                                <>
                                                    <Label>Image Selected</Label>
                                                    <Card className="overflow-hidden">
                                                        <img src={imageSelected}></img>
                                                    </Card>
                                                </>
                                            )}

                                        <DialogFooter>
                                            <DialogClose asChild>
                                            <Button
                                                type="submit"
                                                onClick={()=>{
                                                    {imageSelected ? (
                                                        setEvent((prevEvent: any) => ({
                                                            ...prevEvent,
                                                            image: imageSelected,
                                                        }))
                                                    ):(
                                                        <></>
                                                    )}
                                                }}
                                            >
                                                    Save
                                            </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>    
                                </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                    <Button variant="outline" size="sm">
                        Discard
                    </Button>
                    <Button size="sm">Save Product</Button>
                </div>
            </div>
            ) : (
            <></>
            )}
            
        </main>
    </div>
    )
  }