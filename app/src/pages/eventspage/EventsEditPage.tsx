import {
    ChevronLeft,
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
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
import { FormEvent, useEffect, useState } from "react"
import { db } from "../../config/firebase-config"
import { Timestamp, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { DateTimePicker } from "../../components/ui/datetimepicker"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import data from "../../components/events/events.json"
import { Recommend } from "../../components/events/Recommend"

  export function EventsEditPage() {
    const { eventB64 } = useParams();
    const [eventId, setEventId] = useState<string>(window.atob(eventB64 || ""));

    
    const isNewEvent: boolean = (eventId == "New Event");
    
    const navigate = useNavigate();
    
    const [eventLocal, setEventLocal] = useState<any>();

    const [imageQuery, setImageQuery] = useState<string>();
    const [imagesSearched, setImagesSearched] = useState<any>();
    const [imageSelected, setImageSelected] = useState<string>();

    
    const getClosestFutureMonday = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysUntilMonday = (8 - dayOfWeek) % 7;
        const closestMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday);
        return closestMonday;
    };

    const resetEventLocal = () => {
        const closestMonday = getClosestFutureMonday();
        const startTime = Timestamp.fromDate(new Date(closestMonday.getTime() + 19 * 60 * 60 * 1000))
        const endTime = Timestamp.fromDate(new Date(closestMonday.getTime() + 21 * 60 * 60 * 1000))
        setEventLocal({
            startTime: startTime,
            endTime: endTime,
        })
        setEventLocal((prevEventLocal: any) => ({
            ...prevEventLocal,
            title: '',
            description: '',
            company: '',
            place: '',
            duration: '',
            time: '',
            setting: '',
            ratingProjection: '',
            food: '',
            image: '',
            status: ''
        }))
        // console.log(`This event is ${duration} minutes long (${duration / 60} hours)`)
    }
    


    const fetchEvent = async () => {
        try {
            const eventRef = doc(db, "Events", eventId);
            const eventSnap = await getDoc(eventRef);
            console.log(eventSnap.data())
            setEventLocal((prevEventLocal: any) => ({
                ...prevEventLocal,
                ...eventSnap.data(),
            }))
            eventLocal && console.log(await eventLocal)

        } catch (error: any) {
            console.error(error.message);
        }
    
    };
    
    const durationCalc = (startTime: Timestamp, endTime: Timestamp) => {
        const duration = Math.ceil((endTime.seconds - startTime.seconds) / 1800) * 30;
        console.log(duration);
        return duration;
    }

    const fetchImages = async (imageQuery: string) => {
        try {
            const response = await fetch(`http://localhost:3000/?query=${imageQuery}`);
            const data = await response.json();
            const images = data.images_results;
            return images;
        } catch (err) {
            console.error(err);
            return null;
        }

    };


    

    

    useEffect(() => {
        resetEventLocal();
        !isNewEvent && fetchEvent();
    }, []);

    useEffect(() => {
        if (eventLocal) {
            let localVals = window.localStorage.getItem("Event Rec Values")
            if (localVals && localVals != "{}") { // null and empty check
                let parsedVals = JSON.parse(localVals);
                let proj = 0
                if (eventLocal.food) {
                    proj += parsedVals.food[eventLocal.food];
                }
                if (eventLocal.company) {
                    proj += parsedVals.company[eventLocal.company];
                }
                if (eventLocal.setting) {
                    proj += parsedVals.setting[eventLocal.setting];
                }
                if (eventLocal.time) {
                    proj += parsedVals.time[eventLocal.time];
                }
                setEventLocal((prev: any) => ({
                    ...prev,
                    ratingProjection: proj
                }));
            }
        }
        console.log(eventLocal)
    }, [eventLocal?.company, eventLocal?.food, eventLocal?.time, eventLocal?.duration, eventLocal?.setting, eventLocal?.place])

    useEffect(() => {
        // live update status, time, duration
        if (eventLocal?.startTime && eventLocal?.endTime) {
            const startDate = eventLocal.startTime.toDate();
            const endDate = eventLocal.endTime.toDate();
            const currentDate = new Date();
            const hours = startDate.getHours();
            const place = eventLocal.place;
            
            var status = "Upcoming"
            if (startDate < currentDate && endDate < currentDate) {
                status = "Past"
            } else if (startDate < currentDate && endDate > currentDate) {
                status = "Active"
            }
            
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

            setEventLocal((prev:any) => ({
                ...prev,
                duration: durationCalc(eventLocal.startTime, eventLocal.endTime),
                time: time,
                status: status,
                setting: setting
            }))
        }
    }, [eventLocal?.startTime, eventLocal?.endTime, eventLocal?.place])



    async function handleSaveEvent() {
        try {
          if (eventLocal) {
            await updateDoc(doc(db, "Events", eventId), {
              ...eventLocal,
              duration: durationCalc(eventLocal.startTime, eventLocal.endTime)
            //   time: timeCalc(eventLocal.startTime)
            // setting: settingCalc
            });
          }
          toast.success("Event Saved Successfully!!", {
            position: "top-center",
          });
        } catch (error: any) {
          toast.error(error.message, {
            position: "bottom-center",
          });
        }
      };

    async function handleCreateEvent() {
        try {
          if (eventLocal.title != "") {
            await setDoc(doc(db, "Events", eventLocal.title), {
              ...eventLocal,
            });
            toast.success("Event Saved Successfully!!", {
                position: "top-center",
              });
            navigate("/admin/events")
          } else {
            toast.error("This event needs a title", {
                position: "bottom-center",
              });
            }
          
        } catch (error: any) {
          toast.error(error.message, {
            position: "bottom-center",
          });
        }
      };

    async function handleDeleteEvent() {
        if (!isNewEvent) {
            try {
                deleteDoc(doc(db, "Events", eventId));
                console.log("Event deleted successfully!");
                toast.success("Event deleted successfully!", {
                    position: "top-center",
                });
                
                
                navigate('/admin/events');
            } catch (error: any) {
                console.error("Error deleting event:", error.message);
                toast.error(error.message, {
                    position: "bottom-center",
                  });
            }
        } else {
            navigate('/admin/events');
        }
    }

    function handleImageSearch(e: FormEvent) {
        e.preventDefault();
        if (!imageQuery) {
            console.log('no query')
        } else {
            fetchImages(imageQuery).then(images => {
              setImagesSearched(images);
            });
        }
    }

    return (

    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {eventLocal ? (
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate('/admin/events')}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {eventLocal.title || "Untitled Event"}
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        {eventLocal.status}
                    </Badge>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        Projected Rating: {eventLocal.ratingProjection}
                    </Badge>
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
                        <Button size="sm" onClick={isNewEvent ? handleCreateEvent : handleSaveEvent}>Save Event</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>
                                Lipsum dolor sit amet, consectetur adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            className="w-full"
                                            defaultValue={eventLocal.title}
                                            placeholder="Enter a title"
                                            onChange={(e)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    title: e.target.value,
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            defaultValue={eventLocal.description}
                                            placeholder="Enter a description"
                                            className="min-h-32"
                                            onChange={(e)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
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
                                <CardDescription>
                                    Lipsum dolor sit amet, consectetur adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            defaultValue={eventLocal.place}
                                            placeholder="Enter a location"
                                            className="w-full"
                                            onChange={(e) => {
                                                setEventLocal((prevEventLocal: any) => ({
                                                ...prevEventLocal,
                                                place: e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="grid gap-3">
                                            <Label>Start Time</Label>
                                            <DateTimePicker
                                                granularity="minute"
                                                value={eventLocal.startTime ? new Date(eventLocal.startTime.seconds * 1000) : new Date()}
                                                onChange={(date) => {
                                                    const startTime = date && Timestamp.fromDate(date);
                                                    if (startTime && startTime.seconds && (startTime.seconds > eventLocal.endTime.seconds)) {
                                                        setEventLocal((prevEventLocal: any) => ({
                                                            ...prevEventLocal,
                                                            startTime: startTime,
                                                            endTime: startTime
                                                        }));
                                                    } else if (startTime) {
                                                        setEventLocal((prevEventLocal: any) => ({
                                                            ...prevEventLocal,
                                                            startTime: startTime,
                                                        }));
                                                    }
                                                }}
                                                hourCycle={12}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label>End Time</Label>
                                            <DateTimePicker
                                                granularity="minute"
                                                value={eventLocal.endTime ? new Date(eventLocal.endTime.seconds * 1000) : new Date()}
                                                onChange={(date) => {
                                                    const endTime = date && Timestamp.fromDate(date);
                                                    if (endTime && (endTime.seconds <= eventLocal.startTime.seconds)) {
                                                        setEventLocal((prevEventLocal: any) => ({
                                                            ...prevEventLocal,
                                                            startTime: endTime,
                                                            endTime: endTime
                                                        }));
                                                    } else if (endTime) {
                                                        setEventLocal((prevEventLocal: any) => ({
                                                            ...prevEventLocal,
                                                            endTime: endTime,
                                                            duration: durationCalc(eventLocal.startTime, endTime)
                                                        }));
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
                                            defaultValue={eventLocal.company}
                                            onValueChange={(value)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    company: value,
                                                }))
                                            }}
                                        >
                                            <SelectTrigger id="company" aria-label="Select company">
                                                <SelectValue placeholder={eventLocal.company || "Select company"} />
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
                                            defaultValue={eventLocal.food}
                                            onValueChange={(value)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    food: value,
                                                }))
                                            }}
                                        >
                                            <SelectTrigger id="food" aria-label="Select food">
                                                <SelectValue placeholder={eventLocal.food || "Select food"} />
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
                                <CardDescription>
                                        Lipsum dolor sit amet, consectetur adipiscing elit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <img
                                        alt="Event image"
                                        className="w-full rounded-md object-cover"
                                        height="auto"
                                        src={eventLocal.image || '/placeholder.svg'}
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
                                                    placeholder={eventLocal.company}
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
                                                        setEventLocal((prevEventLocal: any) => ({
                                                            ...prevEventLocal,
                                                            image: imageSelected,
                                                        }))
                                                    ):(
                                                        console.log("No new image selected")
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