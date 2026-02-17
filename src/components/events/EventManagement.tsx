import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon, Plus, Users, MapPin, Clock,IndianRupee ,
  Star, Coffee, Utensils, Camera, Music, Presentation, PartyPopper, X
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: "conference" | "wedding" | "banquet" | "meeting" | "party" | "corporate";
  status: "confirmed" | "pending" | "cancelled" | "completed";
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  attendees: number;
  maxCapacity: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  totalCost: number;
  paid: number;
  services: string[];
  notes: string;
}

interface Venue {
  id: string;
  name: string;
  capacity: number;
  type: string;
  hourlyRate: number;
  features: string[];
  status: "available" | "occupied" | "maintenance";
  image?: string;
}

interface EventDashboardSummary {
  total_events?: number;
  total_revenue?: number;
  confirmed_events?: number;
  total_attendees?: number;
}

export const EventManagement = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [eventTypeOpenForm, setEventTypeOpenForm] = useState(false);
  const [addVenueOpenForm, setAddVenueOpenForm] = useState(false);
  const [eventType, setEventType] = useState("");
  const [eventTypeList, setEventTypeList] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [eventOpenForm, setEventOpenForm] = useState(false);
  const [eventUpdateOpenForm, setEventUpdateOpenForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventDashboardSummary, setEventDashboardSummary] = useState<EventDashboardSummary>({});
  const [eventAnalytics, setEventAnalytics] = useState<any>();
  const [selectedVenueSchedule, setSelectedVenueSchedule] = useState(null);
const [isScheduleOpen, setIsScheduleOpen] = useState(false);


  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    event_type: "",
    venue: "",
    start_datetime: "",
    end_datetime: "",
    expected_guests: 0,
    deposit_amount: 0,
    total_price: 0,
    contact_name: "",
    contact_phone: "",
    tags: "",
    status: "",
    icon : ""
  });
  const [editEvent, setEditEvent] = useState({
    title: "",
    description: "",
    event_type: "",
    venue: "",
    start_datetime: "",
    end_datetime: "",
    expected_guests: 0,
    deposit_amount: 0,
    total_price: 0,
    contact_name: "",
    contact_phone: "",
    tags: "",
    status: "",
    slug: "",
    icon : ""
  });
  const [venueData, setVenueData] = useState({
    name: "",
    kind: "",
    capacity: "",
    hourly_rate: "",
    features: [],
    is_active: true,
  });
  const [venueList, setVenueList] = useState([]);

  const [eventList, setEventList] = useState([]);
  const statusArray = ["confirmed", "pending", "cancelled", "completed"];
  const accessToken = localStorage.getItem('accessToken');

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Annual Tech Conference 2024",
      type: "conference",
      status: "confirmed",
      date: "2024-02-15",
      startTime: "09:00",
      endTime: "17:00",
      venue: "Grand Ballroom",
      attendees: 200,
      maxCapacity: 300,
      contact: {
        name: "Sarah Johnson",
        email: "sarah@techcorp.com",
        phone: "+1-555-0123"
      },
      totalCost: 12500,
      paid: 5000,
      services: ["Audio/Visual", "Catering", "Photography"],
      notes: "Requires stage setup and live streaming"
    },
    {
      id: "2",
      title: "Wilson-Smith Wedding",
      type: "wedding",
      status: "confirmed",
      date: "2024-02-20",
      startTime: "16:00",
      endTime: "23:00",
      venue: "Garden Pavilion",
      attendees: 120,
      maxCapacity: 150,
      contact: {
        name: "Emily Wilson",
        email: "emily.wilson@email.com",
        phone: "+1-555-0124"
      },
      totalCost: 18000,
      paid: 9000,
      services: ["Catering", "Decoration", "Photography", "Music"],
      notes: "Outdoor ceremony weather backup needed"
    },
    {
      id: "3",
      title: "Corporate Board Meeting",
      type: "meeting",
      status: "pending",
      date: "2024-02-10",
      startTime: "14:00",
      endTime: "16:00",
      venue: "Executive Conference Room",
      attendees: 15,
      maxCapacity: 20,
      contact: {
        name: "Michael Chen",
        email: "m.chen@globalcorp.com",
        phone: "+1-555-0125"
      },
      totalCost: 800,
      paid: 0,
      services: ["Audio/Visual", "Refreshments"],
      notes: "High security clearance required"
    }
  ]);

 
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVenueStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "occupied": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "conference": return Presentation;
      case "wedding": return PartyPopper;
      case "banquet": return Utensils;
      case "meeting": return Users;
      case "party": return Music;
      case "corporate": return Coffee;
      default: return CalendarIcon;
    }
  };

  const totalRevenue = events.reduce((acc, event) => acc + event.paid, 0);
  const pendingRevenue = events.reduce((acc, event) => acc + (event.totalCost - event.paid), 0);
  const confirmedEvents = events.filter(e => e.status === "confirmed").length;
  const totalAttendees = events.reduce((acc, event) => acc + event.attendees, 0);
  const handleCreateEventType = async () => {
    if (!eventType) {
      alert("Please enter an event type.");
      return;
    }
    const obj = { name: eventType };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/event-types/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(obj)
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        alert("Event type created successfully!");
        setEventTypeOpenForm(false);
        setEventType("");
      }
      return;

    }
    catch (error) {
      console.error("Error creating event type:", error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/events/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(eventData)
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        alert("Event created successfully!");
        setEventOpenForm(false);
        setEventData({
          title: "",
          description: "",
          event_type: "",
          venue: "",
          start_datetime: "",
          end_datetime: "",
          expected_guests: 0,
          deposit_amount: 0,
          total_price: 0,
          contact_name: "",
          contact_phone: "",
          tags: "",
          status: "",
          icon : ""
        })
      }
      return;
    }
    catch (error) {
      console.error("Error creating event type:", error);
    }
  };

  const handleGetEventDashboardSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/events/summary/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data) {
      
        setEventDashboardSummary(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

   const handleGetEventAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/events/analytical_data/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data) {
        setEventAnalytics(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

     const handleGetEventSchedule = async (scheduleSlug) => {
      if(!scheduleSlug){
        alert("Please select a schedule.")
        console.log(scheduleSlug);
        return;
      }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/venues/${scheduleSlug}/schedule/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        setSelectedVenueSchedule(data);
        setIsScheduleOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

   useEffect(()=>{
    handleGetEventDashboardSummary();
    handleGetEventAnalytics();
   },[])


  const handleCreateVenue = async () => {
    if (!venueData.name || !venueData.kind || !venueData.capacity || !venueData.hourly_rate) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/venues/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(venueData)
      });
      const data = await response.json();
      if (data) {
        alert("Venue created successfully!");
        setAddVenueOpenForm(false);
        handleGetVenues();
        setVenueData({
          name: "",
          kind: "",
          capacity: "",
          hourly_rate: "",
          features: [],
          is_active: true,
        });
      }
      return;

    }
    catch (error) {
      console.error("Error creating venue:", error);
    }
  };

  const handleGetVenues = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/venues/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (data && Array.isArray(data)) {
        // Map over array and add "status" based on is_active
        const updatedData = data.map((venue) => ({
          ...venue,
          status: venue.is_active ? "available" : "occupied",
        }));

        setVenueList(updatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch venues
        const venuesRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/venues/`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const venuesData = await venuesRes.json();
        console.log(venuesData);
        const updatedVenues = venuesData.map((venue) => ({
          ...venue,
          status: venue.is_active ? "available" : "occupied",
        }));
        setVenueList(updatedVenues); // state update


        // Fetch event types
        const eventTypesRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/event-types/`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const eventTypesData = await eventTypesRes.json();
        setEventTypeList(eventTypesData); // state update

        // Fetch events
        const eventsRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/events/`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const eventsData = await eventsRes.json();

        const updatedEvents = eventsData.map((event) => {
          const matchedEventType = eventTypesData.find(type => type.slug === event.event_type);
          const matchedVenue = updatedVenues.find(venue => venue.slug === event.venue);
          const start = new Date(event.start_datetime);
          const end = new Date(event.end_datetime);

          // Check multi-day condition
          const isMultiDay = start.toDateString() !== end.toDateString();

          return {
            id: event.id,
            title: event.title,
            type: matchedEventType ? matchedEventType?.slug : event.eventTypeName,
            eventType: matchedEventType ? matchedEventType?.name : event.eventTypeName,
            status: event.status,
            description: event.description,
            // New fields for UI
            isMultiDay: isMultiDay,
            startDate: start.toLocaleDateString(),
            endDate: end.toLocaleDateString(),

            startTime: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            endTime: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),

            venue: matchedVenue?.slug || event.venue,
            eventVenue: matchedVenue?.name || event.venue,
            maxCapacity: matchedVenue?.capacity || event.venue_capacity,
            slug: event.slug,

            attendees: event.expected_guests,
            occupancyPercent: event.capacity_percent,

            paid: Number(event.deposit_amount),
            totalCost: Number(event.total_price),
            paymentPercent: event.payment_percent,

            contact: {
              name: event.contact_name,
              phone: event.contact_phone,
            },

            services: event.tags ? event.tags.split(",") : [],
          };
        });


        setEventList(updatedEvents); // final events state
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  function combineDateTime(dateStr, timeStr) {
    // Convert "12/2/2025" and "05:33 PM" → "2025-12-02T17:33"
    const [month, day, year] = dateStr.split("/").map(Number);
    let [hours, minutes] = timeStr.split(/[: ]/).map(Number);
    const isPM = timeStr.toUpperCase().includes("PM");

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    // pad month/day/hours/minutes
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const hh = String(hours).padStart(2, "0");
    const min = String(minutes).padStart(2, "0");

    return `${year}-${mm}-${dd}T${hh}:${min}`;
  }


  const handleEditEvent = (event) => {
    console.log("Editing event:", event);
    setEditEvent({
      title: event.title,
      description: event.description,
      event_type: event.type,
      venue: event.venue,
      start_datetime: combineDateTime(event.startDate, event.startTime),
      end_datetime: combineDateTime(event.endDate, event.endTime),
      expected_guests: event.attendees,
      deposit_amount: event.paid,
      total_price: event.totalCost,
      contact_name: event.contact.name,
      contact_phone: event.contact.phone,
      tags: Array.isArray(event.services) ? event.services.map(s => s.trim()).join(", ") : "",
      status: event.status,
      slug: event.slug,
      icon : event.icon
    });
    setEventUpdateOpenForm(true);
  }

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/events/${editEvent.slug}/`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editEvent)
      });
      const data = await response.json();
      if (data) {
        alert("Event updated successfully!");
        setEventUpdateOpenForm(false);
        // Optionally refresh event list
      }
      return;
    }
    catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      
<Dialog open={eventOpenForm} onOpenChange={setEventOpenForm}>
  <DialogContent
    className="
      w-full 
      max-w-lg 
      max-h-[90vh] 
      overflow-y-auto 
      rounded-lg 
      p-4 
      backdrop-blur-md
    "
  >
    <DialogHeader>
      <DialogTitle className="text-lg font-bold">Create Event</DialogTitle>
    </DialogHeader>

    <div className="space-y-4 mt-4">

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-2 gap-3">

        {/* Title */}
        <div>
          <label className="text-xs font-medium">Title *</label>
          <Input
            placeholder="Enter Event Title"
            className="text-sm"
            name="title"
            value={eventData?.title}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium">Description</label>
          <Input
            placeholder="Enter Description"
            className="text-sm"
            name="description"
            value={eventData?.description}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="text-xs font-medium">Event Type *</label>
          <select
            name="event_type"
            value={eventData?.event_type}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="" disabled>Select Event Type</option>
            {eventTypeList.map((type) => (
              <option key={type.id} value={type.slug}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Venue */}
        <div>
          <label className="text-xs font-medium">Venue *</label>
          <select
            name="venue"
            value={eventData?.venue}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="" disabled>Select Venue</option>
            {venueList.map((venue) => (
              <option key={venue.id} value={venue.slug}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Datetime */}
        <div>
          <label className="text-xs font-medium">Start Datetime *</label>
          <Input
            type="datetime-local"
            className="text-sm"
            name="start_datetime"
            value={eventData?.start_datetime}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* End Datetime */}
        <div>
          <label className="text-xs font-medium">End Datetime *</label>
          <Input
            type="datetime-local"
            className="text-sm"
            name="end_datetime"
            value={eventData?.end_datetime}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Expected Guests */}
        <div>
          <label className="text-xs font-medium">Expected Guests</label>
          <Input
            type="number"
            min="0"
            placeholder="Enter number"
            name="expected_guests"
            value={eventData?.expected_guests}
            className="text-sm"
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Deposit Amount */}
        <div>
          <label className="text-xs font-medium">Deposit Amount</label>
          <Input
            placeholder="Enter deposit amount"
            className="text-sm"
            name="deposit_amount"
            value={eventData?.deposit_amount}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Total Price */}
        <div>
          <label className="text-xs font-medium">Total Price</label>
          <Input
            placeholder="Enter total price"
            className="text-sm"
            name="total_price"
            value={eventData?.total_price}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Contact Name */}
        <div>
          <label className="text-xs font-medium">Contact Name</label>
          <Input
            placeholder="Enter contact name"
            maxLength={200}
            name="contact_name"
            value={eventData?.contact_name}
            className="text-sm"
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="text-xs font-medium">Contact Phone</label>
          <Input
            placeholder="Enter contact phone"
            maxLength={50}
            name="contact_phone"
            value={eventData?.contact_phone}
            className="text-sm"
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium">Tags</label>
          <Input
            placeholder="Enter tags (comma separated)"
            className="text-sm"
            name="tags"
            value={eventData?.tags}
            onChange={(e) =>
              setEventData({ ...eventData, [e.target.name]: e.target.value })
            }
          />
        </div>

<div className="col-span-1">
  <label className="text-xs font-medium">Status</label>
  <select
    className="w-full border rounded-md px-3 py-2 text-sm"
    name="status"
    value={eventData?.status ?? ""}
    onChange={(e) =>
      setEventData({ ...eventData, status: e.target.value })
    }
  >
    <option value="">Select Status</option>
    {statusArray.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>
</div>

{/* Icon */}
<div className="col-span-1">
  <label className="text-xs font-medium block">Icon</label>

  <select
    name="icon"
    value={eventData?.icon ?? ""}
    onChange={(e) =>
      setEventData({ ...eventData, icon: e.target.value })
    }
    className="w-full border rounded-md px-3 py-2 text-sm bg-white"
  >
    <option value="">Select icon</option>

    {Object.keys(LucideIcons).length > 0 ? (
      Object.keys(LucideIcons).map((icon) => (
        <option key={icon} value={icon}>
          {icon}
        </option>
      ))
    ) : (
      <option disabled>No icons loaded</option>
    )}
  </select>
</div>


      </div>

      {/* Submit Button */}
      <Button
        onClick={handleCreateEvent}
        className="
          w-full mt-4 
          bg-gradient-to-r 
          from-purple-500 
          to-purple-600 
          hover:from-purple-600 
          hover:to-purple-700 
          text-white text-sm py-2
        "
      >
        Create Event
      </Button>
    </div>
  </DialogContent>
</Dialog>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Events</p>
                <p className="text-3xl font-bold">{eventDashboardSummary?.total_events}</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Revenue</p>
                <p className="text-3xl font-bold">₹{eventDashboardSummary?.total_revenue}</p>
              </div>
              <IndianRupee  className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Confirmed</p>
                <p className="text-3xl font-bold">{eventDashboardSummary?.confirmed_events}</p>
              </div>
              <Star className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Attendees</p>
                <p className="text-3xl font-bold">{eventDashboardSummary?.total_attendees}</p>
              </div>
              <Users className="w-10 h-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">

            {/* Left Section */}
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Event Management</h2>
              <p className="text-sm sm:text-base text-gray-600">Organize and track all your events</p>
            </div>

            {/* Right Section (Buttons) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">

              {/* Event Type Button (Green) */}
              <Button
                className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2"
                onClick={() => setEventTypeOpenForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Event Type
              </Button>

              {/* New Event Button (Purple Gradient) */}
              <Button
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm px-3 py-2"
                onClick={() => setEventOpenForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Event
              </Button>

            </div>
          </div>


          <Dialog open={eventTypeOpenForm} onOpenChange={setEventTypeOpenForm}>
            <DialogContent
              className="
               w-full 
               max-w-sm 
               sm:max-w-md 
               max-h-[80vh] 
               overflow-y-auto 
               rounded-lg 
               p-4 sm:p-6 
               backdrop-blur-md
                "
            >
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold">New Event Type</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                {/* Name Field */}
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Enter Event Type Name" name="eventType" value={eventType} onChange={(e) => { setEventType(e.target.value) }} />
                </div>

                {/* Submit Button */}
                <Button onClick={handleCreateEventType} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                  Event Type Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>

       
          {/* Update Event Form Dialog */}

          <Dialog open={eventUpdateOpenForm} onOpenChange={setEventUpdateOpenForm} >
            <DialogContent
              className="
      w-full 
      max-w-lg 
      max-h-[90vh] 
      overflow-y-auto 
      rounded-lg 
      p-4 
      backdrop-blur-md
    "
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Update Event</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                {/* Grid: 2-column layout always */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Title */}
                  <div>
                    <label className="text-xs font-medium">Title *</label>
                    <Input placeholder="Enter Event Title" className="text-sm" name="title" value={editEvent?.title} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-medium">Description</label>
                    <Input placeholder="Enter Description" className="text-sm" name="description" value={editEvent?.description} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="text-xs font-medium">Event Type *</label>
                    <select
                      name="event_type"
                      value={editEvent?.event_type}
                      onChange={(e) => setEditEvent({ ...editEvent, [e.target.name]: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="" disabled>Select Event Type</option>
                      {eventTypeList.map((type) => (
                        <option key={type.id} value={type.slug}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Venue */}
                  <div>
                    <label className="text-xs font-medium">Venue *</label>
                    <select
                      name="venue"
                      value={editEvent?.venue}
                      onChange={(e) => setEditEvent({ ...editEvent, [e.target.name]: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="" disabled>Select Venue</option>
                      {venueList.map((venue) => (
                        <option key={venue.id} value={venue.slug}>{venue.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Start Datetime */}
                  <div>
                    <label className="text-xs font-medium">Start Datetime *</label>
                    <Input type="datetime-local" className="text-sm" name="start_datetime" value={editEvent?.start_datetime} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* End Datetime */}
                  <div>
                    <label className="text-xs font-medium">End Datetime *</label>
                    <Input type="datetime-local" className="text-sm" name="end_datetime" value={editEvent?.end_datetime} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Expected Guests */}
                  <div>
                    <label className="text-xs font-medium">Expected Guests</label>
                    <Input type="number" min="0" placeholder="Enter number" name="expected_guests" value={editEvent?.expected_guests} className="text-sm" onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Deposit Amount */}
                  <div>
                    <label className="text-xs font-medium">Deposit Amount</label>
                    <Input placeholder="Enter deposit amount" className="text-sm" name="deposit_amount" value={editEvent?.deposit_amount} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Total Price */}
                  <div>
                    <label className="text-xs font-medium">Total Price</label>
                    <Input placeholder="Enter total price" className="text-sm" name="total_price" value={editEvent?.total_price} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="text-xs font-medium">Contact Name</label>
                    <Input placeholder="Enter contact name" maxLength={200} name="contact_name" value={editEvent?.contact_name} className="text-sm" onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="text-xs font-medium">Contact Phone</label>
                    <Input placeholder="Enter contact phone" maxLength={50} name="contact_phone" value={editEvent?.contact_phone} className="text-sm" onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-xs font-medium">Tags</label>
                    <Input placeholder="Enter tags (comma separated)" className="text-sm" name="tags" value={editEvent?.tags || ""} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }} />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-xs font-medium">Status</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm" name="status" value={editEvent?.status} onChange={(e) => { setEditEvent({ ...editEvent, [e.target.name]: e.target.value }) }}>
                      <option value="" disabled>Select Status</option>
                      {statusArray.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Submit Button */}
                <Button onClick={handleUpdateEvent} className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm py-2">
                  Update Event
                </Button>

              </div>
            </DialogContent>
          </Dialog>

          {/* View Event Details Modal */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventList.map((event) => {
                 console.log('Event:', event);
                const TypeIcon = getEventTypeIcon(event.type);
                  const IconName = event.icon;
                
                              // LucideIcons object se component get karo
                              const TypeIcons = IconName
                                ? (LucideIcons as any)[IconName] as React.FC<React.SVGProps<SVGSVGElement>>
                                : null;
                const paymentProgress = (event.paid / event.totalCost) * 100;
                const occupancyProgress = (event.attendees / event.maxCapacity) * 100;

                return (
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                            <p className="text-sm text-gray-600 capitalize">{event.eventType}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />

                            {event.startDate === event.endDate ? (
                              <div className="flex items-center space-x-2">
                                <span>{event.startDate}</span>
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span>{event.startDate} - {event.startTime}</span>
                                <span>{event.endDate} - {event.endTime}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{event.eventVenue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{event.attendees} / {event.maxCapacity} guests</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Capacity</span>
                            <span>{occupancyProgress.toFixed(0)}%</span>
                          </div>
                          <Progress value={occupancyProgress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Payment</span>
                            <span>₹{event.paid.toLocaleString()} / ₹{event.totalCost.toLocaleString()}</span>
                          </div>
                          <Progress value={paymentProgress} className="h-2" />
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-600 mb-2">Contact: {event.contact.name}</p>
                          <div className="flex flex-wrap gap-1">
                            {event.services.slice(0, 2).map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {event.services.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{event.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => { handleEditEvent(event) }}>Edit</Button>
                          <Button size="sm" className="flex-1" onClick={() => handleViewDetails(event)}>View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Modal Overlay */}
            {showModal && selectedEvent && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={handleCloseModal}
              >
                <div
                  className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" // Added relative for positioning
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Icon - Top Right */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
                    onClick={handleCloseModal}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <Card className="border-0">
                    <CardContent className="p-6 pt-12 pb-16"> {/* Adjusted padding for top and bottom */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                          <p className="text-lg text-gray-600 capitalize">{selectedEvent.eventType}</p>
                        </div>
                        <Badge className={getStatusColor(selectedEvent.status)}>
                          {selectedEvent.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">Dates & Times</h3>
                          <div className="space-y-1 text-sm text-gray-700">
                            {selectedEvent.startDate === selectedEvent.endDate ? (
                              <p>{selectedEvent.startDate} | {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                            ) : (
                              <div>
                                <p>{selectedEvent.startDate} | {selectedEvent.startTime}</p>
                                <p className="text-gray-500">to</p>
                                <p>{selectedEvent.endDate} | {selectedEvent.endTime}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Venue</h3>
                          <p className="text-sm text-gray-700">{selectedEvent.eventVenue}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">Occupancy</h3>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700">{selectedEvent.attendees} / {selectedEvent.maxCapacity} guests</p>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Capacity</span>
                              <span>{((selectedEvent.attendees / selectedEvent.maxCapacity) * 100).toFixed(0)}%</span>
                            </div>
                            <Progress
                              value={(selectedEvent.attendees / selectedEvent.maxCapacity) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Payment Progress</h3>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700">₹{selectedEvent.paid.toLocaleString()} / ₹{selectedEvent.totalCost.toLocaleString()}</p>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Paid</span>
                              <span>{((selectedEvent.paid / selectedEvent.totalCost) * 100).toFixed(0)}%</span>
                            </div>
                            <Progress
                              value={(selectedEvent.paid / selectedEvent.totalCost) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">Contact</h3>
                          <p className="text-sm text-gray-700">{selectedEvent.contact.name}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Services</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.services.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Close Details Button - Bottom Right */}
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="absolute bottom-4 right-4 bg-orange-600 text-white"
                  >
                    Close Details
                  </Button>
                </div>
              </div>
            )}
          </div>

        </TabsContent>

        <TabsContent value="venues" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
              <p className="text-gray-600">Manage event spaces and facilities</p>
            </div>
            <Button onClick={() => { setAddVenueOpenForm(true) }} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Venue
            </Button>
          </div>

          <Dialog open={addVenueOpenForm} onOpenChange={setAddVenueOpenForm}>
            <DialogContent
              className="
      w-full 
      max-w-sm 
      sm:max-w-md 
      max-h-[80vh] 
      overflow-y-auto 
      rounded-lg 
      p-4 sm:p-6 
      backdrop-blur-md
    "
            >
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold">New Venue</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                {/* Name Field */}
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="Enter venue name"
                    name="name"
                    value={venueData.name}
                    onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                  />
                </div>

                {/* Kind */}
                <div>
                  <label className="text-sm font-medium">Kind</label>
                  <Input
                    placeholder="Enter venue kind"
                    name="kind"
                    value={venueData.kind}
                    onChange={(e) => setVenueData({ ...venueData, kind: e.target.value })}
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="text-sm font-medium">Capacity</label>
                  <Input
                    type="number"
                    placeholder="Enter capacity"
                    name="capacity"
                    value={venueData.capacity}
                    onChange={(e) => setVenueData({ ...venueData, capacity: e.target.value })}
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <Input
                    type="number"
                    placeholder="Enter hourly rate"
                    name="hourly_rate"
                    value={venueData.hourly_rate}
                    onChange={(e) => setVenueData({ ...venueData, hourly_rate: e.target.value })}
                  />
                </div>

                {/* Features (Textarea aligned like others) */}
                <div>
                  <label className="text-sm font-medium">Features</label>
                  <Textarea
                    className="w-full"
                    placeholder="Enter features (comma separated or JSON)"
                    name="features"
                    value={venueData.features}
                    onChange={(e) => setVenueData({ ...venueData, features: e.target.value.split(",").map(item => item.trim()) })}
                  />
                </div>

                {/* Active Status (Toggle Switch) */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Is Active</label>

                  <Switch
                    checked={venueData.is_active}
                    onCheckedChange={(val) =>
                      setVenueData({ ...venueData, is_active: val })
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleCreateVenue}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                >
                  Add Venue
                </Button>
              </div>

            </DialogContent>
          </Dialog>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venueList.map((venue) => (
              <Card key={venue.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{venue.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h3>
                      <p className="text-sm text-gray-600">{venue.kind.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</p>
                    </div>
                    <Badge className={getVenueStatusColor(venue.status)}>
                      {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Capacity</p>
                        <p className="font-semibold">{venue.capacity} guests</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Hourly rate</p>
                        <p className="font-semibold">₹{venue.hourly_rate}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {venue.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => {handleGetEventSchedule(venue?.slug)}}>
                        View Schedule
                      </Button>
                      <Button size="sm" className="flex-1"onClick={() => {setEventOpenForm(true)}}>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {isScheduleOpen && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white shadow-lg rounded-lg p-6 w-[400px] animate-fadeIn">

      <h2 className="text-xl font-semibold mb-4">Venue Schedule</h2>

      {selectedVenueSchedule && selectedVenueSchedule.length > 0 ? (
        <div className="space-y-4">
          {selectedVenueSchedule.map((event) => (
            <Card key={event.id} className="p-4 bg-gray-50">
              <h3 className="font-semibold">{event.title}</h3>

              <p className="text-sm text-gray-600">
                Customer: <span className="font-medium">{event.customer}</span>
              </p>

              <p className="text-sm text-gray-600">
                Status: <span className="font-medium">{event.status}</span>
              </p>

              <p className="text-sm text-gray-600">
                Start: <span className="font-medium">{new Date(event.start).toLocaleString()}</span>
              </p>

              <p className="text-sm text-gray-600">
                End: <span className="font-medium">{new Date(event.end).toLocaleString()}</span>
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No scheduled events found.</p>
      )}

      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={() => setIsScheduleOpen(false)}
      >
        Close
      </button>

    </div>

  </div>
)}

        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Event Calendar
              </CardTitle>
              <CardDescription>View and manage event schedules</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT SIDE CALENDAR */}
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                {/* RIGHT SIDE EVENT LIST */}
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Today's"} Events
                  </h3>

                  {/* FILTER + SHOW EVENTS */}
                  {eventList
                    .filter(event => {
                      const selected = selectedDate
                        ? new Date(selectedDate.toDateString())
                        : new Date(new Date().toDateString());

                      const start = new Date(event.startDate);
                      const end = new Date(event.endDate);

                      return selected >= start && selected <= end;
                    })
                    .map(event => {
                      const TypeIcon = getEventTypeIcon(event.eventType);

                      return (
                        <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">

                            {/* LEFT SIDE INFO */}
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <TypeIcon className="w-4 h-4 text-purple-600" />
                              </div>

                              <div>
                                <p className="font-medium text-sm">{event.title}</p>

                                <p className="text-xs text-gray-600">
                                  {event.startTime} - {event.endTime} • {event.eventVenue}
                                </p>

                                <p className="text-xs text-gray-600">
                                  {event.attendees} guests
                                </p>
                              </div>
                            </div>

                            {/* STATUS BADGE */}
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}

                  {/* NO EVENTS MESSAGE */}
                  {eventList.filter(event => {
                    const selected = selectedDate
                      ? new Date(selectedDate.toDateString())
                      : new Date(new Date().toDateString());

                    const start = new Date(event.startDate);
                    const end = new Date(event.endDate);

                    return selected >= start && selected <= end;
                  }).length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No events scheduled for this date
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>Track performance and revenue insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-semibold">${totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Revenue</span>
                        <span className="font-semibold text-yellow-600">${pendingRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-semibold">Expected Total</span>
                        <span className="font-bold">${(totalRevenue + pendingRevenue).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Event Types</h3>
                    <div className="space-y-2">
                      {["conference", "wedding", "meeting", "banquet", "party", "corporate"].map((type) => {
                        const typeEvents = events.filter(event => event.type === type);
                        const percentage = events.length > 0 ? (typeEvents.length / events.length) * 100 : 0;

                        return (
                          <div key={type} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{type}</span>
                              <span>{typeEvents.length} events ({percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Venue Utilization</h3>
                    <div className="space-y-2">
                      {venues.map((venue) => {
                        const venueEvents = events.filter(event => event.venue === venue.name);
                        const utilization = venues.length > 0 ? (venueEvents.length / events.length) * 100 : 0;

                        return (
                          <div key={venue.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{venue.name}</span>
                              <span>{venueEvents.length} events ({utilization.toFixed(1)}%)</span>
                            </div>
                            <Progress value={utilization} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Status Overview</h3>
                    <div className="space-y-2">
                      {["confirmed", "pending", "cancelled", "completed"].map((status) => {
                        const statusEvents = events.filter(event => event.status === status);
                        const percentage = events.length > 0 ? (statusEvents.length / events.length) * 100 : 0;

                        return (
                          <div key={status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{status}</span>
                              <span>{statusEvents.length} events ({percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}



       <TabsContent value="reports" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Event Analytics</CardTitle>
      <CardDescription>Track performance and revenue insights</CardDescription>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Revenue Breakdown */}
          <div>
            <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold">
                  ₹ {eventAnalytics?.total_revenue?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Revenue</span>
                <span className="font-semibold text-yellow-600">
                  ₹ {eventAnalytics?.pending_revenue?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-semibold">Expected Total</span>
                <span className="font-bold">
                  ₹ {eventAnalytics?.expected_total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Event Types */}
          <div>
            <h3 className="font-semibold mb-4">Event Types</h3>
            <div className="space-y-2">

              {eventAnalytics?.event_types && eventAnalytics?.event_types.map((item) => {
                const totalTypes = eventAnalytics?.event_types.reduce(
                  (acc: number, x: any) => acc + x.count,
                  0
                );

                const percentage = totalTypes > 0 
                  ? (item.count / totalTypes) * 100 
                  : 0;

                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.type}</span>
                      <span>
                        {item.count} events ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Venue Utilization */}
          <div>
            <h3 className="font-semibold mb-4">Venue Utilization</h3>
            <div className="space-y-2">

              {eventAnalytics?.venue_utilization && eventAnalytics.venue_utilization.map((item) => {
                const totalVenueEvents = eventAnalytics.venue_utilization.reduce(
                  (acc: number, x: any) => acc + x.count,
                  0
                );

                const utilization = totalVenueEvents > 0 
                  ? (item.count / totalVenueEvents) * 100 
                  : 0;

                return (
                  <div key={item.venue} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.venue}</span>
                      <span>
                        {item.count} events ({utilization.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={utilization} className="h-2" />
                  </div>
                );
              })}

            </div>
          </div>

          {/* Status Overview */}
          <div>
            <h3 className="font-semibold mb-4">Status Overview</h3>
            <div className="space-y-2">

              {eventAnalytics?.status_overview && Object.entries(eventAnalytics.status_overview).map(
                ([status, count]: [string, number]) => {

                  const totalStatus = Object.values(eventAnalytics.status_overview as Record<string, number>)
                    .reduce((acc: number, x: number) => acc + x, 0);

                  const percentage = totalStatus > 0 
                    ? (count / totalStatus) * 100 
                    : 0;

                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{status}</span>
                        <span>
                          {count} events ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                }
              )}
            

            </div>
          </div>

        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


      </Tabs>
    </div>
  );
};