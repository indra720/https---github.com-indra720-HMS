import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Headphones, Phone, Car, MapPin, Coffee, Utensils, ShoppingBag,
  Plane, Calendar, Clock, Star, Plus, MessageCircle, CheckCircle,
  AlertCircle, User, Gift, Camera, Map, Wifi, Dumbbell
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { set } from "date-fns";
import * as LucideIcons from "lucide-react";


interface Request {
  id: string;
  guestName: string;
  roomNumber: string;
  type: "concierge" | "transport" | "dining" | "shopping" | "tour" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  title: string;
  description: string;
  requestTime: string;
  assignedTo?: string;
  estimatedCompletion?: string;
  cost?: number;
  rating?: number;
}

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  available: boolean;
  rating: number;
  bookings: number;
}

interface Guest {
  id: string;
  name: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  vipStatus: boolean;
  preferences: string[];
  totalSpent: number;
  satisfaction: number;
  image?: string;
}

export const GuestServices = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const [requests] = useState<Request[]>([
    {
      id: "1",
      guestName: "John Smith",
      roomNumber: "305",
      type: "concierge",
      priority: "high",
      status: "pending",
      title: "Restaurant Reservation",
      description: "Need dinner reservation for 2 at a fine dining restaurant for tonight at 7 PM",
      requestTime: "2024-01-29T14:30:00Z",
      cost: 0
    },
    {
      id: "2",
      guestName: "Maria Garcia",
      roomNumber: "512",
      type: "transport",
      priority: "medium",
      status: "in-progress",
      title: "Airport Transfer",
      description: "Airport pickup service needed for tomorrow 3 PM flight",
      requestTime: "2024-01-29T10:15:00Z",
      assignedTo: "David Wilson",
      estimatedCompletion: "2024-01-30T15:00:00Z",
      cost: 45
    },
    {
      id: "3",
      guestName: "Robert Johnson",
      roomNumber: "203",
      type: "dining",
      priority: "low",
      status: "completed",
      title: "Room Service Order",
      description: "Late night dinner - steak and wine",
      requestTime: "2024-01-28T21:00:00Z",
      assignedTo: "Kitchen Staff",
      cost: 85,
      rating: 5
    }
  ]);

  const [services] = useState<Service[]>([
    {
      id: "1",
      name: "Airport Transfer",
      category: "Transportation",
      description: "Private car service to/from airport",
      price: 45,
      duration: "45 min",
      available: true,
      rating: 4.8,
      bookings: 156
    },
    {
      id: "2",
      name: "City Tour",
      category: "Tours",
      description: "Guided tour of city landmarks and attractions",
      price: 75,
      duration: "4 hours",
      available: true,
      rating: 4.6,
      bookings: 89
    },
    {
      id: "3",
      name: "Spa Package",
      category: "Wellness",
      description: "Full body massage and relaxation treatment",
      price: 120,
      duration: "90 min",
      available: true,
      rating: 4.9,
      bookings: 234
    },
    {
      id: "4",
      name: "Personal Shopping",
      category: "Shopping",
      description: "Personal shopping assistant for local stores",
      price: 60,
      duration: "3 hours",
      available: false,
      rating: 4.5,
      bookings: 67
    }
  ]);

  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "1",
      name: "John Smith",
      roomNumber: "305",
      checkIn: "2024-01-27",
      checkOut: "2024-01-31",
      vipStatus: true,
      preferences: ["Fine Dining", "Business Services", "Quiet Rooms"],
      totalSpent: 1250,
      satisfaction: 4.8
    },
    {
      id: "2",
      name: "Maria Garcia",
      roomNumber: "512",
      checkIn: "2024-01-28",
      checkOut: "2024-02-02",
      vipStatus: false,
      preferences: ["Tours", "Photography", "Local Culture"],
      totalSpent: 680,
      satisfaction: 4.5
    },
    {
      id: "3",
      name: "Robert Johnson",
      roomNumber: "203",
      checkIn: "2024-01-26",
      checkOut: "2024-01-30",
      vipStatus: true,
      preferences: ["Room Service", "Spa", "Golf"],
      totalSpent: 2100,
      satisfaction: 4.9
    }
  ]);


  const [dashboardSummary, setDashboardSummary] = useState<any>([])
  const [serviceCategoryOpenForm, setServiceCategoryOpenForm] = useState(false);
  const [serviceOpenForm, setServiceOpenForm] = useState(false);
  const [serviceEditForm, setServiceEditForm] = useState(false);
  const [serviceRequestOpenForm, setServiceRequestOpenForm] = useState(false);
  const [serviceCategoryData, setServiceCategoryData] = useState({
    name: "",
    preference_tags: "",
  });
  const [serviceCategoryList, setServiceCategoryList] = useState<any>([])
  const [serviceDataList, setServiceDataList] = useState<any>([])
  const [serviceRequestDataList, setServiceRequestDataList] = useState<any>([])
  const [bookings, setBookings] = useState([]);
  const [analyticsList, setAnalyticsList] = useState<any>({})
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceData, setServiceData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
    status: "available",
    rating: "",
    slug: ""
  });

  const [serviceEditData, setServiceEditData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
    status: "available",
    rating: "",
    slug: ""
  });

  const [serviceRequestData, setServiceRequestData] = useState({
    booking: "",
    assigned_to: "",
    category: "",
    service_type: "",
    schedule_datetime: "",
    description: "",
    priority: "low",
    cost: "",
    rating: "",
    created_by: "",
    icon: ""
  });

  const accessToken = localStorage.getItem('accessToken');


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "concierge": return Headphones;
      case "transport": return Car;
      case "dining": return Utensils;
      case "shopping": return ShoppingBag;
      case "tour": return Map;
      default: return MessageCircle;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "transportation": return Car;
      case "tours": return Map;
      case "wellness": return Dumbbell;
      case "shopping": return ShoppingBag;
      case "dining": return Utensils;
      default: return Star;
    }
  };

  const completedRequests = requests.filter(r => r.status === "completed").length;
  const totalRevenue = requests.reduce((acc, req) => acc + (req.cost || 0), 0);

  const handleAddCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/service-categories/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(serviceCategoryData)
      });
      const data = await response.json();
      if (response.status === 201) {
        alert("Service Category Added Successfully")
        setServiceCategoryOpenForm(false)
        setServiceCategoryData({
          name: "",
          preference_tags: ""
        })
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleGetCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/service-categories/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        setServiceCategoryList(data);
        setServiceCategoryOpenForm(false)
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleCreateService = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/available-services/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(serviceData)
      });
      const data = await response.json();
      if (response.status === 201) {
        alert("Service Added Successfully")
        setServiceOpenForm(false)
        handleGetService();
        setServiceData({
          category: "",
          name: "",
          description: "",
          price: "",
          duration_minutes: "",
          status: "active",
          rating: "",
          slug: ""
        }
        )
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleEditService = async (service) => {
    setServiceEditData({
      category: service.category,
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
      status: service.status,
      rating: service.rating.toString(),
      slug: service.slug
    });
    setServiceEditForm(true)
  }

  const handleUpdateService = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/available-services/${serviceData?.slug}/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(serviceEditData)
      });
      const data = await response.json();
      console.log(data, response);
      if (response.status === 200) {
        alert("Service Updated Successfully")
        setServiceEditForm(false)
        handleGetService();
        setServiceEditData({
          category: "",
          name: "",
          description: "",
          price: "",
          duration_minutes: "",
          status: "active",
          rating: "",
          slug: ""
        }
        )
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleStatusClick = async (service: any) => {
    const newStatus = service.status === "available" ? "unavailable" : "available";

    // 1️⃣ UI ko turant update karo
    setServiceDataList(prevList =>
      prevList.map(s =>
        s.id === service.id ? { ...s, status: newStatus } : s
      )
    );

    // 2️⃣ Backend ko PATCH request bhejo
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/available-services/${service.slug}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        // Agar error aaye → UI revert kar do
        setServiceDataList(prevList =>
          prevList.map(s =>
            s.id === service.id ? { ...s, status: service.status } : s
          )
        );

        const errText = await response.text();
        console.error("Backend error:", errText);
        alert("Failed to update status!");
      }
    } catch (error) {
      console.error("Network error:", error);

      // UI revert karo
      setServiceDataList(prevList =>
        prevList.map(s =>
          s.id === service.id ? { ...s, status: service.status } : s
        )
      );

      alert("Something went wrong!");
    }
  };


  const handleGetService = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/available-services/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setServiceDataList(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleGetServiceRequest = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/service-requests/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setServiceRequestDataList(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleGetAnalytics = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/analytics/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        setAnalyticsList(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleGetProfile = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/guest-profiles/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        const guests = data.map((item: any, index: number) => ({
          id: index,
          name: item.guest_name,
          roomNumber: item.room_number,
          checkIn: item.check_in,
          checkOut: item.check_out,
          totalSpent: Number(item.total_spent),
          satisfaction: item.satisfaction,
          preferences: item.preferences,
          vipStatus: false, // API में मिले तो वही लगाओ
        }));

        // set state
        setGuests(guests);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleGetBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const filtered = data.filter(item =>
          item.status === "checked_in" && item.status !== "checked_out"
        );

        setBookings(filtered);
      }

      if (!response.ok) {
        console.error("Error fetching bookings:", response.status);
        return;
      }
    } catch (error) {
      console.error("Error in fetching bookings:", error);
    }
  };



  const handleCreateServiceRequest = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/service-requests/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(serviceRequestData)
      });
      const data = await response.json();
      if (response.status === 201) {
        alert("Service Request Added Successfully")
        setServiceRequestOpenForm(false)
        handleGetService();
        setServiceRequestData({
          booking: "",
          assigned_to: "",
          category: "",
          service_type: "",
          schedule_datetime: "",
          description: "",
          priority: "low",
          cost: "",
          rating: "",
          created_by: "",
          icon: ""
        }
        )
      }
    }
    catch (error) {
      console.error(error);
    }
  };



  const handleGuestDashboardSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/summary/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data) {
        setDashboardSummary(data);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleUpdateServiceRequest = async (slug,status) => {
      let status_value = "";
     if(!status || !slug)return alert("Please select the status.")
       if(status === "pending"){
          status_value = "in_progress";
       }
       else if(status === "in_progress"){
         status_value = "completed";
       }
       else if(status === "completed"){
        status_value = "cancelled";
      }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/guest-services/service-requests/${slug}/`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({status : status_value})
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Service Status Updated Successfully")
        handleGetServiceRequest();

      }
    }
    catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    handleGuestDashboardSummary()
    handleGetCategory();
    handleGetServiceRequest();
    handleGetService();
    handleGetBookings();
    handleGetProfile();
    handleGetAnalytics();
  }, [])

  function capitalizeWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }


  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Requests</p>
                <p className="text-3xl font-bold">{dashboardSummary?.total_requests}</p>
              </div>
              <MessageCircle className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pending</p>
                <p className="text-3xl font-bold">{dashboardSummary?.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed</p>
                <p className="text-3xl font-bold">{dashboardSummary?.completed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Revenue</p>
                <p className="text-3xl font-bold">₹{dashboardSummary?.total_revenue}</p>
              </div>
              <Star className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={serviceRequestOpenForm} onOpenChange={setServiceRequestOpenForm}>
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
            <DialogTitle className="text-lg font-bold">Create Service Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            {/* ROW 1 — Booking + Assigned To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Booking *</label>

                <select
                  name="booking"
                  value={serviceRequestData.booking}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      booking: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select Booking</option>

                  {bookings.map((item) => (
                    <option key={item.id} value={item.booking_code}>
                      {item.booking_code}
                    </option>
                  ))}

                </select>
              </div>


              <div>
                <label className="text-xs font-medium">Assigned To</label>
                <Input
                  placeholder="Assigned To Email.."
                  className="text-sm"
                  name="assigned_to"
                  value={serviceRequestData.assigned_to}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Description (full width) */}
            <div>
              <label className="text-xs font-medium">Description</label>
              <textarea
                placeholder="Enter Description"
                name="description"
                value={serviceRequestData.description}
                onChange={(e) =>
                  setServiceRequestData({
                    ...serviceRequestData,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full text-sm border rounded-md px-3 py-2 resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-xs font-medium">Icon</label>

              <select
                name="icon"
                value={serviceRequestData.icon}
                onChange={(e) =>
                  setServiceRequestData({
                    ...serviceRequestData,
                    icon: e.target.value,
                  })
                }
                className="w-full text-sm border rounded-md px-3 py-2"
              >
                <option value="" disabled>
                  Select an icon
                </option>

                {Object.keys(LucideIcons).map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName} {/* Icon preview not possible in standard <option> */}
                  </option>
                ))}
              </select>
            </div>

            {/* ROW 2 — Category + Service Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Category *</label>
                <select
                  name="category"
                  value={serviceRequestData.category}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select Category</option>
                  {serviceCategoryList.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">Service Type *</label>
                <Input
                  placeholder="Enter Service Type"
                  className="text-sm"
                  name="service_type"
                  value={serviceRequestData.service_type}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* ROW 3 — Schedule Datetime + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Schedule Datetime *</label>
                <Input
                  type="datetime-local"
                  className="text-sm"
                  name="schedule_datetime"
                  value={serviceRequestData.schedule_datetime}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium">Priority *</label>
                <select
                  name="priority"
                  value={serviceRequestData.priority}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* ROW 4 — Cost + Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Cost</label>
                <Input
                  placeholder="Enter Cost"
                  type="number"
                  className="text-sm"
                  name="cost"
                  value={serviceRequestData.cost}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium">Rating</label>
                <Input
                  placeholder="Rating (optional)"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="text-sm"
                  name="rating"
                  value={serviceRequestData.rating}
                  onChange={(e) =>
                    setServiceRequestData({
                      ...serviceRequestData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleCreateServiceRequest}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm py-2"
            >
              Create Request
            </Button>

          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
          <TabsTrigger value="services">Available Services</TabsTrigger>
          <TabsTrigger value="guests">Guest Profiles</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service Requests</h2>
              <p className="text-gray-600">Manage guest service requests and concierge tasks</p>
            </div>
            <Button onClick={() => { setServiceRequestOpenForm(true) }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRequestDataList.map((service) => {
              // Backend se aaya icon name
              const IconName = service.icon;

              // LucideIcons object se component get karo
              const TypeIcon = IconName
                ? (LucideIcons as any)[IconName] as React.FC<React.SVGProps<SVGSVGElement>>
                : null;

              return (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {TypeIcon ? <TypeIcon className="w-5 h-5 text-blue-600" /> : null}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.service_type}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {service.category_detail?.name || "No category"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <Badge className="bg-gray-200 text-gray-800">
                          {service.priority}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{service?.guest_name}{" - "}{service?.guest_room}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span> {(() => {
                            const date = new Date(service?.schedule_datetime);

                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = String(date.getFullYear()).slice(-2);

                            let hours = date.getHours();
                            const minutes = String(date.getMinutes()).padStart(2, "0");
                            const ampm = hours >= 12 ? "PM" : "AM";
                            hours = hours % 12 || 12;

                            return `${day}-${month}-${year}  ${hours}:${minutes} ${ampm}`;
                          })()}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                      <div className="flex justify-between w-full">
                        <span>Cost :</span>
                        <span>₹{parseFloat(service.cost).toLocaleString()}</span>
                      </div>

                      {service.status === "completed" && (
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < service.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({service.rating}/5)</span>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        {service.status === "pending" && (
                          <Button size="sm" className="flex-1" onClick={() => {handleUpdateServiceRequest(service?.slug, service?.status)}}>
                            Assign
                          </Button>
                        )}

                        {service.status === "in_progress" && (
                          <Button size="sm" className="flex-1" onClick={() => {handleUpdateServiceRequest(service?.slug, service?.status)}} >
                            Complete
                          </Button>
                        )}
                        {service.status === "in_progress" && (
                          <Button size="sm" className="flex-1" onClick={() => {handleUpdateServiceRequest(service?.slug, service?.status)}}>
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedService(service)}>
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>


        {selectedService && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative">

      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={() => setSelectedService(null)}
      >
        ✕
      </button>

      {/* HEADER */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          {(() => {
            const IconName = selectedService.icon;
            const Icon = IconName ? (LucideIcons as any)[IconName] : null;
            return Icon ? <Icon className="w-6 h-6 text-blue-600" /> : null;
          })()}
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {selectedService.service_type}
          </h2>
          <p className="text-gray-600 capitalize">
            {selectedService.category_detail?.name || "No category"}
          </p>
        </div>
      </div>

      {/* STATUS + PRICE */}
      <div className="flex gap-2 mb-4">
        <Badge className={getStatusColor(selectedService.status)}>
          {selectedService.status}
        </Badge>
        <Badge className="bg-gray-200 text-gray-800">
        {selectedService.priority}
        </Badge>
      </div>

      {/* DETAILS */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Guest:</strong> {selectedService.guest_name} - {selectedService.guest_room}
        </p>

        <p>
          <strong>Scheduled:</strong>{" "}
          {(() => {
            const date = new Date(selectedService.schedule_datetime);

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = String(date.getFullYear()).slice(-2);

            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            return `${day}-${month}-${year}  ${hours}:${minutes} ${ampm}`;
          })()}
        </p>

        <p>
          <strong>Description:</strong> {selectedService.description}
        </p>
      </div>

      {/* RATING */}
      {selectedService.rating && (
        <div className="flex items-center space-x-1 mt-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < selectedService.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({selectedService.rating}/5)
          </span>
        </div>
      )}
                            <div className="flex justify-between w-full">
                        <span>Cost :</span>
                        <span>₹{parseFloat(selectedService.cost)?.toLocaleString()}</span>
                      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-6">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => setSelectedService(null)}
        >
          Close
        </Button>
      </div>

    </div>
  </div>
)}





        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            {/* Left side: title + description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
              <p className="text-gray-600">Manage concierge services and offerings</p>
            </div>

            {/* Right side: buttons in a row */}
            <div className="flex space-x-2">
              <Button onClick={() => { setServiceCategoryOpenForm(true) }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Service Category
              </Button>
              <Button onClick={() => { setServiceOpenForm(true) }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>

          <Dialog open={serviceCategoryOpenForm} onOpenChange={setServiceCategoryOpenForm}>
            <DialogContent
              className="
            w-full 
            max-w-md 
            max-h-[90vh] 
            overflow-y-auto 
            rounded-lg 
            p-4 
            backdrop-blur-md
          "
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Add Service Category</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-medium">Name *</label>
                  <Input
                    placeholder="Enter Name"
                    className="text-sm"
                    name="name"
                    value={serviceCategoryData.name}
                    onChange={(e) =>
                      setServiceCategoryData({ ...serviceCategoryData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Preference Tags */}
                <div>
                  <label className="text-xs font-medium">Preference Tags</label>
                  <Input
                    placeholder="Enter Preference Tags"
                    className="text-sm"
                    name="preference_tags"
                    value={serviceCategoryData.preference_tags}
                    onChange={(e) =>
                      setServiceCategoryData({ ...serviceCategoryData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleAddCategory}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm py-2"
                >
                  Create Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={serviceOpenForm} onOpenChange={setServiceOpenForm}>
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
                <DialogTitle className="text-lg font-bold">Add Service</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 ">
                {/* Name */}
                <div>
                  <label className="text-xs font-medium">Name *</label>
                  <Input
                    placeholder="Enter Name"
                    className="text-sm"
                    name="name"
                    value={serviceData.name}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Description (Textarea) */}
                <div>
                  <label className="text-xs font-medium">Description</label>
                  <textarea
                    placeholder="Enter Description"
                    name="description"
                    value={serviceData.description}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                    className="w-full text-sm border rounded-md px-3 py-2 resize-none"
                    rows={4}
                  />
                </div>

                {/* Category (Select) */}
                <div>
                  <label className="text-xs font-medium">Category *</label>
                  <select
                    name="category"
                    value={serviceData.category}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="" disabled> Select Category </option>
                    {
                      serviceCategoryList.map((item) => (
                        <option key={item.id} value={item.slug}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-medium">Price *</label>
                  <Input
                    placeholder="Enter Price"
                    type="number"
                    className="text-sm"
                    name="price"
                    value={serviceData.price}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-medium">Duration (minutes) *</label>
                  <Input
                    placeholder="Enter Duration"
                    type="number"
                    min="0"
                    className="text-sm"
                    name="duration_minutes"
                    value={serviceData.duration_minutes}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-medium">Status</label>
                  <select
                    name="status"
                    value={serviceData.status}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-xs font-medium">Rating</label>
                  <Input
                    placeholder="Enter Rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="text-sm"
                    name="rating"
                    value={serviceData.rating}
                    onChange={(e) =>
                      setServiceData({ ...serviceData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleCreateService}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm py-2"
                >
                  Create Service
                </Button>
              </div>
            </DialogContent>
          </Dialog>


          <Dialog open={serviceEditForm} onOpenChange={setServiceEditForm}>
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
                <DialogTitle className="text-lg font-bold">Update Service</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 ">
                {/* Name */}
                <div>
                  <label className="text-xs font-medium">Name *</label>
                  <Input
                    placeholder="Enter Name"
                    className="text-sm"
                    name="name"
                    value={serviceEditData.name}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Description (Textarea) */}
                <div>
                  <label className="text-xs font-medium">Description</label>
                  <textarea
                    placeholder="Enter Description"
                    name="description"
                    value={serviceEditData.description}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                    className="w-full text-sm border rounded-md px-3 py-2 resize-none"
                    rows={4}
                  />
                </div>

                {/* Category (Select) */}
                <div>
                  <label className="text-xs font-medium">Category *</label>
                  <select
                    name="category"
                    value={serviceEditData.category}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="" disabled> Select Category </option>
                    {
                      serviceCategoryList.map((item) => (
                        <option key={item.id} value={item.slug}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-medium">Price *</label>
                  <Input
                    placeholder="Enter Price"
                    type="number"
                    className="text-sm"
                    name="price"
                    value={serviceEditData.price}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-medium">Duration (minutes) *</label>
                  <Input
                    placeholder="Enter Duration"
                    type="number"
                    min="0"
                    className="text-sm"
                    name="duration_minutes"
                    value={serviceEditData.duration_minutes}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-medium">Status</label>
                  <select
                    name="status"
                    value={serviceEditData.status}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-xs font-medium">Rating</label>
                  <Input
                    placeholder="Enter Rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="text-sm"
                    name="rating"
                    value={serviceEditData.rating}
                    onChange={(e) =>
                      setServiceEditData({ ...serviceEditData, [e.target.name]: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleUpdateService}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm py-2"
                >
                  Update Service
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceDataList.map((service) => {
              const CategoryIcon = getCategoryIcon(service.category);

              // Convert duration_minutes to hours if more than 60
              let durationText = "";
              if (service.duration_minutes >= 60) {
                const hours = Math.floor(service.duration_minutes / 60);
                const minutes = service.duration_minutes % 60;
                durationText = `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
              } else {
                durationText = `${service.duration_minutes}m`;
              }

              return (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <CategoryIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{capitalizeWords(service.name)}</h3>
                          <p className="text-sm text-gray-600">{capitalizeWords(service.category)}</p>
                        </div>
                      </div>
                      <Badge
                        className={`cursor-pointer ${service.status === "available"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        onClick={() => handleStatusClick(service)}
                      >
                        {service.status === "available" ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{capitalizeWords(service.description)}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-semibold text-lg">₹{service.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold">{durationText}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{service.rating}</span>
                          <span className="text-gray-600">({service.total_bookings} bookings)</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button onClick={() => { handleEditService(service) }} size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button
                          onClick={() => { setServiceRequestOpenForm(true) }}
                          size="sm"
                          className="flex-1"
                          disabled={service.status !== "available"}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </TabsContent>

        <TabsContent value="guests" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Guest Profiles</h2>
              <p className="text-gray-600">Manage guest preferences and service history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guests.map((guest) => (
              <Card key={guest.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">

                      <div className="w-12 h-12 rounded-full overflow-hidden bg-green-500 flex items-center justify-center text-white font-semibold">
                        {guest?.image ? (
                          <img
                            src={guest.image}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          guest.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        )}
                      </div>


                      <div>
                        <h3 className="font-semibold text-gray-900">{capitalizeWords(guest.name)}</h3>
                        <p className="text-sm text-gray-600">Room {guest.roomNumber}</p>
                      </div>
                    </div>
                    {guest.vipStatus && (
                      <Badge className="bg-gold-100 text-gold-800">VIP</Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span>{new Date(guest.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span>{new Date(guest.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total spent:</span>
                        <span className="font-semibold">₹{guest.totalSpent.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Satisfaction</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold">{guest.satisfaction}</span>
                        </div>
                      </div>
                      <Progress value={guest.satisfaction * 20} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Preferences:</p>
                      <div className="flex flex-wrap gap-1">
                        {guest.preferences.map((pref, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedGuest(guest)}>View History</Button>
                      <Button size="sm" className="flex-1" onClick={() => { setServiceRequestOpenForm(true) }}>New Request</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedGuest && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">

              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">

                {/* Close Button */}
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  onClick={() => setSelectedGuest(null)}
                >
                  ✕
                </button>

                {/* PROFILE SECTION */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-green-500 overflow-hidden flex items-center justify-center text-white font-bold">
                    {selectedGuest?.image ? (
                      <img
                        src={selectedGuest.image}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedGuest.name.split(" ").map(n => n[0]).join("").toUpperCase()
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">{selectedGuest.name}</h2>
                    <p className="text-gray-600">Room {selectedGuest.roomNumber}</p>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Check-in:</strong> {new Date(selectedGuest.checkIn).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(selectedGuest.checkOut).toLocaleDateString()}</p>
                  <p><strong>Total Spent:</strong> ₹{selectedGuest.totalSpent.toLocaleString()}</p>
                </div>

                {/* Satisfaction */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satisfaction</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{selectedGuest.satisfaction}</span>
                    </div>
                  </div>
                  <Progress value={selectedGuest.satisfaction * 20} className="h-2 mt-1" />
                </div>

                {/* Preferences */}
                <div className="mt-4">
                  <p className="font-medium">Preferences:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedGuest.preferences.map((p, i) => (
                      <Badge key={i} variant="outline">{p}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </TabsContent>



        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>Track service performance and guest satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Request Types */}
                  <div>
                    <h3 className="font-semibold mb-4">Request Types</h3>
                    <div className="space-y-2">
                      {analyticsList.request_types?.map((reqType) => {
                        const percentage =
                          analyticsList.request_types.reduce((acc, r) => acc + r.count, 0) > 0
                            ? (reqType.count /
                              analyticsList.request_types.reduce((acc, r) => acc + r.count, 0)) *
                            100
                            : 0;
                        return (
                          <div key={reqType.type} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{reqType.type}</span>
                              <span>
                                {reqType.count} requests ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Revenue */}
                  <div>
                    <h3 className="font-semibold mb-4">Service Revenue</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Revenue</span>
                        <span className="font-semibold">₹{analyticsList.revenue?.total_revenue?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average per Request</span>
                        <span className="font-semibold">
                          ₹{analyticsList.revenue?.average_per_request?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completion Rate</span>
                        <span className="font-semibold">
                          {analyticsList.revenue?.completion_rate?.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Status Distribution */}
                  <div>
                    <h3 className="font-semibold mb-4">Status Distribution</h3>
                    <div className="space-y-2">
                      {analyticsList.status_distribution?.map((statusItem) => {
                        const total =
                          analyticsList.status_distribution.reduce((acc, s) => acc + s.count, 0) || 0;
                        const percentage = total > 0 ? (statusItem.count / total) * 100 : 0;

                        return (
                          <div key={statusItem.status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{statusItem.status.replace("-", " ")}</span>
                              <span>
                                {statusItem.count} requests ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Guest Satisfaction */}
                  <div>
                    <h3 className="font-semibold mb-4">Guest Satisfaction</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Rating</span>
                        <span className="font-semibold">
                          {analyticsList.guest_satisfaction?.average_rating?.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">VIP Guests</span>
                        <span className="font-semibold">
                          {analyticsList.guest_satisfaction?.vip_guests} / {guests.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Guest Spending</span>
                        <span className="font-semibold">
                          ₹{analyticsList.guest_satisfaction?.total_guest_spending?.toLocaleString()}
                        </span>
                      </div>
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