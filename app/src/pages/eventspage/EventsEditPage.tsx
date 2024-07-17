import {
    ChevronLeft,
    Upload,
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
import { useEffect, useRef, useState } from "react"
import { db } from "../../config/firebase-config"
import { QueryDocumentSnapshot, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { DateTimePicker, DateTimePickerRef } from "../../components/ui/datetimepicker"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"

  export function EventsEditPage() {
    const { eventB64 } = useParams();
    const eventId = window.atob(eventB64 || "");
    console.log(eventId);
    
    const navigate = useNavigate();
    
    const [eventLocal, setEventLocal] = useState<any>();

    const [date, setDate] = useState<Date | undefined>(undefined);
    const ref = useRef<DateTimePickerRef>(null);
    const handleDateChange = (date: Date | undefined) => {
        setDate(date);
        console.log(ref); // logs the DateTimePicker component instance
      };

    // console.log(date);
    console.log(eventLocal);
    
    const fetchEvent = async () => {
      
      try {
          const eventRef = doc(db, "Events", eventId);
          const eventSnap = await getDoc(eventRef);
          setEventLocal(eventSnap.data());

          console.log(eventLocal);
      } catch (error: any) {
          console.error(error.message);
      }
      

    };


    

    useEffect(() => {
        fetchEvent();
    }, []);

    async function handleEditEvent() {
        try {
          if (eventLocal) {
            await updateDoc(doc(db, "Events", eventId), {
              ...eventLocal,
            });
          }
          console.log("User Saved Successfully!!");
          toast.success("User Saved Successfully!!", {
            position: "top-center",
          });
        } catch (error: any) {
          console.log(error.message);
          toast.error(error.message, {
            position: "bottom-center",
          });
        }
      };

    return (

    //     <form onSubmit={handleEditEvent}>
    //   <h3>Sign Up</h3>

    //   <div className="mb-3">
    //     <label>First name</label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       placeholder="First name"
    //       onChange={(e) => setFname(e.target.value)}
    //       required
    //     />
    //   </div>

    //   <div className="mb-3">
    //     <label>Last name</label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       placeholder="Last name"
    //       onChange={(e) => setLname(e.target.value)}
    //     />
    //   </div>

    //   <div className="mb-3">
    //     <label>Email Address</label>
    //     <input
    //       type="email"
    //       className="form-control"
    //       placeholder="Email Address"
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //     />
    //   </div>

    //   <div className="mb-3">
    //     <label>Password</label>
    //     <input
    //       type="password"
    //       className="form-control"
    //       id="password"
    //       placeholder="Enter password"
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />
    //   </div>

    //   <div className="d-grid">
    //     <button type="submit" className="btn btn-primary">
    //       Create
    //     </button>
    //   </div>
    // </form>


    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {eventLocal ? (
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {eventLocal.title}
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        Upcoming
                    </Badge>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Button variant="outline" size="sm">
                            Discard
                        </Button>
                        <Button size="sm">Save Event</Button>
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
                                            onChange={(e)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    title: e.target.value,
                                                }))
                                                console.log(eventLocal)
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            defaultValue={eventLocal.description}
                                            className="min-h-32"
                                            onChange={(e)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    description: e.target.value,
                                                }))
                                                console.log(eventLocal)
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
                                        className="w-full"
                                        onChange={(e)=>{
                                            setEventLocal((prevEventLocal: any) => ({
                                                ...prevEventLocal,
                                                place: e.target.value,
                                            }))
                                            console.log(eventLocal)
                                        }}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label>Time</Label>
                                    {/* <DateTimePicker
                                        ref={ref}
                                        value={date}
                                        onChange={handleDateChange}
                                        hourCycle={12}
                                    /> */}
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-07-chunk-5">
                            <CardHeader>
                                <CardTitle>Delete Event</CardTitle>
                                <CardDescription>
                                    Mistakenly created or cancelled
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Button variant="secondary">Delete Event</Button>
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
                                            <Button variant="destructive" asChild><AlertDialogAction>Delete</AlertDialogAction></Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                        <Label htmlFor="company">Company</Label>
                                        <Select
                                            defaultValue={eventLocal.company}
                                            onValueChange={(value)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    company: value,
                                                }))
                                                console.log(eventLocal)
                                            }}
                                        >
                                            <SelectTrigger id="company" aria-label="Select company">
                                                <SelectValue placeholder={eventLocal.company} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Google">Google</SelectItem>
                                                <SelectItem value="Meta">Meta</SelectItem>
                                                <SelectItem value="Apple">Apple</SelectItem>
                                                <SelectItem value="SpaceX">SpaceX</SelectItem>
                                                <SelectItem value="Boeing">Boeing</SelectItem>
                                                <SelectItem value="McKinsey">McKinsey</SelectItem>
                                                <SelectItem value="Deloitte">Deloitte</SelectItem>
                                                <SelectItem value="Accenture">Accenture</SelectItem>
                                                <SelectItem value="BCG">BCG</SelectItem>
                                                <SelectItem value="Blue Origin">Blue Origin</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
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
                                        <Label htmlFor="food">Food</Label>
                                        <Select
                                            defaultValue={eventLocal.food}
                                            onValueChange={(value)=>{
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    food: value,
                                                }))
                                                console.log(eventLocal)
                                            }}
                                        >
                                            <SelectTrigger id="food" aria-label="Select food">
                                                <SelectValue placeholder="Select food" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Chick Fil-A">Chick Fil-A</SelectItem>
                                                <SelectItem value="Chipotle">Chipotle</SelectItem>
                                                <SelectItem value="Panera">Panera</SelectItem>
                                                <SelectItem value="Jersey Mike's">Jersey Mike's</SelectItem>
                                                <SelectItem value="Panda Express">Panda Express</SelectItem>
                                                <SelectItem value="Raising Canes">Raising Canes</SelectItem>
                                                <SelectItem value="Snacks">Snacks</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="None">None</SelectItem>
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
                                        alt="Product image"
                                        className="aspect-square w-full rounded-md object-cover"
                                        height="300"
                                        src="/placeholder.svg"
                                        width="300"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <button>
                                            <img
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />
                                        </button>
                                        <button>
                                            <img
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />
                                        </button>
                                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">Upload</span>
                                        </button>
                                    </div>
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