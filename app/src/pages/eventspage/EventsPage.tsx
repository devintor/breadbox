
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { EventType } from "../../lib/types";
import { createEvent, handleDeleteEvent } from "../../firebase/eventsfunctions";

type Props = {
  events: EventType[]
}

export const EventsPage: FC<Props> = ({events}: Props) => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    createEvent()
    .then((event) => navigate(`/admin/events/${event.id}/edit`))
  }
  
    return (
    <div className="flex min-h-screen w-full flex-col">
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
                <Button size="sm" className="h-8 gap-1" onClick={handleCreateEvent}>
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
                        {event.image ? (
                          <img
                            alt="Event image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={event.image}
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
                        {event.title}
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline">{event.status}</Badge>
                        </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {event.food || "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.company || "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.registrees ? event.registrees.length : "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.attendees ? event.attendees.length : "None"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.startTime?.seconds ? new Date(event.startTime.seconds * 1000).toLocaleDateString('en-US') : "TBD"}
                      <br></br>
                      {event.startTime?.seconds ? new Date(event.startTime.seconds * 1000).toLocaleTimeString('en-US', { hour12: true, second: undefined }) : ""}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                      {event.place || "TBD"}
                      </TableCell>
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
                              <AlertDialogAction onClick={() => {event.id && handleDeleteEvent(event.id)}}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
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
            </TabsContent>
          </Tabs>
        </main>
    </div>
    )
}