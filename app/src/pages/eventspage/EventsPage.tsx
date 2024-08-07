
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
import { EventsTable } from "./EventsTable";

type Props = {
  events: EventType[]
}

const statusOptions = ["Upcoming", "Active", "Past"];

export const EventsPage: FC<Props> = ({events}: Props) => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    createEvent()
    .then((event) => navigate(`/admin/events/${event.id}/edit`))
  }
  
    return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="All">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="Past" className="hidden sm:flex">
                  Past
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
                      Past
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
            <TabsContent value="All">
                <EventsTable events={events?.filter((event) => event.status != "Past")} />
            </TabsContent>
            {statusOptions.map((status) => (
              <TabsContent key={status} value={status}>
                <EventsTable events={events?.filter((event) => event.status === status)} />
              </TabsContent>
            ))}
          </Tabs>
        </main>
    </div>
    )
}