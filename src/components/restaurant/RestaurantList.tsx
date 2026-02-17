import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  ArrowRight,
  Navigation,
  Bookmark,
  Plus,
  Shield,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkAccess } from "../CheckRolePermissions/RoleChecking";

const RestaurantUltraWide = () => {
  const navigate = useNavigate();

  const [restaurantList, setRestaurantList] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);

  const [roleList, setRoleList] = useState([]);
  const [adminList, setAdminList] = useState([]);

  const [newRole, setNewRole] = useState({
    name: "",
    description: ""
  });

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    is_active: false,
    role_slug: "",
    modules: [],
  });

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    email: "",
    status: "",
    owner_slug: "",
    contact_number: "",
    city: "",
    state: "",
    description: "",
    country: "India",
    pincode: "",
    cover_image: [],
    rating: "", // Added rating field
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleGetRoleList = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/roles/`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       const data = await response.json();

// if (Array.isArray(data)) {
//   setRoleList(data);
// } else if (Array.isArray(data.results)) {
//   setRoleList(data.results);
// } else {
//   setRoleList([]);
// }

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleGetUserList = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       const data = await response.json();

//        const users = Array.isArray(data)
//   ? data
//   : Array.isArray(data.results)
//   ? data.results
//   : [];

// const adminData = users.filter(
//   (user) => user.role === "Admin" || user.role_name === "Admin"
// );

// setAdminList(adminData);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAddRole = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/roles/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(newRole),
//       });
//       if (response.ok) {
//         alert("Role added successfully");
//         setShowAddRole(false);
//         setNewRole({ name: "", description: "" });
//         handleGetRoleList();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        alert("Admin added successfully");
        setShowAddAdmin(false);
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          phone: "",
          is_active: false,
          role_slug: "",
          modules: [],
        });
        handleGetUserList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Ensure required fields are included in the payload
  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRestaurant.name || !newRestaurant.address || !newRestaurant.email || !newRestaurant.contact_number || !newRestaurant.rating) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(newRestaurant).forEach(([key, value]) => {
        if (key === "cover_image" && Array.isArray(value)) {
          value.forEach((img) => {
            formData.append("cover_image", img);
          });
        } else if (value !== null && value !== "") {
          formData.append(key, value as any);
        }
      });

      // Log the formData for debugging
      console.log("Payload being sent:", Object.fromEntries(formData.entries()));

      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        console.error("Server error:", err);
        alert("Add failed: " + (err.message || "Unknown error"));
        return;
      }

      alert("Restaurant added successfully");
      setShowAddRestaurant(false);
      setNewRestaurant({
        name: "",
        address: "",
        email: "",
        status: "",
        owner_slug: "",
        contact_number: "",
        city: "",
        state: "",
        description: "",
        country: "India",
        pincode: "",
        cover_image: [],
        rating: "", // Reset rating field
      });
      handleGetRestaurants();
      handleGetDashboard();
    } catch (error) {
      console.error("Request error:", error);
      alert("An error occurred while adding the restaurant.");
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewRestaurant(prev => ({
      ...prev,
      cover_image: [...prev.cover_image, ...selectedFiles]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewRestaurant(prev => ({
      ...prev,
      cover_image: prev.cover_image.filter((_, i) => i !== indexToRemove)
    }));
  };

  const [showEditRestaurant, setShowEditRestaurant] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  const handleDeleteRestaurant = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${slug}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        alert("Restaurant deleted successfully");
        handleGetRestaurants();
        handleGetDashboard();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (slug: string, status: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${slug}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        handleGetRestaurants();
        handleGetDashboard();
      }
    } catch (error) {
      console.error(error);
    }
  };

   const handleEditClick = (restaurant: any) => {
  setEditingRestaurant({
    ...restaurant,
    owner_slug: restaurant.owner_slug || restaurant.owner?.slug || "",
    country: restaurant.country || "India",
    cover_image: [], // new images if uploaded
  });
  setShowEditRestaurant(true);
};
 const handleUpdateRestaurant = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editingRestaurant?.name || !editingRestaurant?.address || !editingRestaurant?.email) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const formData = new FormData();

    Object.entries(editingRestaurant).forEach(([key, value]) => {
      if (key === "cover_image" && Array.isArray(value)) {
        value.forEach((img) => {
          formData.append("cover_image", img);
        });
      } else if (value !== null && value !== "") {
        formData.append(key, value as any);
      }
    });

    // Log the formData for debugging
    console.log("Payload being sent:", Object.fromEntries(formData.entries()));

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${editingRestaurant.slug}/`,
      {
        method: "PUT", // Changed to PUT
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Server error:", err);
      alert("Update failed: " + (err.message || "Unknown error"));
      return;
    }

    alert("Restaurant updated successfully");
    setShowEditRestaurant(false);
    setEditingRestaurant(null);
    handleGetRestaurants();
    handleGetDashboard();
  } catch (error) {
    console.error("Request error:", error);
    alert("An error occurred while updating the restaurant.");
  }
};


  const handleGetRestaurants = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setRestaurantList(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetDashboard = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/stats/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setDashboardSummary(data);
       
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetRestaurants();
    handleGetDashboard();
    
  }, []);

  const handleViewRestaurant = (restaurant: any) => {
    navigate(`/restaurant/${restaurant.slug}`);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-20">

      {/* HEADER */}
      <header className="max-w-[1600px] mx-auto px-6 mb-16 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">
            The <span className="text-orange-600">Grande</span> List
          </h1>
          <p className="text-slate-500 mt-2">
            Discover culinary excellence across the continent.
          </p>
        </div>

        {/* 🔥 RIGHT TOP BUTTONS */}
        <div className="flex gap-3">
          {checkAccess(null, ["Admin"]) && (
            <>
              

              <button
                onClick={() => setShowAddAdmin(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
              >
                <UserPlus className="w-4 h-4" />
                Add Admin
              </button>
            </>
          )}

          {checkAccess(null, ["Admin"]) && (
            <button
              onClick={() => setShowAddRestaurant(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-500 transition"
            >
              <Plus className="w-4 h-4" />
              Add New Restaurant
            </button>
          )}
        </div>
      </header>

      

      {/* Add Admin Form */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddUser}>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={e => setNewUser(r => ({ ...r, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
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
                type="password"
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
                 {Array.isArray(roleList) &&
  roleList.map((role) => (
    <option key={role.id} value={role.slug}>
      {role.name}
    </option>
  ))}

              </select>
            </div>
            <div className="flex flex-col gap-4">
              <Label>Select Modules</Label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser.modules.includes("hotel")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNewUser(r => {
                        const modules = [...r.modules];
                        if (checked && !modules.includes("hotel")) modules.push("hotel");
                        else if (!checked) modules.splice(modules.indexOf("hotel"), 1);
                        return { ...r, modules };
                      });
                    }}
                  />
                  <span>Hotel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser.modules.includes("restaurant")}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNewUser(r => {
                        const modules = [...r.modules];
                        if (checked && !modules.includes("restaurant")) modules.push("restaurant");
                        else if (!checked) modules.splice(modules.indexOf("restaurant"), 1);
                        return { ...r, modules };
                      });
                    }}
                  />
                  <span>Restaurant</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Restaurant Dialog */}
      <Dialog open={showAddRestaurant} onOpenChange={setShowAddRestaurant}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Restaurant</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddRestaurant}>
            <div>
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={newRestaurant.name}
                onChange={e => setNewRestaurant(r => ({ ...r, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newRestaurant.description}
                onChange={e => setNewRestaurant(r => ({ ...r, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
             
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Images</Label>
                <Input
                  id="image"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  required
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newRestaurant.cover_image.map((file, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newRestaurant.status}
                  onChange={e => setNewRestaurant(r => ({ ...r, status: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newRestaurant.address}
                  onChange={e => setNewRestaurant(r => ({ ...r, address: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="owner_slug">Owner</Label>
                <select
                  id="owner_slug"
                  value={newRestaurant.owner_slug}
                  onChange={e => setNewRestaurant(r => ({ ...r, owner_slug: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Owner</option>
                   {Array.isArray(adminList) &&
  adminList.map((admin) => (
    <option key={admin.id} value={admin.slug}>
      {admin.full_name}
    </option>
  ))}

                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newRestaurant.email}
                  onChange={e => setNewRestaurant(r => ({ ...r, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={newRestaurant.contact_number}
                  onChange={e => setNewRestaurant(r => ({ ...r, contact_number: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newRestaurant.city}
                  onChange={e => setNewRestaurant(r => ({ ...r, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newRestaurant.state}
                  onChange={e => setNewRestaurant(r => ({ ...r, state: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newRestaurant.country}
                  onChange={e => setNewRestaurant(r => ({ ...r, country: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={newRestaurant.pincode}
                  onChange={e => setNewRestaurant(r => ({ ...r, pincode: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                value={newRestaurant.rating}
                onChange={e => setNewRestaurant(r => ({ ...r, rating: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Restaurant</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Restaurant Dialog */}
      <Dialog open={showEditRestaurant} onOpenChange={(isOpen) => {
  if (!isOpen) {
    setShowEditRestaurant(false);
    setEditingRestaurant(null);
  }
}}>
        <DialogContent aria-label="Edit Restaurant Details" className="max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateRestaurant}>
            <div>
              <Label htmlFor="edit_name">Restaurant Name</Label>
              <Input
                id="edit_name"
                value={editingRestaurant?.name || ""}
                onChange={e => setEditingRestaurant(r => ({ ...r, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <textarea
                id="edit_description"
                value={editingRestaurant?.description || ""}
                onChange={e => setEditingRestaurant(r => ({ ...r, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
  <Label>Images</Label>
  <Input
    type="file"
    multiple
    onChange={(e) =>
      setEditingRestaurant(r => ({
        ...r,
        cover_image: Array.from(e.target.files || [])
      }))
    }
  />
</div>
 <div>
                <Label htmlFor="edit_status">Status</Label>
                <select
                  id="edit_status"
                  value={editingRestaurant?.status || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, status: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <Label htmlFor="edit_owner">Owner</Label>
                <select
                  id="edit_owner"
                  value={editingRestaurant?.owner_slug || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, owner_slug: e.target.value }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Owner</option>
                  {adminList.map(admin => (
                    <option key={admin.id} value={admin.slug}>
                      {admin.full_name}
                    </option>
                  ))}
                </select>
              </div>
               <div>
                <Label htmlFor="edit_address">Address</Label>
                <Input
                  id="edit_address"
                  value={editingRestaurant?.address || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, address: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  value={editingRestaurant?.email || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, email: e.target.value }))}
                  required
                />
              </div>
               <div>
                <Label htmlFor="edit_contact">Contact Number</Label>
                <Input
                  id="edit_contact"
                  value={editingRestaurant?.contact_number || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, contact_number: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <Label htmlFor="edit_city">City</Label>
                <Input
                  id="edit_city"
                  value={editingRestaurant?.city || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_state">State</Label>
                <Input
                  id="edit_state"
                  value={editingRestaurant?.state || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, state: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               
              <div>
                <Label htmlFor="edit_pincode">Pincode</Label>
                <Input
                  id="edit_pincode"
                  value={editingRestaurant?.pincode || ""}
                  onChange={e => setEditingRestaurant(r => ({ ...r, pincode: e.target.value }))}
                  required
                />
              </div>
               <div>
    <Label>Country</Label>
    <Input
      value={editingRestaurant?.country || ""}
      onChange={e =>
        setEditingRestaurant(r => ({ ...r, country: e.target.value }))
      }
      required
    />
  </div>

            </div>
            <DialogFooter>
              <Button type="submit">Update Restaurant</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* STATS */}
      <div className="max-w-[1600px] mx-auto px-6 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-sm text-slate-500 font-semibold uppercase">
              Restaurants 
            </p>
            <h3 className="text-4xl font-black mt-2">
              {dashboardSummary?.total_Restaurants}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-sm text-slate-500 font-semibold uppercase">
              Open
            </p>
            <h3 className="text-4xl font-black text-green-600 mt-2">
              {dashboardSummary?.open}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-sm text-slate-500 font-semibold uppercase">
              Closed
            </p>
            <h3 className="text-4xl font-black text-red-500 mt-2">
              {dashboardSummary?.closed}
            </h3>
          </div>
        </div>
      </div>

      {/* RESTAURANT GRID */}
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {restaurantList.map((res: any) => (
          <article
            key={res.id}
            className="group cursor-pointer"
            onClick={() => handleViewRestaurant(res)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <img
                src={res.cover_image}
                alt={res.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70" />

              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-xl flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                {res.rating}
              </div>

              <div className="absolute bottom-4 left-4 text-white">
                <span className="flex items-center gap-1 text-xs text-orange-400 font-semibold">
                  <Navigation className="w-3 h-3" />
                  {res.city}, {res.state}
                </span>
                <h2 className="text-2xl font-black">{res.name}</h2>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-black text-lg">₹2,000 for two</span>
                <div className="flex gap-2">
                  {checkAccess(null, ["Admin"]) && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(res);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRestaurant(res.slug);
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewRestaurant(res)}
                    className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-600 transition"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 30–40 min
                </div>
                {checkAccess(null, ["Admin"]) && (
                  <select
                    value={res.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(res.slug, e.target.value)}
                    className="text-xs border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RestaurantUltraWide;
