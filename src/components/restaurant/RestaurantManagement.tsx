   import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Users, Plus, Search, Settings2, Clock, UtensilsCrossed, Image, XCircle, ChefHat, HandCoins, Armchair, ListCheck, BadgeCheck, Utensils, CalendarCheck, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RestaurantOrder } from "./RestaurantOrder";
import { TableBooking } from "./TableBooking";
import { TableDetailsPopup, OrderDetailsPopup } from "./RestaurantPopups";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { text } from "stream/consumers";
import { Textarea } from "../ui/textarea";
import { log, table } from "console";
import { set } from "date-fns";
import Spinner from "../ui/Spinner";

interface Table {
  id: string;
  last_status_time: string;
  table_code: string;
  slug: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  reservation?: string | null;
  x: number;
  y: number;
  number?: number;
  hotel?: string;

}



interface Order {
  id: string;
  table_code: string;
  items: string[];
  amount: number;
  status: "Ordered" | "Preparing" | "Ready" | "Served";
  time: string;
  slug: string;
  order_code: string;
  order_time: string;
  order_items: { menu_item: string; quantity: number; price: number }[];
  guest_name: string;
  guest_phone: string;
  hotel: string;
  remarks: string;
  total_quantity: number;
  subtotal: string;
  sgst: string;
  cgst: string;
  grand_total: string;
}

export const RestaurantManagement = ({ viewingRestaurantSlug }) => {
   const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin =
  user?.role &&
  ["admin", "ADMIN", "Admin", "superadmin", "hotel_admin"].includes(user.role);
   const username = JSON.parse(localStorage.getItem('user'));
   const [restaurants, setRestaurants] = useState([]);
const [selectedRestaurant, setSelectedRestaurant] = useState(null);
useEffect(() => {
  const slug = viewingRestaurantSlug || username?.restaurant_slug;

  if (!slug) return;

  fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${slug}/`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
    .then(res => res.json())
    .then(data => setSelectedRestaurant(data))
    .catch(err => console.log("Restaurant fetch error", err));
}, [viewingRestaurantSlug, username?.restaurant_slug]);


  const [tableloader, setTableLoader] = useState(false);
  const [ordersList, setOrdersList] = useState<{ date: string; total_orders: number; orders: Order[] }>({
    date: "",
    total_orders: 0,
    orders: [],
  });

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState("tables");
  const accessToken = localStorage.getItem('accessToken'); // get token from localStorage
  const [getMenuCategories, setGetMenuCategories] = useState([]);

  const [tables, setTables] = useState<Table[]>([

  ]);
  const [hotel_Slug, setHotel_Slug] = useState('');

  const [is_Edit, setIs_Edit] = useState(false)


  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-cyan-200 text-cyan-900 border-cyan-400 hover:bg-cyan-300";
      case "occupied":
        return "bg-fuchsia-200 text-fuchsia-900 border-fuchsia-400 hover:bg-fuchsia-300";
      case "reserved":
        return "bg-amber-200 text-amber-900 border-amber-400 hover:bg-amber-300";
      case "cleaning":
        return "bg-slate-200 text-slate-900 border-slate-400 hover:bg-slate-300";
      case "preparing":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "served":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ready":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ordered":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const statusOptions = [

    { value: "pending", label: "pending", color: "bg-amber-400 text-amber-900 border-amber-600 hover:bg-amber-500" },
    { value: "preparing", label: "preparing", color: "bg-orange-400 text-orange-900 border-orange-600 hover:bg-orange-500" },
    { value: "served", label: "served", color: "bg-blue-600 text-white border-blue-800 hover:bg-blue-700" },
    { value: "completed", label: "completed", color: "bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-600" },
    { value: "cancelled", label: "cancelled", color: "bg-slate-400 text-slate-900 border-slate-600 hover:bg-slate-500" },
  ];

  const statusoption = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-300 text-gray-800 border-gray-400";
  };

  const [orderBoxes, setOrderBoxes] = useState([{ menu_item: "", qty: 0 }]);


  // Select dropdown change handle
  const handleMenuChange = (index, value) => {
    setOrderBoxes((prev) =>
      prev.map((box, i) => {
        if (i !== index) return box;

        // agar value select hua aur qty 0 thi to 1 kar do
        if (value && box.qty === 0) {
          return { ...box, menu_item: value, qty: 1 };
        }

        // agar value clear kar di gayi (null/empty) to qty 0 kar do
        if (!value) {
          return { ...box, menu_item: "", qty: 0 };
        }

        return { ...box, menu_item: value };
      })
    );
  };


  const handleQtyChange = (index, type) => {
    setOrderBoxes((prev) => {
      const updated = [...prev];
      const box = updated[index];

      if (type === "inc") {
        // agar koi menu item select hai tabhi badhe
        if (box.menu_item) {
          updated[index] = { ...box, qty: box.qty + 1 };
        }
      } else {
        // qty decrease
        const newQty = Math.max(0, box.qty - 1);

        if (newQty === 0) {

          updated[index] = { menu_item: "", qty: 0 };
        } else {
          updated[index] = { ...box, qty: newQty };
        }
      }

      return updated;
    });
  };

  // Naya item add karna
  const handleAddItem = () => {
    setOrderBoxes((prev) => [...prev, { menu_item: "", qty: 0 }]);
  };
  const [showAddCategory, setShowAddCategory] = useState(false);

const [newCategory, setNewCategory] = useState({
  name: "",
  description: "",
});


  // Optional: koi item remove karna ho
  const handleRemoveItem = (index) => {
    setOrderBoxes((prev) => {
      if (prev.length === 1) return [{ menu_item: "", qty: 0 }];
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    if (orderBoxes.length > 0) {
      const allFilled = orderBoxes.every(
        (box) => box.menu_item && box.qty > 0
      );
      if (allFilled) {
        setOrderBoxes((prev) => [...prev, { menu_item: "", qty: 0 }]);
      }
    }
  }, [orderBoxes]);



  const [newMenu, setNewMenu] = useState({
    id: "",
    name: "",
    price: "",
    category: "",
    is_available: "true",
    hotel: "Ocean View Resort",
    description: "",
    image: null,
    file: null,
  });

  const tableStats = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  };
  const [CurrentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
   const [newTable, setNewTable] = useState({
  number: "",
  capacity: "",
  status: "available",
});

  const [isVip, setIsVip] = useState(false);

  //-----------Prefiiling Previous Order if exists for table --------------------------------------------------------------

  const FilterCurrentOrder = (chair) => {
    const filteredOrders = ordersList?.orders?.filter(order => order.table_code === chair) || [];
    console.log("Filtered Orders for table", chair, ":", filteredOrders);

    const activeorders = filteredOrders.filter(
      (order) => order.status !== "Ready" && order.status !== "Served"
    );

    if (activeorders.length > 0) {
      const order = activeorders[0];
      console.log(`${chair} Active Order Found:`, order.order_items);
      SetTotal_Order({
        guest_name: order.guest_name || "",
        guest_phone: order.guest_phone || "",
        hotel: order.hotel || "",
        remarks: order.remarks || "",
        order_items: order?.order_items.map((item) => ({
          menu_item: item.menu_item,
          quantity: item.quantity,
          price: String(item.price),
        })) || [{
          menu_item: "",
          quantity: 0,
          price: "",
        }],
        total_quantity: order.total_quantity || 0,
        subtotal: order.subtotal || "",
        sgst: order.sgst || "",
        cgst: order.cgst || "",
        grand_total: order.grand_total || ""
      });

      setOrderBoxes(
        order.order_items.map((item) => ({
          menu_item: item.menu_item,
          qty: item.quantity,

        })
        )
      )
    } else {
      // 4. blank form if no active order
      SetTotal_Order({
        guest_name: "",
        guest_phone: "",
        hotel: "",
        remarks: "",
        order_items: [{
          menu_item: "",
          quantity: 0,
          price: ""
        }],
        total_quantity: 0,
        subtotal: "",
        sgst: "",
        cgst: "",
        grand_total: ""
      });
    }

    setActiveOrders(activeorders);
    console.log("Active Orders for table", chair, ":", activeorders);

  }

  //---------------------------------------- Editing Table ------------------------------------------------------------------

  const filling = (fill) => {
    setNewTable({
      ...newTable,
      capacity: fill.capacity,
      number: fill.number,
      status: fill.status,
      slug: fill.slug,
      table_code: fill.table_code
    })
    console.log(fill)
    setIs_Edit(true)
    setShowAddTable(true);
  }

  useEffect(() => {
    if (!showAddTable) {
      setNewTable({
        id: "",
        table_code: "",
        capacity: 2,
        status: "available",
        reservation: null,
        slug: "",
        x: 0,
        y: 0,
        number: undefined,
        hotel: hotel_Slug,
        last_status_time: "",
      });
    }
  }, [showAddTable, hotel_Slug])

  //----------------------------------- Update Order ----------------------------------------------------------------------

  const updateOrder = async (e) => {
    e.preventDefault();

    const totalQuantity = orderBoxes.reduce(
      (sum, box) => sum + (Number(box.qty) || 0),
      0
    );

    // Order items payload
    const orderItems = orderBoxes
      .filter(box => box.menu_item && box.qty > 0)
      .map(box => {
        const matchedMenu = hotelMenus.find(menu => menu.slug === box.menu_item);
        const price = matchedMenu?.price ? Number(matchedMenu.price) : 0;
        const quantity = box.qty || 0;

        return {
          menu_item: box.menu_item,
          quantity: quantity,
          price: String(price),
        };
      });

    // Final payload
    const finalPayload = {
      ...Total_Order,
      table: reserveTable.slug,
      hotel: reserveTable.hotel,
      subtotal: String(subtotal.toFixed(2)),
      sgst: String(sgst.toFixed(2)),
      cgst: String(cgst.toFixed(2)),
      grand_total: String(grandTotal.toFixed(2)),
      total_quantity: totalQuantity,
      order_items: orderItems,
    };

    console.log("Reserve Payload:", finalPayload);



    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurant-orders/${activeOrders[0].slug}/`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(finalPayload),
      });

      const data = await response.json();

        if (response.ok) {
          // alert("order updated successfully!");
          toast({
            title: "Order Updated",
            description: "Changes saved",
            className: "bg-emerald-600 text-white border-none"
          });
          SetTotal_Order({
            guest_name: "",
            guest_phone: "",
            hotel: "",
            remarks: "",
            order_items: [{
              menu_item: "",
              quantity: 0,
              price: ""
            }],
            total_quantity: 0,
            subtotal: "",
            sgst: "",
            cgst: "",
            grand_total: ""
          })




        } else {
          throw new Error(`Failed to update order: ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.error("Error updating order:", error);
      }
      setReserveTable(null);
      fetchOrders();

    }

  //----------------------------------- Fetch Orders ----------------------------------------------------------------------

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurant-orders/today`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setOrdersList(data);
      if (!response.ok) {
        throw new Error(`Failed to get orders: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting orders:", error);
    }
  }, [accessToken]);

  useEffect(() => {

    fetchOrders();
  }, [accessToken, activeTab, fetchOrders])

  //------------------ Adding Table -------------------------------------------------------------------------

  const addTable = async (e) => {
    e.preventDefault();
    if (tableloader) return;
    setTableLoader(true);

    const updatedTable = {
      ...newTable,
      number: newTable?.number,
      status: newTable.status.toLowerCase(),
    };

    const mymethod = is_Edit ? 'PUT' : 'POST';
    console.log(updatedTable)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/tables/${is_Edit ? updatedTable.slug + "/" : ""}`, {
          method: mymethod,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedTable),
        });

        const data = await response.json();


        if (response.ok) {
          toast({
            title: `Table ${is_Edit ? 'Edited' : 'Added'}`,
            description: "Table added successfully",
            className: "bg-emerald-500 text-white border-none"
          });

          newTable.id = "";
          newTable.capacity = undefined;
          newTable.reservation = null;
          newTable.number = undefined;
          getTable();


        } else {
          const errorMessages = Object.values(data)
            .flat()
            .join(" ");

          toast({
            title: "Error Occurred",
            description: errorMessages || "Something went wrong. Please try again.",
            variant: "destructive",
            className: "border-none"
          });

        }
      } catch (error) {
        console.error("Error adding table:", error);
      }
      finally {
        setTableLoader(false);
        setShowAddTable(!showAddTable);

      }
    }

  //------------------ Fetch Menu Categories -------------------------------------------------------------------------

  const getMenuItemsCategories = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/menu-categories/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setGetMenuCategories(data);
      } else {
        throw new Error(`Failed to get menu items: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting menu items:", error);
    }
  }, [accessToken]);

  //------------------ Adding Menu Item -------------------------------------------------------------------------

  const addMenu = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newMenu.name);
      formData.append("price", newMenu.price);
      formData.append("category", newMenu.category || "");
      formData.append("is_available", newMenu.is_available);
      formData.append("hotel", newMenu.hotel);
      formData.append("description", newMenu.description);

      if (newMenu.file) {
        formData.append("image", newMenu.file); // 👈 File objecHt, not image URL
      }


      console.log("🧾 FormData content:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/menu-items/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ sirf token header me rakhna hai
          },
          body: formData,
        }
      );

      const data = await response.json();

        if (response.ok) {
          toast({
            title: "Menu Item Added",
            description: "New item created",
            className: "bg-sky-500 text-white border-none"
          });

          setShowAddMenu(false);
          setNewMenu({
            id: "",
            name: "",
            price: "",
            category: "",
            is_available: "true",
            hotel: "Ocean View Resort",
            description: "",
            image: null,
            file: null,
          });
        } else {
          throw new Error(
            `Failed to add menu item: ${data.message || JSON.stringify(data)}`
          );
        }
      } catch (error) {
        console.error("Error adding menu item:", error);
      }
    };

    const getHotelMenu = useCallback(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/menu-items/`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setHotelMenus(data);

        } else {
          throw new Error(`Failed to get menu items: ${await response.text()}`);
        }
      } catch (error) {
        console.error("Error getting menu items:", error);
      }
    }, [accessToken]);
  const [restaurantDetails, setRestaurantDetails] = useState<{ name: string; location: string } | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const slug = viewingRestaurantSlug || username?.restaurant_slug;
      if (slug) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${slug}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setRestaurantDetails(data);
          }
        } catch (error) {
          console.error("Error fetching restaurant details:", error);
        }
      }
    };
    fetchRestaurantDetails();
  }, [viewingRestaurantSlug, username?.hotel_slug, accessToken]);

  const isUser = username?.role === 'user';


   const createMenuCategory = async (e) => {
  e.preventDefault();

  if (!selectedRestaurant) {
    toast({
      title: "Restaurant Missing",
      description: "Restaurant not loaded",
      variant: "destructive",
    });
    return;
  }

  const payload = {
    name: newCategory.name,
    description: newCategory.description,
    restaurant: selectedRestaurant.slug,   // 🔥 REQUIRED FIX
  };

  console.log("CATEGORY PAYLOAD:", payload);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/menu-categories/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(JSON.stringify(data));

    toast({
      title: "Category Created",
      description: "Menu category added successfully",
      className: "bg-emerald-600 text-white border-none",
    });

    setShowAddCategory(false);
    setNewCategory({ name: "", description: "" });
    getMenuItemsCategories();   // refresh dropdown

  } catch (error) {
    console.error("Create category error:", error.message);
  }
};


  //------------------ Reserve Table & Submit Order -------------------------------------------------------------------------

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveTable) return;

    const totalQuantity = orderBoxes.reduce(
      (sum, box) => sum + (Number(box.qty) || 0),
      0
    );

    const orderItems = orderBoxes
      .filter(box => box.menu_item && box.qty > 0)
      .map(box => {
        const matchedMenu = hotelMenus.find(menu => menu.slug === box.menu_item);
        const price = matchedMenu?.price ? Number(matchedMenu.price) : 0;
        const quantity = box.qty || 0;

        return {
          menu_item: box.menu_item,
          quantity: quantity,
          price: String(price),
        };
      });

    const finalPayload = {
      ...Total_Order,
      table: reserveTable.slug,
      hotel: reserveTable.hotel,
      subtotal: String(subtotal.toFixed(2)),
      sgst: String(sgst.toFixed(2)),
      cgst: String(cgst.toFixed(2)),
      grand_total: String(grandTotal.toFixed(2)),
      total_quantity: totalQuantity,
      order_items: orderItems,
    };

    console.log("Reserve Payload:", finalPayload);
    PostOrder(finalPayload)
  };


  //------------------ Fetch Tables -------------------------------------------------------------------------

  const getTable = useCallback(async () => {
    setHotel_Slug(username.hotel_slug)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/tables/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {

        setTables(data);
        // setTables((prev) => [...prev, ...data])
      } else {
        throw new Error(`Failed to get tables: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting tables:", error);
    }
  }, [accessToken, username.hotel_slug]);

  useEffect(() => {
    getTable();
    getMenuItemsCategories();
    getHotelMenu();


    const intervalId = setInterval(() => {
      getTable();
      getMenuItemsCategories();
      getHotelMenu();
    }, 30000); // 6000 ms = 6 seconds

    return () => clearInterval(intervalId);
  }, [getTable, getMenuItemsCategories, getHotelMenu]);


  useEffect(() => {
    if (hotel_Slug) {
      setNewTable(prev => ({ ...prev, hotel: hotel_Slug }));
    }
  }, [hotel_Slug]);

  const [reserveTable, setReserveTable] = useState<Table | null>(null);


  const [Total_Order, SetTotal_Order] = useState({
    guest_name: "",
    guest_phone: "",
    hotel: "",
    remarks: "",
    order_items: [{
      menu_item: "",
      quantity: 0,
      price: ""
    }],
    total_quantity: 0,
    subtotal: "",
    sgst: "",
    cgst: "",
    grand_total: ""
  })
  const [hotelMenus, setHotelMenus] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null)

  useEffect(() => {
    if (reserveTable === null) {
      setOrderBoxes([
        { menu_item: "", qty: 0 },

      ])
      SetTotal_Order(
        {
          guest_name: "",
          guest_phone: "",
          hotel: "",
          remarks: "",
          order_items: [{
            menu_item: "",
            quantity: 0,
            price: ""
          }],
          total_quantity: 0,
          subtotal: "",
          sgst: "",
          cgst: "",
          grand_total: ""
        }
      )
    }

  }, [reserveTable])


     




  // //------------------ Fetch Dashboard Summary -------------------------------------------------------------------------

  const handleDashboard = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/dashboard/dashboard-summary/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await response.json();
     console.log("Dashboard Summary:", data);
      if (response.ok) {
        setDashboardSummary(data)
      } else {
        throw new Error(`Failed to get dashboard summary: ${await response.text()}`);
      }

    }
    catch (error) {
      console.log(error);
    }
  }, [accessToken]);

  useEffect(() => {
    handleDashboard();
  }, [handleDashboard]);

  //------------------ Post Order -------------------------------------------------------------------------
  const PostOrder = async () => {
  try {
    if (!selectedRestaurant) {
      toast({ title: "Restaurant missing", variant: "destructive" });
      return;
    }

    const payload = {
      restaurant: selectedRestaurant.slug,          // REQUIRED
      table: reserveTable?.slug || null,
      guest_name: Total_Order.guest_name,
      guest_phone: Total_Order.guest_phone,
      remarks: Total_Order.remarks,
      status: "pending",

      order_items: orderBoxes
        .filter(i => i.menu_item && i.qty > 0)
        .map(i => {
          const menu = hotelMenus.find(m => m.slug === i.menu_item);
          return {
            menu_item: i.menu_item,                 // slug string
            quantity: Number(i.qty),
            price: Number(menu?.price || 0)         // REQUIRED number
          };
        })
    };

    console.log("FINAL PAYLOAD:", payload);

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurant-orders/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));

    toast({ title: "Order Created Successfully" });

    setOrderBoxes([{ menu_item: "", qty: 0 }]);
    setReserveTable(null);
    fetchOrders();
    getTable();
    handleDashboard();

  } catch (error) {
    console.error("Order create error:", error.message);
  }
};



  //------------------ Update Order Status -------------------------------------------------------------------------

     const StatusUpdate = async (orderToUpdate) => {
  const payload = {
    restaurant: orderToUpdate.restaurant, // REQUIRED
    status: orderToUpdate.status,
    guest_name: orderToUpdate.guest_name || "Walk-in Guest",
    guest_phone: orderToUpdate.guest_phone || "9999999999",
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurant-orders/${orderToUpdate.slug}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Order update failed");
    }

    fetchOrders();
    setCurrentOrder(null);

    toast({
      title: "Order Updated",
      description: "Changes saved",
      className: "bg-emerald-600 text-white border-none",
    });

  } catch (error) {
    console.error("Error updating order:", error);
  }
};



  useEffect(() => {
    console.log("Order Boxes changed:", orderBoxes);
  }, [orderBoxes])

  const subtotal = orderBoxes.reduce((sum, box) => {
    if (!box.menu_item) return sum;
    const matchedMenu = hotelMenus.find((menu) => menu.slug === box.menu_item);
    const price = matchedMenu?.price ? Number(matchedMenu.price) : 0;
    const quantity = box.qty || 0;
    return sum + price * quantity;
  }, 0);


  const sgst = subtotal * 0.025;
  const cgst = subtotal * 0.025;
  const grandTotal = subtotal + sgst + cgst;

  const [showItemsModal, setShowItemsModal] = useState(null);

  const currentOrder = ordersList?.orders?.find(
    (order) => order.slug === showItemsModal
  );


  const handleCloseModal = () => setShowItemsModal(null);


  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Restaurant Management
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Advanced restaurant operations & analytics
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-2 flex-wrap ">
           {isAdmin && (
    <> 
          <Button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2 sm:w-auto whitespace-nowrap"
            onClick={() => setShowAddTable(true)}
          >
            <Plus className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
            Add Table
          </Button>         


          <Button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2 sm:w-auto whitespace-nowrap"
            onClick={() => setShowAddMenu(true)}
          >
            <UtensilsCrossed className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
            Add Menu
          </Button>
          <Button
               className="bg-gradient-to-r from-primary to-accent text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2"
             onClick={() => setShowAddCategory(true)}
          >
             <Plus className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
               Add Category
          </Button>
        </>
  )}
  <Button
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-[10px] px-1 py-0.5 sm:text-sm sm:px-4 sm:py-2 sm:w-auto whitespace-nowrap"
            onClick={() => setActiveTab("booking")}
          >
            <Plus className="w-2 h-2 mr-0.5 sm:w-4 sm:h-4 sm:mr-2" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Add Table Dialog */}
      <Dialog open={showAddTable} onOpenChange={setShowAddTable}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <form onSubmit={addTable} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="vip"
                type="checkbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
              />
              <Label htmlFor="vip" className="cursor-pointer">
                VIP Table <span className="text-amber-500">★</span>
              </Label>
            </div>
            <div>
              <Label htmlFor="tableNo">Table No.</Label>
               <Input
  placeholder="Table Number (eg: AP11)"
  value={newTable.number}
  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
/>

 

            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
  type="number"
  placeholder="Capacity"
  value={newTable.capacity}
  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
/>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full border rounded px-2 py-1"
                value={newTable.status}
                onChange={(e) =>
                  setNewTable((t) => ({
                    ...t,
                    status: e.target.value as Table["status"],
                  }))
                }
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit">
                {tableloader ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Adding...</span>
                  </>
                ) : (
                  "Add Table"
                )}
              </Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/*show add menu dialog*/}
      <Dialog open={showAddMenu} onOpenChange={setShowAddMenu}>
        <DialogContent className="max-w-full sm:max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={addMenu} className="space-y-4">
            {/* 1. ID */}
            <div>
              <Label htmlFor="id">Item ID</Label>
              <Input
                id="id"
                value={newMenu.id}
                onChange={(e) => setNewMenu(m => ({ ...m, id: e.target.value }))}
                required
                placeholder="e.g. M101"
              />
            </div>

            {/* 2. Name */}
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={newMenu.name}
                onChange={(e) => setNewMenu(m => ({ ...m, name: e.target.value }))}
                required
                placeholder="e.g. Paneer Butter Masala"
              />
            </div>

            {/* 3. Price */}
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newMenu.price}
                onChange={(e) => setNewMenu(m => ({ ...m, price: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full border rounded px-2 py-2"
                  value={newMenu.category}
                  onChange={(e) => setNewMenu(m => ({ ...m, category: e.target.value }))}
                  required
                >
                
                  <option value="" disabled>
                    Select an Option
                  </option>
                  {getMenuCategories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                   
                </select>
              </div>


            </div>


            <div className="space-y-2">
              <Label>Item Image</Label>

              {/* Responsive layout */}
              <div className="flex flex-wrap items-start gap-3">
                <Input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setNewMenu((m) => ({
                        ...m,
                        image: imageUrl,
                        file: file,
                      }));
                    }
                  }}

                />

                <label
                  htmlFor="image-upload"
                  className="flex-shrink-0 flex items-center justify-center border rounded-lg h-10 px-2 sm:px-4 cursor-pointer text-sm font-medium hover:bg-gray-50 w-28 sm:w-auto"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Choose
                </label>

                {/* Image Preview */}
                {newMenu.image && (
                  <div className="relative flex-1 min-w-[150px] sm:min-w-[180px] sm:max-w-[50%]">


                    <div className="w-full h-[130px] sm:h-[120px] rounded-lg overflow-hidden border">
                      <img
                        src={newMenu.image}
                        alt="Item Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md z-10"
                      onClick={() => {
                        setNewMenu((m) => ({ ...m, image: null, file: null }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <XCircle />
                    </button>
                  </div>
                )}
              </div>
            </div>


            {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full border rounded px-2 py-1 min-h-[80px]"
                  value={newMenu.description}
                  onChange={(e) => setNewMenu(m => ({ ...m, description: e.target.value }))}
                  placeholder="A short description of the menu item..."
                  required
                />
              </div>

            <DialogFooter>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Add Menu Category</DialogTitle>
    </DialogHeader>

    <form onSubmit={createMenuCategory} className="space-y-4">
      <div>
        <Label>Category Name</Label>
        <Input
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory((c) => ({ ...c, name: e.target.value }))
          }
          required
          placeholder="e.g. Starters, Desserts"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory((c) => ({ ...c, description: e.target.value }))
          }
          placeholder="Optional description"
        />
      </div>

      <DialogFooter>
        <Button type="submit">Create Category</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>



      <Dialog
        open={!!reserveTable}
        onOpenChange={(open) => {
          if (!open) setReserveTable(null);
        }}
      >
        <DialogContent className="sm:max-w-md p-3">
          <DialogHeader>
            <DialogTitle>
              Take Order {`for ${reserveTable?.table_code}`}
            </DialogTitle>
          </DialogHeader>
          {/* Table Add form */}
          <form
            onSubmit={(e) =>
              (!activeOrders || activeOrders.length === 0)
                ? handleReserve(e)
                : updateOrder(e)
            }
            className="space-y-2 text-sm"
          >

            <div>
              <Label htmlFor="reserveName">Guest Name</Label>
              <Input
                id="guest_name"
                value={Total_Order.guest_name}
                onChange={(e) =>
                  SetTotal_Order((prev) => ({
                    ...prev,
                    guest_name: e.target.value,
                  }))
                }
                required
                className="h-8 text-sm disabled:cursor-default disabled:pointer-events-none"
                disabled={
                  Array.isArray(activeOrders) &&
                  activeOrders[0] &&
                  ["served", "completed", "cancelled"].includes(activeOrders[0].status)
                }
              />
            </div>

            <div>
              <Label htmlFor="reserveNumber">Phone Number</Label>
              <Input
                id="guest_phone"
                type="number"
                min={0}
                inputMode="numeric"
                pattern="[0-9]*"
                value={Total_Order.guest_phone}
                onChange={(e) =>
                  SetTotal_Order((prev) => ({
                    ...prev,
                    guest_phone: e.target.value.toString(),
                  }))
                }
                required
                className="h-8 text-sm 
      [appearance:textfield] 
      [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none 
      [-moz-appearance:textfield]
      disabled:cursor-default disabled:pointer-events-none"
                disabled={
                  Array.isArray(activeOrders) &&
                  activeOrders[0] &&
                  ["served", "completed", "cancelled"].includes(activeOrders[0].status)
                }
              />
            </div>



            {/* Scrollable list container */}
            <div
              className={`space-y-2 ${orderBoxes.length > 3 ? "max-h-32 overflow-y-auto pr-1" : ""
                }`}
            >
              {orderBoxes.map((box, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  {/* Dropdown */}
                  <select
                    className="flex-1 border rounded px-1 py-1 text-xs"
                    value={box.menu_item}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrderBoxes((prev) => {
                        const copy = [...prev];
                        if (val && copy[idx].qty === 0) {
                          copy[idx] = { ...copy[idx], menu_item: val, qty: 1 };
                        } else if (!val) {
                          copy[idx] = { menu_item: "", qty: 0 };
                        } else {
                          copy[idx] = { ...copy[idx], menu_item: val };
                        }
                        return copy;
                      });
                    }}
                  >
                    <option value="">Select Item</option>
                    {hotelMenus.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {/* Price Box */}
                  <div className="w-20 text-center border rounded bg-gray-50 px-1 py-1 font-semibold text-gray-700 text-xs">
                    {(() => {
                      const selectedItem = hotelMenus.find(
                        (menu) => menu.slug === box.menu_item
                      );
                      if (!selectedItem) return "--";
                      const unitPrice = Number(selectedItem.price) || 0;
                      return `₹${(unitPrice * (box.qty || 0)).toFixed(2)}`;
                    })()}
                  </div>

                  {/* + - counter */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!box.menu_item}
                      onClick={() =>
                        setOrderBoxes((prev) => {
                          const copy = [...prev];
                          const newQty = Math.max(0, (copy[idx].qty || 0) - 1);
                          if (newQty === 0) {
                            copy[idx] = { menu_item: "", qty: 0 };
                          } else {
                            copy[idx].qty = newQty;
                          }
                          return copy;
                        })
                      }
                      className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                    >
                      -
                    </Button>

                    <span className="w-5 text-center">{box.qty || 0}</span>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!box.menu_item}
                      onClick={() =>
                        setOrderBoxes((prev) => {
                          const copy = [...prev];
                          copy[idx].qty = (copy[idx].qty || 0) + 1;
                          return copy;
                        })
                      }
                      className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Remarks */}
            <Label htmlFor="reservecomments">Remarks</Label>
            <Textarea
              id="remarks"
              value={Total_Order.remarks}
              onChange={(e) => SetTotal_Order(prev => ({
                ...prev,
                remarks: e.target.value
              }))
              }
              placeholder="Any special requests or notes"
              className="text-xs h-16"
            />

            {/* Total Quantity & Amount (single line) */}
            <div className="flex justify-between items-center font-semibold text-xs mt-1">
              <span>
                Total Quantity:{" "}
                {orderBoxes.reduce((sum, box) => sum + (box.qty || 0), 0)}
              </span>
              <span>
                Subtotal: ₹{subtotal}
              </span>
            </div>
            <div className="flex justify-between items-center font-semibold text-xs">
              <span>SGST (2.5%)</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-xs">
              <span>CGST (2.5%)</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-xs text-primary mt-1 border-t pt-1">
              <span>Grand Total (with GST)</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <DialogFooter>
              <Button type="submit" className="h-8 text-xs px-3">Submit</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setReserveTable(null)}
                className="h-8 text-xs px-3"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Enhanced Stats Dashboard */}
       {isAdmin && (
    <> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-full">
                <Armchair className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">
                {dashboardSummary?.available_tables}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-green-600">Available Tables</p>
              <p className="text-green-500">Ready to seat</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary/10 rounded-full">
                <ListCheck className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">
                {dashboardSummary?.active_orders}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-primary">Active Orders</p>
              <p className="text-primary/70">In kitchen queue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-100 rounded-full">
                <HandCoins className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-700">₹{dashboardSummary?.todays_revenue}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-amber-600">Today's Revenue</p>
              <p className="text-amber-500">+12% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-700">{dashboardSummary?.avg_wait_time}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-orange-600">Avg Wait Time</p>
              <p className="text-orange-500">Excellent service</p>
            </div>
          </CardContent>
        </Card>
      </div>
</>
       )}
      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 md:p-6">
          <CardContent className="space-y-2 md:space-y-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm md:text-base">Occupied Tables</p>
                <p className="text-xl md:text-2xl font-bold">{tableStats.occupied}</p>
              </div>
              <Users className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground/80" />

            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-400 to-orange-400 text-white p-4 md:p-6">
          <CardContent className="space-y-2 md:space-y-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm md:text-base">Reserved Tables</p>
                <p className="text-xl md:text-2xl font-bold">{tableStats.reserved}</p>
              </div>
              <BadgeCheck className="w-6 h-6 md:w-7 md:h-7 text-white/80" />

            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-slate-400 to-slate-500 text-white p-4 md:p-6">
          <CardContent className="space-y-2 md:space-y-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm md:text-base">Cleaning</p>
                <p className="text-xl md:text-2xl font-bold">{tableStats.cleaning}</p>
              </div>
              <Settings2 className="w-6 h-6 md:w-7 md:h-7 text-white/80" />

            </div>
          </CardContent>
        </Card>
      </div>


      <div
        className="
    flex flex-wrap sm:flex-nowrap 
    justify-between sm:justify-start
    gap-1 sm:gap-2
    bg-secondary/50 p-1 rounded-xl 
    w-full sm:w-fit 
    backdrop-blur-sm border
  "
      >
        <Button
          variant={activeTab === "tables" ? "default" : "ghost"}
          className={`
      flex-1 sm:flex-none 
      text-[10px] sm:text-sm 
      h-7 sm:h-10 px-1 sm:px-3
      ${activeTab === "tables"
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-primary/10"}
    `}
          onClick={() => setActiveTab("tables")}
        >
          <Armchair className="w-2.5 h-2.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Tables
        </Button>

        <Button
          variant={activeTab === "orders" ? "default" : "ghost"}
          className={`
      flex-1 sm:flex-none 
      text-[10px] sm:text-sm 
      h-7 sm:h-10 px-1 sm:px-3
      ${activeTab === "orders"
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-primary/10"}
    `}
          onClick={() => setActiveTab("orders")}
        >
          <Utensils className="w-2.5 h-2.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Orders
        </Button>

        <Button
          variant={activeTab === "pos" ? "default" : "ghost"}
          className={`
      flex-1 sm:flex-none 
      text-[10px] sm:text-sm 
      h-7 sm:h-10 px-1 sm:px-3
      ${activeTab === "pos"
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-primary/10"}
    `}
          onClick={() => setActiveTab("pos")}
        >
          <Settings2 className="w-2.5 h-2.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          POS
        </Button>

        <Button
          variant={activeTab === "booking" ? "default" : "ghost"}
          className={`
      flex-1 sm:flex-none 
      text-[10px] sm:text-sm 
      h-7 sm:h-10 px-1 sm:px-3
      ${activeTab === "booking"
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-primary/10"}
    `}
          onClick={() => setActiveTab("booking")}
        >
          <CalendarCheck className="w-2.5 h-2.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Reserve
        </Button>
      </div>

      {/* </div> */}

      {/* Content */}
      {activeTab === "tables" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Restaurant Floor Plan</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search tables..." className="pl-9 w-full" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Enhanced Visual Floor Plan */}
            <div className="relative bg-gradient-to-br from-secondary/20 to-primary/5 rounded-xl p-2 sm:p-6 h-auto sm:h-80 mb-6 overflow-hidden border">

              {/* Tables Grid */}
              <div className="w-fit grid grid-cols-4 lg:grid-cols-10 gap-x-2 gap-y-4 mt-2 lg:mt-0 justify-start">
                {tables.map((table, i) => (
                  <div
                    key={table.id}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 hover:shadow-lg ${getStatusColor(
                      table.status
                    )}`}
                    onClick={() => {
                      setReserveTable(table);
                      FilterCurrentOrder(table.table_code);
                    }}
                  >
                    <span className="text-xs font-bold">{table.table_code}</span>
                    <span className="text-xs">{table.capacity}p</span>
                    {table.id.includes("VIP") && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">★</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Status Legend */}
              <div className="mt-4 lg:absolute lg:bottom-4 lg:right-4 bg-card p-4 rounded-lg border shadow-sm">
                <p className="text-xs font-medium mb-2">Status Legend</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-200 rounded border border-cyan-400"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-fuchsia-200 rounded border border-fuchsia-400"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-200 rounded border border-amber-400"></div>
                    <span>Reserved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-200 rounded border border-slate-400"></div>
                    <span>Cleaning</span>
                  </div>
                </div>
              </div>

            </div>


            {/* Table Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table, i) => {
                const isAvailable = table.status === "available";
                return (
                  <div
                    key={i}
                    className="relative p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all group overflow-visible"
                  >
                    {table.status !== 'available' && (
                        
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          filling(table);
                        }}
                        className="
    absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground
    shadow-xl flex items-center justify-center z-20 border-4 border-background
    /* Default (mobile): visible */
    opacity-100 scale-100 blur-0 translate-x-0 translate-y-0

    /* Desktop hover effect */
    md:opacity-0 md:scale-75 md:blur-sm md:translate-x-5 md:-translate-y-5
    md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:blur-0
    md:group-hover:translate-x-0 md:group-hover:translate-y-0

    transition-all duration-400 ease-out
  "
                        title="Edit Table"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
    
                    )}


                    {/* Baaki sab bilkul same */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl text-primary">{table.table_code}</h3>
                        {table.id.includes("VIP") && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">VIP</Badge>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(table.status)} border font-medium`}>
                        {table.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Capacity: <span className="font-semibold text-foreground">{table.capacity} guests</span>
                      </p>
                      {table.reservation && (
                        <p className="text-sm text-muted-foreground">
                          Reserved for: <span className="font-semibold text-foreground">{table.reservation}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Last updated: {table.last_status_time}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex space-x-2">
                      <TableDetailsPopup
                        table={table}
                        trigger={
                          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                            {isAvailable ? "Quick Reserve" : "View Details"}
                          </Button>
                        }
                      />
                      {isAvailable && (
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReserveTable(table);
                          }}
                        >
                          <ChefHat className="w-4 h-4 mr-2" />
                          Take Order
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </CardContent>
        </Card>
      )}


      {activeTab === "orders" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              <span>Active Orders</span>
              <Badge variant="outline">{ordersList?.orders?.length} orders</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordersList?.orders?.map((order) => (
                <div
                  key={order.slug}
                  className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer relative"
                >

                  {/* Status Badge (Mobile: Top Right Corner) */}
                  <Badge
                    className={`text-xs sm:text-sm absolute top-2 right-2 sm:hidden ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>

                  {/* ------------------ RESPONSIVE CONTAINER ------------------ */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">

                    {/* LEFT SIDE: Order Code & Time */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 sm:space-x-4">

                        {/* Order Code & Table/Time */}
                        <div className="flex-shrink-0">
                          <h3 className="font-semibold text-sm sm:text-base whitespace-nowrap">{order?.order_code}</h3>
                          <p className="text-xs text-gray-600 sm:text-sm whitespace-nowrap">
                            {order.table_code} • {new Date(order?.order_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </p>
                          <div className="h-4 sm:hidden"></div>
                        </div>

                        {/* Items & Amount (Original Desktop Position) - HIDDEN ON MOBILE TOP ROW */}
                        <div className="hidden sm:flex-1 sm:min-w-0 sm:flex sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-gray-600 truncate">
                              Items: {order.order_items.map(i => i.menu_item).join(", ")}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-green-600 sm:text-base">
                            ₹{order.order_items.reduce((total, item) => total + item.price * item.quantity, 0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto pt-2 border-t sm:border-t-0 mt-1 sm:mt-0">

                      <div className="flex items-center gap-1 sm:hidden">

                        <div className="flex-shrink-0">
                          {/* Item List: Show only 1 item on mobile */}
                          <p className="text-xs text-gray-600 truncate max-w-[100px]">
                            Items: {order.order_items[0]?.menu_item || "No Items"}
                          </p>

                          {/* Amount */}
                          <p className="text-sm font-medium text-green-600">
                            ₹{order.order_items.reduce((total, item) => total + item.price * item.quantity, 0)}
                          </p>
                        </div>

                        {/* More Button (Mobile only) - LOGIC CHANGED HERE */}
                        {order.order_items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1 py-0 text-xs flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowItemsModal(order.slug);
                            }}
                          >
                            More
                          </Button>
                        )}
                      </div>

                      {/* Status Badge & Update Status Button (Desktop only) */}
                      <div className="hidden sm:flex sm:items-center sm:space-x-3">
                        <Badge className={statusoption(order.status)}>
                          {order.status}
                        </Badge>
                      </div>

                      {/* Select Input (Responsive Width) - RIGHT SIDE */}
                      <Select
                        value={order.status}
                        onValueChange={(value) => {
                          const updatedOrder = { ...order, status: value };
                          StatusUpdate(updatedOrder);
                        }}
                        disabled={order.status === "cancelled" || order.status === "completed"}
                      >
                        <SelectTrigger className="w-[110px] sm:w-[140px] text-xs sm:text-sm px-2 py-1 h-auto sm:h-9 ml-[8px]">
                          <SelectValue placeholder={order.status} />
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. ItemsDetailsCard/Dialog Component */}
      {currentOrder && (
        <Dialog open={!!showItemsModal} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Order Items: {currentOrder.order_code}</DialogTitle>
            </DialogHeader>

            {/* Order items list */}
            <div className="py-4 space-y-3">
              {currentOrder.order_items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span className="font-medium text-sm">
                    {item.menu_item} × {item.quantity}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              {/* Total amount */}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-base font-bold">Total Amount</span>
                <span className="text-base font-bold text-green-600">
                  ₹
                  {currentOrder.order_items?.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {activeTab === "pos" && <RestaurantOrder />}
      {activeTab === "booking" && <TableBooking />}
    </div>
  );
};
export default RestaurantManagement;  