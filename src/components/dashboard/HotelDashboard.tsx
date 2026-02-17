import { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusColor } from "../hotel/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { HotelGrid } from "../hotel/HotelGrid";

export const HotelDashboard = () => {
  const [hotels, setHotels] = useState([]); // API data
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showEditHotel, setShowEditHotel] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  // ✅ Fetch hotels from API
  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();
      console.log("Fetched hotels:", data);
      
      setHotels(data); // ✅ Same structure as your static array
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchHotels();
  }, []);

  // ✅ Add new hotel
  const handleAddHotel = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      const result = await response.json();

      if (!response.ok) console.error("Failed to add hotel", result);

      setShowAddHotel(false);
      fetchHotels(); // ✅ Refresh list after adding
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Update hotel
  const handleUpdateHotel = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingHotel) return;

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/${
          editingHotel.slug
        }/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update hotel");

      await response.json();

      setShowEditHotel(false);
      setEditingHotel(null);
      fetchHotels(); // Refresh list after updating
    } catch (err) {
      console.error("Error updating hotel:", err);
    }
  };

  const handleStatusChange = async (hotelId: string, status: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/${hotelId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update hotel status");
      }

      fetchHotels(); // Refresh hotels list
    } catch (err) {
      console.error("Error updating hotel status:", err);
      setError(err.message);
    }
  };

  const handleEditClick = (hotel) => {
    setEditingHotel(hotel);
    setShowEditHotel(true);
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/${slug}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete hotel");
      }

      fetchHotels(); // Refresh hotels list
    } catch (err) {
      console.error("Error deleting hotel:", err);
      setError(err.message);
    }
  };

  // ✅ Search & filter
  const filteredHotels = hotels.filter((hotel) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTermLower) ||
      hotel.city.toLowerCase().includes(searchTermLower) ||
      hotel.state.toLowerCase().includes(searchTermLower) ||
      hotel.country.toLowerCase().includes(searchTermLower);

    const matchesFilter =
      filterStatus === "all" || hotel.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const dashboardData = {
    total_hotels: hotels.length,
    active_hotels: hotels.filter((h) => h.status === "available").length,
    inactive_hotels: hotels.filter((h) => h.status === "closed").length,
    maintenance: hotels.filter((h) => h.status === "maintenance").length,
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hotel Dashboard
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            A quick overview of your hotel's status.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 ml-0 md:ml-auto">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
            onClick={() => setShowAddHotel(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Hotel
          </Button>
        </div>
      </div>

      {/* Add Hotel Dialog */}
      <Dialog open={showAddHotel} onOpenChange={setShowAddHotel}>
        <DialogContent className="max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Add New Hotel</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleAddHotel}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotel Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Status --</option>
                  <option value="available">Active</option>
                  <option value="closed">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  required
                  defaultValue="India"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" type="number" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input id="contact_number" name="contact_number" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cover_image">Hotel Image</Label>
                <Input id="cover_image" name="cover_image" type="file" />
              </div>
              <div>
                <Label htmlFor="logo">Logo Image</Label>
                <Input id="logo" name="logo" type="file" />
              </div>
            </div>

            <DialogFooter className=" sm:items-center sm:justify-center">
              <Button type="submit" className="px-6">
                Add Hotel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Hotel Dialog */}
      <Dialog open={showEditHotel} onOpenChange={setShowEditHotel}>
        <DialogContent className="max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleUpdateHotel}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotel Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingHotel?.name}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  // required
                  defaultValue={editingHotel?.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Status --</option>
                  <option value="available">Active</option>
                  <option value="closed">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                required
                defaultValue={editingHotel?.description}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                required
                defaultValue={editingHotel?.address}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  defaultValue={editingHotel?.city}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  required
                  defaultValue={editingHotel?.state}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  required
                  defaultValue={editingHotel?.country}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="number"
                  required
                  defaultValue={editingHotel?.pincode}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  required
                  defaultValue={editingHotel?.contact_number}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={editingHotel?.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cover_image">Hotel Image</Label>
                <Input id="cover_image" name="cover_image" type="file" />
              </div>
              <div>
                <Label htmlFor="logo">Logo Image</Label>
                <Input id="logo" name="logo" type="file" />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="mb-2 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hotels</p>
                <p className="text-xl font-bold text-green-600">
                  {dashboardData.total_hotels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600">
                  {dashboardData.active_hotels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Closed</p>
                <p className="text-xl font-bold text-yellow-500">
                  {dashboardData.inactive_hotels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-xl font-bold text-red-500">
                  {dashboardData.maintenance}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotel Grid */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">
              Hotel Status Overview
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Hotels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hotels</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in-active">In-Active</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-40" />
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

        {/* <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading hotels...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-6">{error}</p>
          ) : (
            <HotelGrid
              hotels={filteredHotels}
              getStatusColor={getStatusColor}
              onDelete={handleDelete}
              onEdit={handleEditClick}
              onStatusChange={handleStatusChange}
              filter={function (value: string, slug: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        </CardContent> */}
      </Card>
    </div>
  );
};

export default HotelDashboard;
