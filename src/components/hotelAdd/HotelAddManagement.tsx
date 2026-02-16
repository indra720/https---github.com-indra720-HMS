import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoomBooking } from "./RoomBooking";
import { RoomStats } from "./RoomStats";
import { RoomGrid } from "./RoomGrid";
import { BookingsList } from "./RoleBookingsList";
import { getStatusColor, filterRooms } from "./utils";
import AddnewRoom from "./AddnewRoom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { json } from "stream/consumers";
import { set } from "date-fns";
import { toast } from "react-toastify";
import { checkAccess } from "../CheckRolePermissions/RoleChecking";


export const HotelAddManagement = ({ onViewHotel }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hotels");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [rooms, setRooms] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [step, setStep] = useState(1);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditHotel, setShowEditHotel] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [editingSlug, setEditingSlug] = useState("");
  const [newRole, setNewRole] = useState({
    name: "",
    description: ""
  })
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    is_active: false,
    role_slug: "",
    slug: "", // Added slug field
    modules: [],
  }
  )
  const [newHotel, setNewHotel] = useState({
    name: "",
    address: "",
    email: "",
    status: "",
    owner_slug: "",
    role: "",
    isActive: false,
    image: [],
    contact: "",
    city: "",
    state: "",
    description: "",
    country: "",
    pincode: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editHotel, setEditHotel] = useState({
    name: "",
    address: "",
    email: "",
    status: "",
    owner_slug: "",
    role: "",
    isActive: false,
    image: [],
    contact: "",
    city: "",
    state: "",
    description: "",
    country: "",
    pincode: "",
  });
  const [dashboardData, setDashboardData] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem('user'));

  const filteredRooms = filterRooms(hotels, searchTerm, filterStatus);
  const filter = async (v, slug) => {

    let status = { status: v.toLowerCase() };
    setHotels(prev => prev.map(hotel =>
      hotel.slug === slug ? { ...hotel, status: v } : hotel
    ));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/${slug}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
        body: JSON.stringify(status),

      });
      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error("Error in filtering rooms:", error);
      return;
    }

  }


  const handleRoomStatusChange = (roomId: string, newStatus: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
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
      setBookings(data);
      if (!response.ok) {
        console.error("Error fetching bookings:", response.status);
        return;
      }
    } catch (error) {
      console.error("Error in fetching bookings:", error);
    }
  };

  useEffect(() => {
    if (user.role === null) {
      // First time call
      handleGetBookings();
      // handleGetRooms();
      // handleGetRoomcategories();

      // Repeat every 60 seconds
      const intervalId = setInterval(() => {
        handleGetBookings();
        // handleGetRooms();
        // handleGetRoomcategories();
      }, 60000);

      // Cleanup
      return () => clearInterval(intervalId);
    }
  }, []);



  const handleCheckIn = async (bookingId: string) => {
    const status = { status: "checked_in" };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingId}/check-in/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
        body: JSON.stringify(status),

      });
      const data = await response.json();
      if (response.ok) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: "Active" } : booking
        ));
      }
      return;
    }
    catch (error) {
      console.error("Error in checking in booking:", error);
      return;
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    const status = { status: "checked_out" };


    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingId}/check-out/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
        body: JSON.stringify(status),
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: "Completed" } : booking
        ));
      }
    }

    catch (error) {
      console.error("Error in checking out booking:", error);
      return;
    }
    console.log(`Checking out booking ${bookingId}`);
  };

  const handleStateData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/stats/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
      });
      const data = await response.json();
      setDashboardData(data);
    }
    catch (error) { console.log(error) }
  }

  // Add Role 
  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/roles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
        body: JSON.stringify(newRole),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error adding role:", data);
      }
      else {
        alert("Role added successfully");
        setShowAddRole(false)
        newRole.name = "";
        newRole.description = "";
      }
    }
    catch (error) {
      console.error("Error in adding role:", error);
      return;
    }
  }
  // Get Roles List
  const handleGetRoleList = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/roles/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error fetching roles list:", response.status);
        return;
      }
      setRoleList(data);
    }
    catch (error) {
      console.error("Error in getting roles list:", error);
      return [];
    }
  }
  // Get Users List
  const handleGetUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
      });
      const data = await response.json();
      const adminData = data.filter(user => user.role === "Admin");
      setAdminList(adminData);
      // return data;
    }
    catch (error) {
      console.error("Error in getting users list:", error);
      return [];
    }
  };
  // Add User 
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Auto-generate slug
    let generatedSlug = "";
    if (newUser.full_name) {
      generatedSlug = newUser.full_name.toLowerCase().replace(/\s+/g, '-');
    } else if (newUser.email) {
      generatedSlug = newUser.email.split('@')[0].toLowerCase().replace(/\s+/g, '-');
    }
    // Append a timestamp to ensure uniqueness
    generatedSlug += `-${Date.now()}`;

    const userWithSlug = { ...newUser, slug: generatedSlug };
    console.log("Payload being sent:", userWithSlug); // Log the user object with the generated slug
    console.log("JSON payload string:", JSON.stringify(userWithSlug)); // Log the exact JSON string

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // include token
        },
        body: JSON.stringify(userWithSlug), // Send userWithSlug instead of newUser
      });
      const data = await response.json(); // Parse response data even for errors
      console.log("API Response Data:", data); // Log the API response data
      if (!response.ok) {
        console.error("Error adding user:", data);
        alert(`Error adding user: ${JSON.stringify(data)}`); // Show specific error to user
      }
      else {
        alert("User added successfully");
        setShowAddAdmin(false);
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          phone: "",
          is_active: false,
          role_slug: "",
          slug: "", // Reset slug field
          modules: [],
        })
      }
    }
    catch (error) {
      console.error("Error in adding user:", error);
    }
  }
  useEffect(() => {
    handleGetUser();
    handleStateData();
    handleGetRoleList();
  }, []);

  //  ✅ Add Image
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array
    console.log(selectedFiles);
    setNewHotel(prev => ({
      ...prev,
      image: [...prev.image, ...selectedFiles]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewHotel(prev => {
      const updatedImages = prev.image.filter((_, i) => i !== indexToRemove);

      // Agar sari images hat rahi hain, input bhi reset karo
      if (updatedImages.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return { ...prev, image: updatedImages };
    });
  };

  const handleEditImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array
    console.log(selectedFiles);
    setEditHotel(prev => ({
      ...prev,
      image: [...prev.image, ...selectedFiles]
    }));
  };

  const handleRemoveEditImage = (indexToRemove) => {
    setEditHotel(prev => {
      const updatedImages = prev.image.filter((_, i) => i !== indexToRemove);

      // Agar sari images hat rahi hain, input bhi reset karo
      if (updatedImages.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return { ...prev, image: updatedImages };
    });
  };

  // Add room
  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const formData = new FormData();

      formData.append("name", newHotel?.name);
      formData.append("description", newHotel?.description);
      formData.append("status", newHotel?.status);
      formData.append("address", newHotel?.address);
      formData.append("email", newHotel?.email);
      formData.append("contact_number", newHotel?.contact);
      formData.append("city", newHotel?.city);
      formData.append("state", newHotel?.state);
      formData.append("country", newHotel?.country);
      formData.append("pincode", newHotel?.pincode);
      formData.append("owner_slug", newHotel?.owner_slug);


      // Agar multiple images bhejni hain 
      if (Array.isArray(newHotel?.image)) {
        newHotel.image.forEach((img) => {
          formData.append("cover_image", img); // backend me 'media' ek array hoga
        });
      } else if (newHotel?.image) {
        formData.append("cover_image", newHotel.image); // single image
      }

      const obj = {};

      formData.forEach((value, key) => {
        obj[key] = value; // Convert FormData to a plain JavaScript object
      });

      console.log(obj)
      // Request bhejna
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // sirf token header me bhejna
        },
        body: formData,
      });

      // Parse response
      const data = await response.json();
      console.log(data);
      handleGetHotels();

      if (!response.ok) {
        console.error("Error posting Hotel:", response.status);
        return;
      }
      else {
        alert("Hotel added successfully");
        setStep(1);
      }

      // If successful, update local state
      setRooms((prev) => [...prev, data]);
      setShowAddHotel(false);

      // Reset form
      setNewHotel({
        name: "",
        address: "",
        email: "",
        owner_slug: "",
        role: "",
        isActive: false,
        status: "",
        image: [],
        contact: "",
        city: "",
        state: "",
        description: "",
        country: "",
        pincode: "",

      });
      console.log(response)
    } catch (error) {
      console.error("Error in adding Hotel:", error);
      alert("Something went wrong while adding Hotel");
    }
  };

  // ✅ Edit room
  const handleEditHotel = async (e) => {
    e.preventDefault();

    try {
      if (!editingSlug) {
        console.log("No hotel slug provided for editing room", editingSlug);
        return;
      }
      const formData = new FormData();

      formData.append("name", editHotel?.name);
      formData.append("description", editHotel?.description);
      formData.append("status", editHotel?.status);
      formData.append("address", editHotel?.address);
      formData.append("email", editHotel?.email);
      formData.append("contact_number", editHotel?.contact);
      formData.append("city", editHotel?.city);
      formData.append("state", editHotel?.state);
      formData.append("country", editHotel?.country);
      formData.append("pincode", editHotel?.pincode);
      formData.append("owner_slug", editHotel?.owner_slug);
      // Agar amenities ek array hai, to usko string me convert kar do

      // Agar multiple images bhejni hain
      if (Array.isArray(editHotel?.image)) {
        editHotel.image.forEach((img) => {
          formData.append("cover_image", img); // backend me 'media' ek array hoga
        });
      } else if (editHotel?.image) {
        formData.append("cover_image", editHotel.image); // single image
      }

      let obj = {};
      formData.forEach((value, key) => {
        obj[key] = value; // Convert FormData to a plain JavaScript object
      });
      console.log(obj);

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/${editingSlug}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data)
      console.log(response)
      if (!response.ok) {
        console.error("Error updating Hotel:");
        return;
      }
      else {
        alert("Hotel updated successfully");
        handleGetHotels();
        setShowEditHotel(false);
        setEditingSlug("")
      }

    } catch (error) {
      console.error("Error updating Hotel:", error);
    }
  };

  // Get Hotels Data

  const handleGetHotels = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json();
      console.log(data)
      setHotels(data)
    }
    catch (error) {
      console.log(error)
      return
    }
  }

  useEffect(() => {
    handleGetHotels();
  }, [])

  const resetForm = () => {
    setNewHotel({
      name: "",
      address: "",
      email: "",
      status: "available",
      image: [],
      contact: "",
      city: "",
      state: "",
      description: "",
      role: "",
      isActive: false,
      owner_slug: "",
      country: "",
      pincode: "",
    });
  };

  const deleteHotel = async (slug: string) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to permanently delete this Hotel?");
      if (!isConfirmed) {
        alert("Deletion cancelled");
        return;
      }
      // Send GET request
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/${slug}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // include token
          },
        }
      );
      console.log(response)

      if (response.status === 204) {
        alert("Hotel Deleted Successfully")
        handleGetHotels();
        console.log("Room deleted successfully");
      }

    } catch (error) {
      console.error("Error delete Hotel:", error);
    }
  };


  const handleEdit = (hotel) => {
    let ownerSlug = adminList.find(admin => admin.full_name === hotel.owner_name)?.slug;
    console.log(hotel)
    setEditHotel({
      name: hotel.name || "",
      address: hotel.address || "",
      email: hotel.email || "",
      status: hotel.status || "",
      role: hotel.role || "",
      isActive: hotel.isActive || false,

      // ✅ Safe handling for images (array or single)
      image: Array.isArray(hotel.image)
        ? hotel.image
        : hotel.logo
          ? [hotel.logo]
          : hotel.cover_image
            ? [hotel.cover_image]
            : [],

      contact: hotel.contact_number || "",
      city: hotel.city || "",
      state: hotel.state || "",
      description: hotel.description || "",
      country: hotel.country || "",
      owner_slug: ownerSlug || "",
      pincode: hotel.pincode || "",
    });

    setEditingSlug(hotel.slug);
    setShowEditHotel(true);
  };

  const handleViewHotel = (hotel) => {
    // Call parent callback to switch to HotelManagement
    if (onViewHotel) {
      onViewHotel(hotel.slug);
    }
  };
  const [guests, setGuests] = useState(1);
  const [roomss, setRoomss] = useState(1);

  const incrementGuests = () => setGuests(prev => Math.min(prev + 1, 10));
  const decrementGuests = () => setGuests(prev => Math.max(prev - 1, 1));

  const incrementRooms = () => setRoomss(prev => Math.min(prev + 1, 5));
  const decrementRooms = () => setRoomss(prev => Math.max(prev - 1, 1));

  if (user?.role === "Customer") {
    return (
      <div className="space-y-6 px-2 sm:px-4 md:px-8 max-w-[1400px] mx-auto mt-10">

        {/* 🔹 Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2 p-4 bg-white shadow rounded">

          {/* Left: Title */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Available Hotels
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Browse and view hotels assigned to you
            </p>
          </div>

          {/* Right: Inputs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">

            {/* Location */}
            <input
              type="text"
              placeholder="Enter location"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Check-in */}
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Check-out */}
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Guests */}
            <div className="flex items-center border border-gray-300 rounded px-2 py-1 gap-1">
              <button
                type="button"
                onClick={decrementGuests}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-2">{guests} Guest{guests > 1 ? "s" : ""}</span>
              <button
                type="button"
                onClick={incrementGuests}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Rooms */}
            <div className="flex items-center border border-gray-300 rounded px-2 py-1 gap-1">
              <button
                type="button"
                onClick={decrementRooms}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-2">{roomss} Room{roomss > 1 ? "s" : ""}</span>
              <button
                type="button"
                onClick={incrementRooms}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Search Button */}
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              <Search />
              Search
            </button>
          </div>
        </div>

        {/* 🔹 Hotels Grid */}
        <RoomGrid
          rooms={filteredRooms}
          filter={filter}
          onStatusChange={handleRoomStatusChange}
          getStatusColor={getStatusColor}
          onDelete={deleteHotel}
          onEdit={handleEdit}
          onView={handleViewHotel}
        />
      </div>
    );
  }



  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Hotel Dashboard</h2>
          <p className="text-gray-600 text-sm sm:text-base">A quick overview of your hotel's status.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 ml-0 md:ml-auto">
          
          <Button
            onClick={() => setShowAddAdmin(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
            onClick={() => setShowAddHotel(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Hotel
          </Button>

        </div>
      </div>

      {/* Role Add Form */}

      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => handleAddRole(e)}>

            <div>
              <Label htmlFor="name">Role name</Label>
              <Input
                id="name"
                value={newRole.name}
                onChange={e => setNewRole(r => ({ ...r, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newRole.description}
                onChange={e => setNewRole(r => ({ ...r, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Admin Form */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleAddUser}>

            <div>
              <Label htmlFor="full_name">full_name</Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={e => setNewUser(r => ({ ...r, full_name: e.target.value }))}
                required
              />
            </div>


            <div style={{ flex: 1 }}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={e => setNewUser(r => ({ ...r, email: e.target.value }))}
                required
              />
            </div>


            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={newUser.password}
                onChange={e => setNewUser(r => ({ ...r, password: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={e => setNewUser(r => ({ ...r, phone: e.target.value }))}
                required
              />
            </div>


            <div className="flex flex-col gap-4">

              <div>
                <Label htmlFor="role_slug">Role</Label>
                <select
                  id="role_slug"
                  value={newUser.role_slug}
                  onChange={e => setNewUser(r => ({ ...r, role_slug: e.target.value }))}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roleList.map((role, index) => (
                    <option key={index} value={role.slug}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Label>Select Roles</Label>

              <div className="flex gap-6 mt-2">
                {/* Hotel Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value="hotel"
                    checked={newUser.modules.includes("hotel")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNewUser((r) => {
                        const roles = [...r.modules];
                        if (checked) {
                          // add if not already present
                          if (!roles.includes("hotel")) roles.push("hotel");
                        } else {
                          // remove if unchecked
                          const index = roles.indexOf("hotel");
                          if (index > -1) roles.splice(index, 1);
                        }
                        return { ...r, modules: roles };
                      });
                    }}
                    className="w-4 h-4 text-blue-600 accent-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Hotel</span>
                </label>

                {/* Restaurant Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value="restaurant"
                    checked={newUser.modules.includes("restaurant")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNewUser((r) => {
                        const roles = [...r.modules];
                        if (checked) {
                          if (!roles.includes("restaurant")) roles.push("restaurant");
                        } else {
                          const index = roles.indexOf("restaurant");
                          if (index > -1) roles.splice(index, 1);
                        }
                        return { ...r, modules: roles };
                      });
                    }}
                    className="w-4 h-4 text-blue-600 accent-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Restaurant</span>
                </label>
              </div>
            </div>


            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>



      {/* Add Room Dialog */}
      <Dialog open={showAddHotel} onOpenChange={setShowAddHotel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleAddHotel}>

            <div>
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                value={newHotel.name}
                onChange={e => setNewHotel(r => ({ ...r, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newHotel.description}
                onChange={e => setNewHotel(r => ({ ...r, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-start">
              {/* Image Upload Field */}
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  required
                />

                {/* Image Preview Section */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {newHotel.image.map((file, index) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={index}
                        className="relative w-[100px] h-[100px]"
                      >
                        <img
                          src={objectUrl}
                          alt={`preview ${index}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <span
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer font-bold"
                        >
                          ×
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Field */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newHotel.status}
                  onChange={e => setNewHotel(r => ({ ...r, status: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Status --</option>
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="closed ">Closed </option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newHotel.address}
                  onChange={e => setNewHotel(r => ({ ...r, address: e.target.value }))}
                  required
                />
              </div>

              {/* <div style={{ flex: 1 }}>
              <Label htmlFor="address">User</Label>
              <Input
                id="address"
                value={newHotel.address}
                onChange={e => setNewHotel(r => ({ ...r, address: e.target.value }))}
                required
              />
            </div> */}

              <div style={{ flex: 1 }}>
                <Label htmlFor="owner_slug">User</Label>
                <select
                  id="owner_slug"
                  value={newHotel.owner_slug}
                  onChange={e => setNewHotel(r => ({ ...r, owner_slug: e.target.value }))}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                >
                  <option value="">Select User</option>
                  {adminList.map(admin => (
                    <option key={admin.id} value={admin.slug}>
                      {admin.full_name || admin.email}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newHotel.email}
                  onChange={e => setNewHotel(r => ({ ...r, email: e.target.value }))}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={newHotel.contact}
                  onChange={e => setNewHotel(r => ({ ...r, contact: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newHotel.city}
                  onChange={e => setNewHotel(r => ({ ...r, city: e.target.value }))}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newHotel.state}
                  onChange={e => setNewHotel(r => ({ ...r, state: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newHotel.country}
                  onChange={e => setNewHotel(r => ({ ...r, country: e.target.value }))}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={newHotel.pincode}
                  onChange={e => setNewHotel(r => ({ ...r, pincode: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={showEditHotel} onOpenChange={setShowEditHotel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Hotel</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => { handleEditHotel(e) }}>
            <div>
              <Label htmlFor="name">Hotel Name</Label>
              <Input
                id="name"
                value={editHotel.name}
                onChange={e => setEditHotel(r => ({ ...r, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={editHotel.description}
                onChange={e => setEditHotel(r => ({ ...r, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div className="grid grid-cols-2 gap-4 items-start">
              {/* Image Upload Field */}
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleEditImageChange}
                  required
                />

                {/* Image Preview Section */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {newHotel.image.map((file, index) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={index}
                        className="relative w-[100px] h-[100px]"
                      >
                        <img
                          src={objectUrl}
                          alt={`preview ${index}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <span
                          onClick={() => handleRemoveEditImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer font-bold"
                        >
                          ×
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Field */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newHotel.status}
                  onChange={e => setNewHotel(r => ({ ...r, status: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Status --</option>
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="closed ">Closed </option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editHotel.address}
                onChange={e => setEditHotel(r => ({ ...r, address: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editHotel.email}
                  onChange={e => setEditHotel(r => ({ ...r, email: e.target.value }))}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={editHotel.contact}
                  onChange={e => setEditHotel(r => ({ ...r, contact: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editHotel.city}
                  onChange={e => setEditHotel(r => ({ ...r, city: e.target.value }))}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={editHotel.state}
                  onChange={e => setEditHotel(r => ({ ...r, state: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={editHotel.country}
                  onChange={e => setEditHotel(r => ({ ...r, country: e.target.value }))}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={editHotel.pincode}
                  onChange={e => setEditHotel(r => ({ ...r, pincode: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <Button type="submit">Update Hotel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      {/* Quick Stats */}
      <div className="mb-2">
        <RoomStats onFilterChange={setFilterStatus} dashboardData={dashboardData} />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
        <Button
          variant={activeTab === "hotels" ? "default" : "ghost"}
          className={activeTab === "hotels" ? "bg-gray-300 shadow-sm" : ""}
          onClick={() => setActiveTab("hotels")}
        >
          Hotel Status
        </Button>
        <Button
          variant={activeTab === "bookingLists" ? "default" : "ghost"}
          className={activeTab === "bookingLists" ? "bg-gray-300 shadow-sm" : ""}
          onClick={() => setActiveTab("bookingLists")}
        >
          Role
        </Button>
        <Button
          variant={activeTab === "booking" ? "default" : "ghost"}
          className={activeTab === "booking" ? "bg-gray-300 shadow-sm" : ""}
          onClick={() => setActiveTab("booking")}
        >
          Comming Soon
        </Button>
      </div>

      {/* Content */}
      {activeTab === "hotels" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Hotel Status Overview</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                <Select value={filterStatus} onValueChange={(value) => {
                  setFilterStatus(value)
                }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hotels</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in-active">In-Active</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Hotels..."
                    className="pl-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RoomGrid
              rooms={filteredRooms}
              filter={filter}
              onStatusChange={handleRoomStatusChange}
              getStatusColor={getStatusColor}
              onDelete={deleteHotel}
              onEdit={handleEdit}
              onView={handleViewHotel}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "bookingLists" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Recent Roles</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search Role..." className="pl-9 w-full" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BookingsList
              bookings={bookings}
              list={roleList}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              getStatusColor={getStatusColor}

            />
          </CardContent>
        </Card>
      )}

      {/* {activeTab === "booking" && <RoomBooking category={Roomcategories} />} */}
    </div>
  );
};
