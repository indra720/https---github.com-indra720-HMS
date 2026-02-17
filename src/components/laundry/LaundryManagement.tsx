
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shirt, Clock, CheckCircle, AlertCircle, Truck,
  Plus, Search, Filter, Calendar, User, Package,
  Tags,
  Weight,
  Wrench,
  XCircle,
  PackagePlus,
  Zap,
  Home,
  PackageMinus,
  Minus,
  PackageCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";
import Spinner from "../ui/Spinner";
interface OrderItem {
  id: number;
  name: string;
  qty: string;
}

export const LaundryManagement = () => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState({});
  const [OrdersSummary, setOrdersSummary] = useState([])
  const STATUS_FLOW = ["pending", "in_progress", "ready", "delivered"];
  const [NextStatus, setNextStatus] = useState("");
  const [slug, setSlug] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const accessToken = localStorage.getItem("accessToken") || "";
  const [AllOrders, setAllOrders] = useState([]);
  const [editOrder, setEditOrder] = useState('');
  const [AllBookings, setAllBookings] = useState([]);
  // const [FilteredRooms, setFilteredRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [PlaceOrder, setPlaceOrder] = useState({
    room: "",
    booking: "",
    service_type: "laundry",
    description: {
      items: [{
        id: Date.now(),
        name: "",
        qty: 0,
      }]

    },
    priority: "",
    pickup_time: "",
    delivery_time: "",

  });
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredOrders = AllOrders.filter(order => {
    return statusFilter === "all" || order.status === statusFilter;
  });


  const statusFlow = {
    pending: "in_progress",
    in_progress: "ready",
    ready: "delivered",
    delivered: "delivered" // no next
  };


  // -----------------  Adding Input item functions

  function convertToIST(dateString: string): string {
    return new Date(dateString)
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  }

  const handleAddItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setPlaceOrder(prev => ({
      ...prev,
      description: {
        ...prev.description,
        items: [
          ...prev.description.items,
          { id: Date.now(), name: '', qty: 0 }
        ]
      }
    }));
  };

  const handleItemChange = (id: number, field: keyof Omit<OrderItem, 'id'>, value: string | number) => {
    setPlaceOrder(prev => ({
      ...prev,
      description: {
        ...prev.description,
        items: prev.description.items.map(item =>
          item.id === id ? {
            ...item,

            [field]: field === 'qty' ? Number(value) : value
          } : item
        )
      }
    }));
  };

  const handleRemoveItem = (id: number) => {
    setPlaceOrder(prev => ({
      ...prev,
      description: {
        ...prev.description,
        items: prev.description.items.filter(item => item.id !== id)
      }
    }));
  };

  //------------------Editing Functionality ------------------------------------------------------------------------

  const fillingdata = (order) => {
    setPlaceOrder({
      room: order.room,
      booking: order.booking,
      service_type: order.service_type,

      description: {
        items: order.description.items.map((item) => ({
          id: crypto.randomUUID(),    // unique id for UI
          name: item.name,
          qty: item.qty,
        }))
      },

      priority: order.priority,
      pickup_time: order.pickup_time,
      delivery_time: order.delivery_time,
    });
    setEditOrder(order.room_number);
    setSlug(order.slug);

    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const EditCall = async (e) => {
    e.preventDefault();
    setLoading(true);  // 🔥 Loader Start

    console.log("!!!!!!!", PlaceOrder)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/room-service-requests/${slug}/`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(PlaceOrder),
      });

      const data = await response.json();
      console.log("Edited Order:", data);

      if (response.ok) {
        toast({
          title: "Order Updated",
          description: "Your order has been Edited successfully.",
          className: "bg-emerald-600 text-white border-none shadow-lg"
        });

      } else {
        throw new Error(`Failed to Place Order: ${JSON.stringify(data)}`);
      }

    } catch (error) {
      console.error("Error Placing Orders:", error);

    } finally {
      setLoading(false);  // 🔥 Loader Stop (Important)
    }



    setPlaceOrder({
      room: "",
      booking: "",
      service_type: "laundry",
      description: {
        items: [{
          id: Date.now(),
          name: "",
          qty: 0,
        }]

      },
      priority: "",
      pickup_time: "",
      delivery_time: "",
    })
    setIsModalOpen(false);
    LaundrySummary();
    Orderslist()


  }
  //------------------Editing Functionality END ------------------------------------------------------------------------

  useEffect(() => {
    if (!isModalOpen) {
      setPlaceOrder(
        {
          room: "",
          booking: "",
          service_type: "laundry",
          description: {
            items: [{
              id: Date.now(),
              name: "",
              qty: 0,
            }]

          },
          priority: "",
          pickup_time: "",
          delivery_time: "",

        }

      )
      setIsEditMode(false);
    }


  }, [isModalOpen])


  // -----------------  Adding Input item functions END


  //--------Getting LaundrySummary -----------------------------------------------------------------------------------------------------
  const LaundrySummary = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/room-service-requests/summary/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
      });
      const data = await response.json();
      setOrdersSummary(data);
      console.log("Orders Summary:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched Summary:", data);
      } else {
        throw new Error(`Failed to get Summary: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting Summary:", error);
    }
  }

  //--------Getting Orders -----------------------------------------------------------------------------------------------------
  const Orderslist = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/room-service-requests/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
      });
      const data = await response.json();
      setAllOrders(data);
      console.log("Orders  data:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched Orders:", data);
      } else {
        throw new Error(`Failed to get Orders: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting Orders:", error);
    }

  }

  //--------Placing Order Functionality-----------------------------------------------------------------------------------------------------
  const placeOrderFunction = async (e) => {
    e.preventDefault();
    console.log(PlaceOrder)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/room-service-requests/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(PlaceOrder),
      });
      const data = await response.json();
      console.log("Placed Order:", data);
      if (response.ok) {
        // setOrders(data);
        toast({
          title: "Order Placed",
          description: "Your order has been placed successfully.",
          className: "bg-emerald-600 text-white border-none shadow-lg"
        });


        setPlaceOrder({
          room: "",
          booking: "",
          service_type: "laundry",
          description: {
            items: [{
              id: Date.now(),
              name: "",
              qty: 0,
            }]

          },
          priority: "",
          pickup_time: "",
          delivery_time: "",
        })
      } else {
        throw new Error(`Failed to Place Order: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error Placing Orders:", error);
    }
    LaundrySummary();
    Orderslist()
    setIsModalOpen(false);

  }


  //-------Updating Order-------------------------------------------------------------------------------------------------------



  const UpdateOrderFunction = async (current, next) => {

    const payload = {
      status: next
    }
    console.log(payload)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/room-service-requests/${current}/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(payload);
      if (response.ok) {
        // setOrders(data);
        // alert("Order Updated Successfully");
        toast({
          title: "Order Updated",
          description: "Laundry order updated successfully.",
          className: "bg-emerald-700 text-white border-none shadow-md"
        });

      } else {
        throw new Error(`Failed to Deliever Order: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error Placing Orders:", error);
    }
    setNextStatus('')
    LaundrySummary();
    Orderslist()

  }




  // ------ Getting Rooms--------------------------------------------------------------------------------------------------------


  const RoomsList = async () => {


    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
      });
      const data = await response.json();
      const checkedInBookings = data.filter(b => b.status === "checked_in");

      setAllBookings(checkedInBookings);
      console.log("bookings data:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched bookings:", data);
      } else {
        throw new Error(`Failed to get bookings: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting bookings:", error);
    }


  }


  useEffect(() => {
    RoomsList();
    Orderslist();
    LaundrySummary();
  }, [])




  const laundryOrders = [
    {
      id: "LAU001",
      customer: "Room 201 - John Smith",
      items: ["2x Shirts", "1x Pants", "3x Towels"],
      status: "In Progress",
      priority: "Normal",
      pickupTime: "10:30 AM",
      deliveryTime: "4:00 PM",
      amount: "$25.50",
      date: "2024-01-15"
    },
    {
      id: "LAU002",
      customer: "Room 305 - Sarah Johnson",
      items: ["1x Dress", "2x Blouses"],
      status: "Ready",
      priority: "Express",
      pickupTime: "11:00 AM",
      deliveryTime: "2:00 PM",
      amount: "$18.00",
      date: "2024-01-15"
    },
    // ... more orders
  ];

  const fixedStats = [
    { key: "orders_today", title: "Orders Today", icon: Package, color: "blue" },
    { key: "in_progress", title: "In Progress", icon: Clock, color: "orange" },
    { key: "ready_for_delivery", title: "Ready for Delivery", icon: CheckCircle, color: "green" },
    { key: "express_orders", title: "Express Orders", icon: AlertCircle, color: "red" },
  ];
  const laundryStats = fixedStats.map((item) => ({
    ...item,
    value: OrdersSummary[item.key]?.count ?? 0,
    change: OrdersSummary[item.key]?.growth ?? "0%",
  }));


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Picked Up":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Express":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Laundry Management</h2>
          <p className="text-gray-600 text-sm mt-1">Track and manage laundry services for guests</p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-xs"
          onClick={() => setIsModalOpen(true)} >
          <Plus className="w-3 h-3 mr-1" />
          New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {laundryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
          <div className="relative p-6 border w-full max-w-lg shadow-2xl rounded-lg bg-white transform transition-all duration-300 scale-100 opacity-100">

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)} // Assuming setIsModalOpen is a prop
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close Modal"
            >
              <XCircle className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">{isEditMode ? "Edit Order" : "Create New Laundry"}</h3>

            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();   //  Form reload stop
                setLoading(true);

                if (isEditMode) {
                  await EditCall(e);
                } else {
                  await placeOrderFunction(e);
                }

                setLoading(false);
              }}
            >


              {/* --- 1. ROOM Selection Field (Select Option) --- */}
              <select
                id="room"
                name="room"
                disabled={isEditMode}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-purple-500 focus:ring-purple-500 sm:text-sm 
                p-2 border max-h-40 overflow-y-auto"
                onChange={(e) => {
                  const selectedBooking = JSON.parse(e.target.value);

                  setPlaceOrder(prev => ({
                    ...prev,
                    booking: selectedBooking.slug,
                    room: selectedBooking.room,
                  }));
                }}
              >
                {!isEditMode && <option value="">Select Room</option>}

                {
                  isEditMode
                    ? (
                      <option value={JSON.stringify(editOrder)}>
                        {editOrder}
                      </option>
                    )
                    : AllBookings.map((room) => (
                      <option key={room.id} value={JSON.stringify(room)}>
                        {room.room_number}
                      </option>
                    ))
                }
              </select>



              <div className="relative space-y-3 p-4 border border-dashed border-gray-300 rounded-md">

                <div className="flex justify-between items-center mb-3 -mt-1"> {/* Flex container for Items List title and Add Button */}
                  {/* Items List Title */}
                  <div className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Tags className="h-4 w-4 mr-2 text-purple-600" />
                    Items List
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItem} // handleAddItem function is used here
                    className="px-3 py-1.5 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors flex items-center shadow-md"
                    aria-label="Add Item"
                  >
                    <Plus className="h-4 w-4 mr-1 text-white" />
                    Add Item
                  </button>
                </div>


                {PlaceOrder.description.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 gap-3 items-end">

                    {/* Item Name Input */}
                    <div className="col-span-2">
                      <label htmlFor={`item_name_${item.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        id={`item_name_${item.id}`}
                        name="name"
                        placeholder="e.g., Shirt"
                        required
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                      />
                    </div>

                    {/* Quantity Input */}
                    <div className="col-span-1">
                      <label htmlFor={`item_quantity_${item.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id={`item_quantity_${item.id}`}
                        name="qty"
                        min="1"
                        placeholder="Qty"
                        required
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                      />
                    </div>

                    {/* Remove Button */}
                    {PlaceOrder.description.items.length > 1 && (
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="relative -translate-y-1 p-1.5 w-8 h-8 text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors border border-red-600 rounded-md flex justify-center items-center"
                          aria-label="Remove Item"
                        >
                          <Minus className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>

                    )}
                    {/* Empty placeholder for alignment when only one item exists */}
                    {PlaceOrder.description.items.length === 1 && <div className="col-span-1 h-8"></div>}
                  </div>
                ))}


                {/* Previous "Add Another Item" button is REMOVED from here */}
              </div>


              {/* --- 3. PRIORITY Field (Radio Buttons) --- */}
              <div>
                <span className="block text-sm font-medium text-gray-700 flex items-center mb-2">
                  <Zap className="h-4 w-4 mr-2 text-purple-600" />
                  Priority
                </span>

                <div className="mt-1 flex space-x-6">

                  {/* Normal */}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="normal"
                      disabled={isEditMode}
                      checked={PlaceOrder.priority === "normal"}   // 🔥 Prefilled selected
                      onChange={(e) =>
                        setPlaceOrder((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Normal</span>
                  </label>

                  {/* Express */}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="express"
                      disabled={isEditMode}
                      checked={PlaceOrder.priority === "express"}  // 🔥 Prefilled selected
                      onChange={(e) =>
                        setPlaceOrder((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Express</span>
                  </label>

                </div>
              </div>


              {/* --- 4 & 5. Pickup and Delivery Time (Two-column layout) --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Pickup Time */}
                <div>
                  <label
                    htmlFor="pickup_time"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    Pickup Time
                  </label>

                  <input
                    type="time"
                    id="pickup_time"
                    name="pickup_time"
                    required
                    value={PlaceOrder.pickup_time || ""}     // 🔥 prefilled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                    onChange={(e) =>
                      setPlaceOrder((prev) => ({
                        ...prev,
                        pickup_time: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Delivery Time */}
                <div>
                  <label
                    htmlFor="delivery_time"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Truck className="h-4 w-4 mr-2 text-purple-600" />
                    Delivery Time
                  </label>

                  <input
                    type="time"
                    id="delivery_time"
                    name="delivery_time"
                    required
                    value={PlaceOrder.delivery_time || ""}   // 🔥 prefilled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                    onChange={(e) =>
                      setPlaceOrder((prev) => ({
                        ...prev,
                        delivery_time: e.target.value,
                      }))
                    }
                  />
                </div>

              </div>



              {/* Form Submission Buttons */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 
               text-white font-medium rounded-md transition-all duration-200
               flex items-center justify-center min-w-40 overflow-hidden"
                >
                  <span className={`flex items-center transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"}`}>
                    {isEditMode ? (
                      <>
                        <PackageCheck className="h-4 w-4 mr-2" />
                        Update Order
                      </>
                    ) : (
                      <>
                        <PackagePlus className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </span>

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner />
                    </div>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search orders..." className="pl-9 text-sm" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <SelectTrigger className="w-32 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Laundry Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{`${order.service_code.split("-")[0]}-${order.service_code.split("-")[3]}`}
                  </h3>
                  <p className="text-xs text-gray-600 flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{order.room_number} - {order.booking_guest_name || "No Name"}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(order.status) + " text-xs"}>
                    {order.status_display}
                  </Badge>
                  <Badge className={getPriorityColor(order.priority) + " text-xs"}>
                    {order.priority}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Shirt className="w-3 h-3" />
                  <span>Items: {order.description.items.map(item => `${item.name} (x${item.qty})`).join(", ")}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Pickup: {order.pickup_time} | Delivery: {order.delivery_time}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{convertToIST(order.requested_at)}</span>
                </div>
              </div><div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between w-full">

                  {/* LEFT SIDE → Amount */}
                  <div className="text-lg font-bold text-green-600">
                    {order.amount}
                  </div>

                  {/* RIGHT SIDE → Buttons */}
                  <div className="flex items-center gap-2">

                    {order.status !== "delivered" && (
                      <Button
                        onClick={() => fillingdata(order)}
                        size="sm"
                        className="
    h-8 px-3 text-[13px] font-semibold tracking-wide
    rounded-md border border-blue-600
    text-blue-700 bg-white
    hover:bg-blue-600 hover:text-white
    active:scale-[0.97]
    transition-all duration-200
    shadow-sm
    w-auto flex-none
  "
                      >
                        Update
                      </Button>
                    )}



                    <Button
                      size="sm"
                      disabled={order.status === "delivered" || loadingDeliver[order.slug]}
                      onClick={async () => {
                        if (order.status !== "delivered") {
                          const next = statusFlow[order.status];

                          // set loading for ONLY this order
                          setLoadingDeliver(prev => ({ ...prev, [order.slug]: true }));

                          await UpdateOrderFunction(order.slug, next);

                          // turn off loading for ONLY this order
                          setLoadingDeliver(prev => ({ ...prev, [order.slug]: false }));
                        }
                      }}
                      className={`
                      relative text-xs h-7 
                      flex items-center justify-center group
                      bg-gradient-to-r from-blue-500 to-purple-500
                      min-w-[110px]
                      hover:bg-blue-600 hover:bg-none hover:text-white
                      !transition-none
                      ${order.status === "delivered"
                          ? "disabled:opacity-100 disabled:brightness-75 cursor-not-allowed"
                          : ""}
                    `}
                    >
                      {loadingDeliver[order.slug] ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      ) : (
                        <>
                          <span className="group-hover:hidden capitalize">
                            {order.status.replace("_", " ")}
                          </span>

                          <span className="hidden group-hover:inline-block text-white">
                            Update
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <CheckCircle className="w-5 h-5" />
            <span>Service Progress Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: "Collection", time: "10:30 AM", status: "completed", description: "Items collected from Room 201" },
              { stage: "Sorting", time: "11:00 AM", status: "completed", description: "Items sorted by fabric type" },
              { stage: "Washing", time: "11:30 AM", status: "active", description: "Currently in washing cycle" },
              { stage: "Drying", time: "1:00 PM", status: "pending", description: "Scheduled for drying" },
              { stage: "Pressing", time: "2:30 PM", status: "pending", description: "Professional pressing service" },
              { stage: "Quality Check", time: "3:30 PM", status: "pending", description: "Final quality inspection" },
              { stage: "Delivery", time: "4:00 PM", status: "pending", description: "Delivery to guest room" },
            ].map((stage, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                  stage.status === 'active' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                  {stage.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                    stage.status === 'active' ? <Clock className="w-4 h-4" /> :
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-gray-900">{stage.stage}</h4>
                    <span className="text-xs text-gray-500">{stage.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
