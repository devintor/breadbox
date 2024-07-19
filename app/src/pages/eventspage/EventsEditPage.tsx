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
import { QueryDocumentSnapshot, Timestamp, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { DateTimePicker, DateTimePickerRef, TimePicker } from "../../components/ui/datetimepicker"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { getUnixTime } from 'date-fns';

  export function EventsEditPage() {
    const { eventB64 } = useParams();
    const eventId = window.atob(eventB64 || "");
    console.log(eventId);
    
    const navigate = useNavigate();
    
    const [eventLocal, setEventLocal] = useState<any>();

    const [imageQuery, setImageQuery] = useState<string>();
    const [imagesSearched, setImagesSearched] = useState<any>();
    const [imageSelected, setImageSelected] = useState<string>();

    const imageOptions = new Map()
    imageOptions.set("company", ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/M%C3%BCnster%2C_LVM%2C_B%C3%BCrogeb%C3%A4ude_--_2013_--_5149-51.jpg/1200px-M%C3%BCnster%2C_LVM%2C_B%C3%BCrogeb%C3%A4ude_--_2013_--_5149-51.jpg"]);
    imageOptions.set("google", ["https://s39939.pcdn.co/wp-content/uploads/2023/02/iStock-1169427542.jpg",
                                "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PxG_GVE_Blog_Header-bike_1.width-1300.png",
                                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Googleplex_HQ_%28cropped%29.jpg/1200px-Googleplex_HQ_%28cropped%29.jpg",
                                "https://s39939.pcdn.co/wp-content/uploads/2023/02/iStock-1169427542.jpg",
                                "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PxG_GVE_Blog_Header-bike_1.width-1300.png",
                                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Googleplex_HQ_%28cropped%29.jpg/1200px-Googleplex_HQ_%28cropped%29.jpg"
                                ]);
    imageOptions.set("meta",    ["https://about.fb.com/wp-content/uploads/2021/10/Meta-Planets-img-16x9-1.jpg?w=1200"]);

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

    const fetchImages = async (imageQuery: string) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Agent': '',
                'X-Proxy-Location': '',
                'X-Api-Key': 'qRa9xQVJCNJG3AkZtzwRD3dA'
            }
        };
        try {
            const response = await fetch(`https://api.serply.io/v1/image/q=${imageQuery}&tbs=isz:l,itp:photo`, options);
            const data = await response.json();
            const images = data.image_results;
            console.log(images)
            return images;
        } catch (err) {
            console.error(err);
            return null;
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

    async function handleImageSearch(e: Event) {
        e.preventDefault();
        console.log(imageQuery)
        if (!imageQuery) {
            console.log('no query')
        } else {
            const images = await fetchImages(imageQuery);
            console.log(images)
            setImagesSearched(images);

        }

        // console.log(imageQuery)
        // if (!imageQuery) {
        //     console.log('no query')
        // } else {
        //     await fetchImages(imageQuery);
        // }
        // // return ["/placeholder.svg"]
    }

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
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate('/admin/events')}>
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
                                            onChange={(e) => {
                                                setEventLocal((prevEventLocal: any) => ({
                                                ...prevEventLocal,
                                                place: e.target.value,
                                                }));
                                                console.log(eventLocal);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="grid gap-3">
                                            <Label>Start Time</Label>
                                            <DateTimePicker
                                                granularity="minute"
                                                value={new Date(eventLocal.startTime.seconds * 1000)}
                                                onChange={(date) => {
                                                const startTime = date && Timestamp.fromDate(date);
                                                setEventLocal((prevEventLocal: any) => ({
                                                    ...prevEventLocal,
                                                    startTime: startTime,
                                                }));
                                                console.log(eventLocal);
                                                }}
                                                hourCycle={12}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label>End Time</Label>
                                            <DateTimePicker
                                                granularity="minute"
                                                value={new Date(eventLocal.endTime.seconds * 1000)}
                                                onChange={(date) => {
                                                const endTime = date && Timestamp.fromDate(date);
                                                if (endTime && (endTime.seconds <= eventLocal.startTime.seconds)) {
                                                    console.error("Event end time must be after start time")
                                                } else {
                                                    setEventLocal((prevEventLocal: any) => ({
                                                        ...prevEventLocal,
                                                        endTime: endTime,
                                                    }));
                                                }
                                                console.log(eventLocal);
                                                }}
                                                hourCycle={12}
                                            />
                                        </div>
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
                                        <Label>Company</Label>
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
                                        <Label>Food</Label>
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
                                        className="w-full rounded-md object-cover"
                                        height="auto"
                                        src={eventLocal.image}
                                        width="300"
                                    />
                                    {/* <div className="grid grid-cols-3 gap-2">
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
                                    </div> */}
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
                                           <form id="image-query" onSubmit={handleImageSearch}>
                                            <Input
                                                    id="image-query"
                                                    type="text"
                                                    className="w-full"
                                                    placeholder={eventLocal.company}
                                                    onChange={(e)=>{
                                                        setImageQuery(e.target.value)
                                                        console.log(imageQuery)
                                                    }}
                                                />
                                                <Button type="submit">Search</Button>
                                            </form>
                                           {/* <Input
                                                id="image-query"
                                                type="text"
                                                className="w-full"
                                                placeholder={eventLocal.company}
                                                onChange={(e)=>{
                                                    setImageQuery(e.target.value)
                                                    console.log(imageQuery)
                                                }}
                                            /> */}
                                            {imagesSearched!=undefined ? (
                                                <>
                                                {console.log(imagesSearched)}
                                            <div className="grid auto-rows-max items-start gap-1 grid-cols-3 lg:gap-4">
                                                {/* {imagesSearched?.map((imageSearched:any) => (
                                                <Card
                                                    className="bg-white shadow-md overflow-hidden transition-all ease-in-out duration-300 hover:scale-105"
                                                    onClick={()=>{
                                                        setImageSelected(imageSearched.image.src)
                                                        }}>
                                                    
                                                    <img
                                                        alt="Product image"
                                                        className="object-cover "
                                                        height="100%"
                                                        src={imageSearched.image.src || '/placeholder.svg'}
                                                    />
                                                </Card>
                                                ))} */}


                                                
                                                
                                                {/* <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">Upload</span> */}
        
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
                                            {imageSelected!=undefined ? (
                                                <>
                                                    <Label>Image Selected</Label>
                                                    <Card className="overflow-hidden">
                                                        <img src={imageSelected}></img>
                                                    </Card>
                                                </>
                                            ):(
                                                <>
                                                    <Label>Current Image</Label>
                                                    <Card className="overflow-hidden">
                                                        <img src={eventLocal.image}></img>
                                                    </Card>
                                                </>
                                            )}

                                        <DialogFooter>
                                            <DialogClose>
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
                                                    console.log(eventLocal)
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