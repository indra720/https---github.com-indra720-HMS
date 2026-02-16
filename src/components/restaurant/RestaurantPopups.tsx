import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Star,
  Clock,
  Users,
  ChefHat,
  Utensils,
  CalendarDays,
  Edit,
  Trash2,
  Plus,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { log } from "console";

interface Table {
  id: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  reservation?: string;
  table_code: string;
  slug: string;
}
interface OrderItem {
  menu_item: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  slug: string;
  order_code: string;
  table_code: string;
  order_items: OrderItem[];  // <-- yaha string[] nahi, object array
  status: "pending" | "preparing" | "served" | "completed" | "cancelled";
  order_time: string;
  guest_name: string;
  guest_phone: string;
}

interface TableDetailsPopupProps {
  table: Table;
  trigger: React.ReactNode;
}

export const TableDetailsPopup = ({ table, trigger }: TableDetailsPopupProps) => {
  const accessToken = localStorage.getItem("accessToken") || "";
  const [isReservationMode, setIsReservationMode] = useState(false);
  const [date, setDate] = useState<Date>();


  // const [customerName, setCustomerName] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [guests, setGuests] = useState("");
  // const [specialRequests, setSpecialRequests] = useState("");

  const [Reservation, SetReservation] = useState({
    table: "",
    full_name: "",
    email: "",
    phone: "",
    special_occasion: "",
    special_requests: "",
    reservation_date: new Date().toISOString().slice(0, 10),
    reservation_time: new Date().toTimeString().slice(0, 8),
    people_count: ""
  })
  useEffect(() => {
    SetReservation({
      ...Reservation,
      table: table.slug
    })
  }, [table])

  // const handleReservation = () => {
  //   console.log(Reservation)
  //   setIsReservationMode(false);
  // };

  const createReservation = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/table-reservations/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(Reservation), // ✅ stringify zaroori hai
      });

      const data = await response.json();
      console.log(Reservation)

      if (response.ok) {
        alert("Table reserved successfully!");
        SetReservation({
          table: "",
          full_name: "",
          email: "",
          phone: "",
          special_occasion: "",
          special_requests: "",
          reservation_date: new Date().toISOString().slice(0, 10),
          reservation_time: new Date().toTimeString().slice(0, 8),
          people_count: ""
        });

        // ✅ success logic yahan likho
      } else {
        throw new Error(`Failed to add table: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error adding table:", error);
    }
    setIsReservationMode(false)
  }





  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-primary" />
            <span>Table {table.table_code} Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Table Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Table Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={table.status === "available" ? "default" : "secondary"}>
                  {table.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Capacity:</span>
                <span className="font-medium">{table.capacity} guests</span>
              </div>
              {table.reservation && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reserved for:</span>
                  <span className="font-medium">{table.reservation}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reservation Form */}
          {isReservationMode ? (
            <Card>
  <CardHeader>
    <CardTitle>New Reservation</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* All inputs in a 2-column grid */}
    <div className="grid grid-cols-2 gap-4">
      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="full_name"
          value={Reservation.full_name}
          onChange={(e) =>
            SetReservation((prev) => ({
              ...prev,
              full_name: e.target.value,
            }))
          }
          placeholder="Enter customer name"
          className="h-8 text-sm"
          required
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phone"
          value={Reservation.phone}
          onChange={(e) =>
            SetReservation((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          placeholder="Enter phone number"
          className="h-8 text-sm"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={Reservation.email}
          onChange={(e) =>
            SetReservation((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          placeholder="Enter email"
          className="h-8 text-sm"
          required
        />
      </div>

      {/* Date & Time */}
      <div className="space-y-2">
        <Label>Date & Time</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarDays className="mr-2 h-4 w-4" />
              {date ? format(date, "yyyy-MM-dd") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                if (selectedDate) {
                  SetReservation((prev) => ({
                    ...prev,
                    reservation_date: format(selectedDate, "yyyy-MM-dd"),
                  }));
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Number of Guests */}
      <div className="space-y-2">
        <Label htmlFor="guests">Number of Guests</Label>
        <Select
          value={Reservation.people_count}
          onValueChange={(value) =>
            SetReservation((prev) => ({
              ...prev,
              people_count: value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select guests" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: table.capacity }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1} {i === 0 ? "guest" : "guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Special Occasion */}
      <div className="space-y-2">
        <Label htmlFor="specialOccasion">Special Occasion</Label>
        <select
          id="special_occasion"
          value={Reservation.special_occasion}
          onChange={(e) =>
            SetReservation((prev) => ({
              ...prev,
              special_occasion: e.target.value,
            }))
          }
          className="w-full h-9 rounded-md border border-gray-300 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select an occasion</option>
          <option value="Birthday">Birthday</option>
          <option value="Anniversary">Anniversary</option>
          <option value="Business Meeting">Business Meeting</option>
          <option value="Family Gathering">Family Gathering</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    {/* Special Requests - full width */}
    <div className="space-y-2">
      <Label htmlFor="specialRequests">Special Requests</Label>
      <Textarea
        id="special_requests"
        value={Reservation.special_requests}
        onChange={(e) =>
          SetReservation((prev) => ({
            ...prev,
            special_requests: e.target.value,
          }))
        }
        placeholder="Any special requests or dietary requirements..."
        rows={3}
      />
    </div>

    {/* Buttons */}
    <div className="flex space-x-2">
      <Button onClick={createReservation} className="flex-1">
        Confirm Reservation
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsReservationMode(false)}
        className="flex-1"
      >
        Cancel
      </Button>
    </div>
  </CardContent>
</Card>

          ) : (
            <div className="flex space-x-2">
              {table.status === "available" && (
                <Button
                  onClick={() => setIsReservationMode(true)}
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Make Reservation
                </Button>
              )}
              {/* <Button variant="outline" className="flex-1">
                <ChefHat className="w-4 h-4 mr-2" />
                Take Order
              </Button> */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog >
  );
};

interface OrderDetailsPopupProps {
  order: Order;
  trigger: React.ReactNode;
  onStatusUpdated?: () => void;
}

export const OrderDetailsPopup = ({ order, trigger, onStatusUpdated }: OrderDetailsPopupProps) => {
  const [orderStatus, setOrderStatus] = useState<string>(order.status);
  const accessToken = localStorage.getItem("accessToken") || "";
  const [CurrentStatus, setCurrentStatus] = useState<string>(order.status);
  const [estimatedTime, setEstimatedTime] = useState("15");



  const statusOptions = [

    { value: "pending", label: "pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "preparing", label: "preparing", color: "bg-yellow-100 text-yellow-800" },
    { value: "served", label: "served", color: "bg-blue-100 text-blue-800" },
    { value: "completed", label: "completed", color: "bg-green-100 text-green-800" },
    { value: "cancelled", label: "cancelled", color: "bg-gray-100 text-gray-800" },
  ];

  const StatusUpdate = async () => {
    const payload = {
      status: CurrentStatus,
      guest_name: order.guest_name,
      guest_phone: order.guest_phone  // key ke saath bhej rahe hain
      // agar aur fields bhi bhejni hain toh yahan add kar sakte ho
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurant-orders/${order.slug}/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(payload),
      });
      // console.log(order.slug , JSON.stringify(payload));
      const data = await response.json();
      console.log("Status updated:", data);
      if (response.ok) {
        alert("Order status updated successfully!");
        setOrderStatus(data.status);
        console.log("Menu categories fetched:", data);
        onStatusUpdated?.();
      } else {
        throw new Error(`Failed to get menu items: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting menu items:", error);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-primary" />
            <span>Order {order.order_code}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Table:</span>
                <span className="font-medium">{order.table_code}</span>
                {/* <span className="font-medium">{order.table}</span> */}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time Ordered:</span>
                <span className="font-medium"> {new Date(order?.order_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-lg text-primary">${order.order_items.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
                {/* <span className="font-bold text-lg text-primary">${order.amount.toFixed(2)}</span> */}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{item.menu_item}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.quantity}x</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select value={CurrentStatus} onValueChange={setCurrentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {orderStatus === "preparing" && (
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="15"
                  />
                </div>
              )}

              <Button className="w-full"
                onClick={StatusUpdate}>
                <Clock className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface MenuItemPopupProps {
  trigger: React.ReactNode;
  isEdit?: boolean;
  item?: any;
}

export const MenuItemPopup = ({ trigger, isEdit = false, item }: MenuItemPopupProps) => {
  const [itemName, setItemName] = useState(item?.name || "");
  const [itemPrice, setItemPrice] = useState(item?.price || "");
  const [itemCategory, setItemCategory] = useState(item?.category || "");
  const [itemDescription, setItemDescription] = useState(item?.description || "");

  const categories = [
    "Appetizers",
    "Main Courses",
    "Desserts",
    "Beverages",
    "Light Meals",
    "Specials"
  ];

  const handleSave = () => {
    console.log("Saving menu item:", {
      name: itemName,
      price: itemPrice,
      category: itemCategory,
      description: itemDescription
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-primary" />
            <span>{isEdit ? "Edit" : "Add"} Menu Item</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Price ($)</Label>
              <Input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={itemCategory} onValueChange={setItemCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Describe the item..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1">
              {isEdit ? "Update Item" : "Add Item"}
            </Button>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};