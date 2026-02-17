import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SliderTrack, SliderRange, SliderThumb } from "@radix-ui/react-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package, Plus, AlertTriangle, TrendingDown, RotateCcw,
  Search, Filter, Truck, ShoppingCart, BarChart3,
  X,
  User,
  Mail,
  Phone,
  Star,
  Building2,
  Hash,
  AlertCircle,
  Minus,
  RefreshCcw,
  Pencil,
  XCircle
} from "lucide-react";
import { set } from "date-fns";
import { Slider } from "@radix-ui/react-slider";
import { get } from "http";
import { useToast } from "@/hooks/use-toast";


interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  costPerUnit: number;
  cost_per_unit: number;
  supplier: string;
  lastRestocked: string;
  status: "good" | "low" | "critical" | "overstock";
  stock_level: number;
}

interface DashSummaryType {
  total_items: number;
  low_stock: number;
  total_value: number;
  total_suppliers: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  items: number;
  rating: number;
}

interface supplier {
  name: string;
  email: string;
  phone: string;

}
interface Product {
  category: string;
  supplier: string;
  name: string;
  stock_level: number;
  unit: string;
  min_stock: number;
  max_stock: number;
  cost_per_unit: number;
}

export const InventoryManagement = () => {
  const { toast } = useToast();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedName, setSelectedName] = useState<string>("");
  const [loadingRow, setLoadingRow] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [loadingSupplier, setLoadingSupplier] = useState(false);
  const [viewItems, setViewItems] = useState<InventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("items");
  const [viewSuppler, setViewSupplier] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [disabling, setDisabling] = useState(false);
  const [itemdisable, setItemdisable] = useState(false);
  const [Open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isopen, setIsopen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [AllItems, setAllItems] = useState([]);
  const [AllCategories, setAllCategories] = useState([]);
  const [reportsOverview, setReportsOverview] = useState({
    category_breakdown: [],
    stock_status: []
  });

  const [allpurchaserders, setAllPurchaseOrders] = useState([]);
  const [AllSuppliers, setAllSuppliers] = useState([]);
  const accessToken = localStorage.getItem('accessToken') || "";
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [editView, setEditView] = useState(false);

  //==================Edit Item State===================//
  const [CurrentItem, setCurrentItem] = useState({
    name: "",
    category: "",
    category_name: "",
    currentStock: 0,
    min_stock: 0,
    max_stock: 0,
    slug: "",
    unit: "",
    cost_per_unit: 0,
    supplier: "",
    lastRestocked: "",
    status: "",
    stock_level: 0,
  });

  const [stockLevel, setStockLevel] = useState(CurrentItem.stock_level || 0);
  //=======================Filling Currenitem data============================//
  const Setdata = (item) => {
    setCurrentItem({
      name: item.name,
      slug: item.slug,
      category_name: item.category_name,
      category: item.category,
      currentStock: item.stock_level,
      min_stock: item.min_stock,
      max_stock: item.max_stock,
      unit: item.unit,
      cost_per_unit: item.cost_per_unit,
      supplier: item.supplier,
      lastRestocked: item.last_restocked,
      status: item.status,
      stock_level: item.stock_level,
    });
    setStockLevel(item.stock_level);

  }
  //========================Reset Current Item on Edit View Close==================//
  useEffect(() => {
    console.log("Edit View changed:", CurrentItem);
    if (!editView) {
      setCurrentItem({
        name: "",
        category: "",
        category_name: "",
        slug: "",
        currentStock: 0,
        min_stock: 0,
        max_stock: 0,
        unit: "",
        cost_per_unit: 0,
        supplier: "",
        lastRestocked: "",
        status: "",
        stock_level: 0,
      });
    }

  }, [editView])
  //========================Sync stock level with CurrentItem==================//
  useEffect(() => {
    setStockLevel(CurrentItem.stock_level || 0);
  }, [CurrentItem]);

  //========================Item State==================//
  const [product, setProduct] = useState<Product>({
    category: "",
    supplier: "",
    name: "",
    stock_level: 0,
    unit: "",
    min_stock: 0,
    max_stock: 0,
    cost_per_unit: 0,
  });
  const statusFlow = {
    Pending: "in_progress",
    in_progress: "ready",
    ready: "delivered",
    delivered: "delivered" // no next
  };
  const [AddSupplier, setAddSupplier] = useState<supplier>({
    name: "",
    email: "",
    phone: "",

  })

  const [PurchaseOrder, setPurchaseOrder] = useState({
    items: [
      {
        item: "",
        quantity: 1,
        cost_per_unit: 1,
      }
    ]

  });
  const handleAddRow = () => {
    setPurchaseOrder(prev => ({
      ...prev,
      items: [...prev.items, { item: "", quantity: 0, cost_per_unit: 0 }]
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...PurchaseOrder.items];
    updatedItems[index][field] = value;

      if (field === "item") {
    const selectedItem = filteredItems.find(item => item.slug === value);
    if (selectedItem) {
      updatedItems[index].cost_per_unit = selectedItem.cost_per_unit;
    }
  }

    setPurchaseOrder(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };
  const handleRemoveRow = (index) => {
    setPurchaseOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const [loadedTabs, setLoadedTabs] = useState({
    items: false,
    suppliers: false,
    orders: false,
    reports: false,
  });


  const [DashSummary, setDashSummary] = useState<DashSummaryType>({
    total_items: 0,
    low_stock: 0,
    total_value: 0,
    total_suppliers: 0,
  });

  const filteredItems = AllItems.filter(
    (item) => item.supplier === selectedSupplier
  );
  const getSupplierItems = (supplier) => {
    return AllItems.filter(item => item.supplier === supplier.slug);
  };

  const passingSupplier = (itemarrray) => {

    setViewSupplier(itemarrray);
    setOpenView(true);
  }


  // useEffect(() => {
  //   const payload = {
  //     ...PurchaseOrder,
  //     supplier: selectedSupplier
  //   }

  //   console.log("Updated purchase order:", payload);

  // }, [PurchaseOrder, selectedSupplier]);

  // Clear view when modal is closed

  useEffect(() => {
    if (!openView) {
      setViewSupplier([])
      setSelectedName("")
    }
  }, [openView])

  //----Clear disabling on modal close
  useEffect(() => {
    if (!Open) {
      setDisabling(false)
      setItemdisable(false)
      setSelectedSupplier("")
      setPurchaseOrder({
        items: [
          {
            item: "",
            quantity: 1,
            cost_per_unit: 1,
          }
        ]

      })

    }
  }, [Open])
  const [inventory] = useState<InventoryItem[]>([

  ]);

  const ClearState = () => {
    setProduct({
      category: "",
      supplier: "",
      name: "",
      stock_level: 0,
      unit: "",
      min_stock: 0,
      max_stock: 0,
      cost_per_unit: 0,
    })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPurchaseOrder(prev => ({ ...prev, [name]: value }));
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-100 text-green-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      case "overstock": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    return (item?.stock_level ?? 0) / (item?.max_stock ?? 1) * 100;
  };



  const lowStockItems = AllItems.filter(item => item.status === "critical" || item.status === "low");
  const totalValue = inventory.reduce((acc, item) => acc + (item.currentStock * item.costPerUnit), 0);


  const getSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/dashboard-summary/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
      });
      const data = await response.json();

      setDashSummary(data);

      console.log("Orders  data:", data);
      if (response.ok) {
        console.log("Fetched Summary:", data);
      } else {
        throw new Error(`Failed to get Summary: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting Summary:", error);
    }
  }

  const getAllItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/items/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllItems(data);
      console.log("items  data:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched items:", data);
      } else {
        throw new Error(`Failed to get items: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting items:", error);
    }
  }

  const getAllCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/categories/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllCategories(data);
      console.log("categories  data:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched categories:", data);
      } else {
        throw new Error(`Failed to get categories: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting categories:", error);
    }
  }
  const getAllSuppliers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/suppliers/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllSuppliers(data);
      console.log("suppliers  data:", data);
      if (response.ok) {
        // setOrders(data);
        console.log("Fetched suppliers:", data);
      } else {
        throw new Error(`Failed to get suppliers: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting suppliers:", error);
    }
  }

  const getAllPurchaseOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/purchase-orders/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllPurchaseOrders(data);
      console.log("purchase orders  data:", data);
      if (response.ok) {
        console.log("Fetched purchase orcders:", data);
      } else {
        throw new Error(`Failed to get purchase orders: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting purchase orders:", error);
    }
  }

  const getReportsOverview = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/reports/overview/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReportsOverview(data);
      console.log("report  data:", data);
      if (response.ok) {
        console.log("Fetched reports:", data);
      } else {
        throw new Error(`Failed to get reports: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting reports:", error);
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      // If data for this tab is already loaded, do not fetch again
      if (loadedTabs[activeTab]) return;

      try {
        switch (activeTab) {
          case "items":
            console.log("Fetching Items...");
            await [
              getSummary(),
              getAllCategories(),
              getAllSuppliers(),
              getAllItems(),


            ];
            break;

          case "suppliers":
            console.log("Fetching Suppliers...");
            await getAllSuppliers();
            break;

          case "orders":
            console.log("Fetching Orders...");
            await getAllPurchaseOrders();
            break;

          case "reports":
            console.log("Fetching Reports...");
            await getReportsOverview();
            break;

          default:
            console.warn("Unknown tab: ", activeTab);
        }

        // Mark this tab as loaded (only after successful fetch)
        setLoadedTabs(prev => ({
          ...prev,
          [activeTab]: true,
        }));

      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab, loadedTabs]);


  //------------------------------Add Supplier--------------------------------------------------------------------------------//

  const AddNewSupplier = async (e) => {
    e.preventDefault();
    const payload = {
      ...AddSupplier,
      rating: rating
    }
    console.log(payload)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/suppliers/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("items  data:", data);
      if (response.ok) {
        toast({
          title: "Supplier Created",
          description: "New Supplier Created Successfully.",
          className: "bg-gradient-to-tr from-[#22c55e] via-[#0e7490] to-[#3b82f6] text-white border-none shadow-lg"

        })
        console.log("Added Supplier:", data);
      } else {
        throw new Error(`Failed to add Supplier: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
    setRating(0);
    getAllSuppliers();
    setIsOpen(false)

  }

  //------------------------------Add Item--------------------------------------------------------------------------------//

  const AddNewItem = async (e) => {
    e.preventDefault();

    for (let key in product) {
      const v = product[key];

      if (v === "" || v === null || v === undefined || v === "0" || v === 0) {
        alert(`Please Fill Out All FIelds`);
        return;
      }
    }


    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/items/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(product)
      });
      const data = await response.json();
      console.log("items  data:", data);
      if (response.ok) {
        toast({
          title: "Item Created",
          description: "New Item Added Successfully.",
          className: "bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-[#1d4ed8] via-[#1e40af] to-[#111827] text-white border-none shadow-lg"
        })
        console.log("Added item:", data);
      } else {
        throw new Error(`Failed to add item: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
    ClearState();
    getAllItems();
    setIsopen(false)

  }

  //------------------------------Place Purchase Order--------------------------------------------------------------------------------//  

  const PlacePurchaseOrder = async (e) => {
    e.preventDefault();

    const payload = {
      ...PurchaseOrder,
      supplier: selectedSupplier
    };
    console.log("Final Purchase Order Payload:", payload);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/purchase-orders/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("order  data:", data);
      if (response.ok) {
        toast({
          title: "Purchase Order Created",
          description: "New Purchase Order Created Successfully.",
          className:"bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-[#00204a] via-[#005792] to-[#00bbf0] text-white border-none shadow-lg"

        })
       

        console.log("Order:", data);
      } else {
        throw new Error(`Failed to create order: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
    setPurchaseOrder({
      items: [
        {
          item: "",
          quantity: 0,
          cost_per_unit: 0,
        }
      ]
    });

    setSelectedSupplier("");
    getAllPurchaseOrders();
    setOpen(false)

  }

  //----------------------------------------------Update Status-------------------------------------------------------//

  const UpdateOrder = async (slug, next) => {
    console.log(slug, next)
    const payload = {
      status: next
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/purchase-orders/${slug}/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("  updated:", data);
      if (response.ok) {
        toast({
          title: "Order Updated",
          description: "Your Purchase-Order's status has been Updated successfully.",
          className: "bg-gradient-to-bl from-[#84cc16] via-[#22c55e] to-[#16a34a] text-white border-none shadow-lg"
        });
        console.log("status:", data);
      } else {
        throw new Error(`Failed to update order: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
    getAllPurchaseOrders();

  }

  //----------------------------------------------------Update Item-------------------------------------------------//

  const UpdateItem = async () => {
    console.log(CurrentItem);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/items/${CurrentItem.slug}/`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(CurrentItem)
      });
      const data = await response.json();
      console.log("  updated item:", data);
      if (response.ok) {
        toast({
          title: "Item Updated",
          description: " Item has been Updated successfully.",
          className: "bg-gradient-to-bl from-[#84cc16] via-[#22c55e] to-[#16a34a] text-white border-none shadow-lg"

        });
        console.log("Item:", data);
      } else {
        throw new Error(`Failed to update Item: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error updating Item:", error);
    }
    getAllItems();
    setEditView(false);

  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Items</p>
                  <p className="text-3xl font-bold">{DashSummary.total_items}</p>
                </div>
                <Package className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Low Stock</p>
                  <p className="text-3xl font-bold">{DashSummary.low_stock}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Value</p>
                  <p className="text-3xl font-bold">₹{DashSummary.total_value}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Suppliers</p>
                  <p className="text-3xl font-bold">{DashSummary.total_suppliers}</p>
                </div>
                <Truck className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{lowStockItems.length} items</strong> are running low on stock and need reordering.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="
    grid w-full
    grid-cols-2        /* mobile = 2 by 2 */
    md:grid-cols-4     /* desktop/tablet = 4 in one row */
    gap-2 mb-12
  "
          >
            <TabsTrigger value="items">Inventory Items</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <Button
                onClick={() => setIsopen(true)}
                className="
    bg-gradient-to-r from-blue-500 to-purple-600 
    hover:from-blue-600 hover:to-purple-700
    relative min-w-[110px] flex items-center justify-center
  "
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>


            </div>
            {/* Edit item ---------------------------------------------------------------------------------------------------- */}
            {editView && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <Card className="w-full max-w-lg rounded-2xl shadow-2xl">
                  <CardContent className="p-6 space-y-6">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{CurrentItem.name}</h2>
                      <Button variant="ghost" onClick={() => setEditView(false)} ><XCircle /></Button>
                    </div>

                    {/* Item Name Input */}
                    <div className="space-y-1">
                      <label className="text-sm text-gray-700">Item Name</label>
                      <Input
                        type="text"
                        value={CurrentItem.name}
                        onChange={(e) =>
                          setCurrentItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter item name"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-sm text-gray-700">Category</label>
                      <Select
                        value={CurrentItem.category}
                        onValueChange={(val) => setCurrentItem(prev => ({ ...prev, category: val }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>

                        <SelectContent>
                          {AllCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Stock Level */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Stock Level</span>
                        <span>{CurrentItem.stock_level}</span>
                      </div>

                      <Slider
                        value={[CurrentItem.stock_level || 0]} // fallback agar undefined ho
                        min={0}
                        max={CurrentItem.max_stock || 100}
                        step={1}
                        onValueChange={(v) =>
                          setCurrentItem((prev) => ({
                            ...prev,
                            stock_level: v[0], // yaha stock_level update ho raha hai
                          }))
                        }
                        className="relative flex items-center w-full h-5"
                      >
                        <SliderTrack className="bg-gray-200 relative grow rounded-full h-2">
                          <SliderRange className="absolute bg-blue-500 rounded-full h-full" />
                        </SliderTrack>
                        <SliderThumb className="block w-5 h-5 bg-white border border-gray-400 rounded-full shadow" />
                      </Slider>
                    </div>


                    {/* Min & Max Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700">Min Stock</label>
                        <Input
                          type="number"
                          value={CurrentItem.min_stock}
                          onChange={(e) =>
                            setCurrentItem((prev) => ({
                              ...prev,
                              min_stock: Number(e.target.value),
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-700">Max Stock</label>
                        <Input
                          type="number"
                          value={CurrentItem.max_stock}
                          onChange={(e) =>
                            setCurrentItem((prev) => ({
                              ...prev,
                              max_stock: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Cost & Total */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700">Cost per Unit</label>
                        <Input
                          type="number"
                          value={CurrentItem.cost_per_unit}
                          onChange={(e) =>
                            setCurrentItem((prev) => ({
                              ...prev,
                              cost_per_unit: Number(e.target.value),
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-700">Total Value</label>
                        <div className="p-2 border rounded-lg bg-gray-50 font-semibold">
                          ₹{CurrentItem.stock_level * CurrentItem.cost_per_unit}
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={async () => {
                        setLoadingSave(true);

                        await UpdateItem();   // jo bhi async kaam hai

                        setLoadingSave(false);
                      }}
                      disabled={loadingSave}
                      className="w-full mt-4 flex items-center justify-center relative min-h-[40px]"
                    >
                      {loadingSave ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>

                  </CardContent>
                </Card>

              </div>)}
            {/* Add New Item Modal ---------------------------------------------------------------------------------------------------- */}

            {isopen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={()=>setIsopen(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                    <button
                      onClick={() => setIsopen(false)}
                      className="text-gray-500 hover:text-gray-700 transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 space-y-6">
                    {/* Yeh line change ki hai → ab mobile pe bhi 2 columns */}
                    <form
                      className="grid grid-cols-2 gap-6"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          setLoadingItem(true);
                          await AddNewItem(e);   // pehle direct function call tha
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setLoadingItem(false);
                        }
                      }}
                    >



                      {/* Category */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Package className="w-4 h-4 text-gray-500" />
                          Category
                        </label>
                        <select
                          name="category"
                          value={product.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                          required
                        >
                          <option value="">Select Category</option>
                          {AllCategories.map((cat) => (
                            <option key={cat.id} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Supplier */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          Supplier
                        </label>
                        <select
                          name="supplier"
                          value={product.supplier}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                          required
                        >
                          <option value="">Select Supplier</option>
                          {AllSuppliers.map((supp) => (
                            <option key={supp.id} value={supp.slug}>
                              {supp.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Product Name</label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleChange}
                          placeholder="e.g. Premium Cotton 40s"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Unit</label>
                        <input
                          type="text"
                          name="unit"
                          value={product.unit}
                          onChange={handleChange}
                          required
                          placeholder="e.g. kg, meter, piece"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Cost Per Unit */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cost Per Unit (₹)</label>
                        <input
                          type="number"
                          name="cost_per_unit"
                          value={product.cost_per_unit}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          min="0"
                        />
                      </div>

                      {/* Stock Level */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Hash className="w-4 h-4 text-gray-500" />
                          Current Stock
                        </label>
                        <input
                          type="number"
                          name="stock_level"
                          value={product.stock_level}
                          onChange={handleChange}
                          required
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          min="0"
                        />
                      </div>

                      {/* Min Stock */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                          Min Stock Alert
                        </label>
                        <input
                          type="number"
                          name="min_stock"
                          value={product.min_stock}
                          onChange={handleChange}
                          required
                          placeholder="Min level"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          min="0"
                        />
                      </div>

                      {/* Max Stock */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Max Stock</label>
                        <input
                          type="number"
                          name="max_stock"
                          value={product.max_stock}
                          onChange={handleChange}
                          placeholder="Max capacity"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          min="0"
                        />
                      </div>

                      {/* Submit Button - full width */}
                      <div className="col-span-2 pt-4">
                        <button
                          type="submit"
                          disabled={loadingItem}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5
  rounded-xl transition transform hover:scale-[1.02]
  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-[1.00] flex 
  items-center justify-center min-h-[46px]"
                        >
                          {loadingItem ? (
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            "Add Item"
                          )}
                        </button>

                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AllItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category_name}</p>
                      </div>

                      {/* BADGE + EDIT BUTTON */}
                      <div className="flex items-center gap-3">

                        {/* Status badge */}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>

                        {/* Edit button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            setEditView(true);
                            Setdata(item)
                          }
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>

                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Level</span>
                        <span>{item.stock_level} {item.unit}</span>
                      </div>
                      <Progress value={getStockPercentage(item)} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Min: {item.min_stock}</span>
                        <span>Max: {item.max_stock}</span>
                      </div>


                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Cost per unit</p>
                          <p className="font-semibold">₹{item.cost_per_unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total value</p>
                          <p className="font-semibold">₹{item.total_value}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">Supplier: {item.supplier_name}</p>
                        <p className="text-xs text-gray-600">Last restocked: {item.last_restocked}</p>
                      </div>

                      {(item.status === "low" || item.status === "critical") && (
                        <Button
                          onClick={() => {
                            setSelectedSupplier(item.supplier);
                            setPurchaseOrder(prev => ({
                              ...prev,
                              items: [

                                {
                                  item: item.slug,
                                  quantity: 1,
                                  cost_per_unit: item.cost_per_unit,
                                }
                              ]
                            }));
                            setItemdisable(true);
                            setOpen(true);

                          }}

                          size="sm" className="w-full bg-red-500 hover:bg-red-600">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reorder Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {Open && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setOpen(false)} />

              <div className="fixed inset-x-0 bottom-[10%] z-50 bg-white rounded-3xl shadow-2xl w-[90%] max-w-lg mx-auto overflow-hidden transition-all duration-300 max-h-[85vh] overflow-y-auto">
                <div className="p-6">
                  {/* Drag handle & close button */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Note: Original code had drag handle div and close button div nested incorrectly, the closing button was outside the flex container. I fixed it by removing the duplicate/incorrectly placed drag handle div */}
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                    <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Add New Purchase Item</h2>

                  <form
                    className="space-y-7"
                    onSubmit={async (e) => {
                      e.preventDefault();     //  form reload stop
                      setLoadingRow(true);

                      await PlacePurchaseOrder(e);   // async function yaha chalega

                      setLoadingRow(false);
                    }}
                  >

                    {/* Supplier Selector */}
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600 z-10">Supplier</label>
                      <select
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                        value={selectedSupplier}
                        disabled={disabling || itemdisable}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select a supplier</option>
                        {/* Show selected supplier if not in AllSuppliers */}
                        {selectedSupplier && !AllSuppliers.some(supp => supp.slug === selectedSupplier) && (
                          <option value={selectedSupplier}>{selectedSupplier}</option>
                        )}
                        {AllSuppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.slug}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>

                    </div>

                    {PurchaseOrder.items.map((row, index) => (
                      <div key={index} className="grid grid-cols-[2fr_0.7fr_0.7fr_0.5fr] gap-5 mb-4 items-center">

                        {/* ITEM */}
                        <div className="relative">
                          <label className="absolute left-3 -top-3 bg-white px-2 text-xs font-medium text-gray-600">
                            Item
                          </label>

                          <select
                            className="w-full px-4 py-4 border-2 rounded-xl"
                            disabled={itemdisable}
                            value={row.item}
                            onChange={(e) => handleItemChange(index, "item", e.target.value)}
                            required
                          >
                            <option value="" disabled>Select item</option>
                            {filteredItems.map(item => (
                              <option key={item.id} value={item.slug}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* QUANTITY */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-8px] bg-white px-2 text-xs font-medium text-gray-600">
                            Quantity
                          </label>

                          <input
                            type="number"
                            min={1}
                            className="w-full px-4 py-4 border-2 rounded-xl"
                            value={row.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                            required
                          />
                        </div>

                        {/* COST PER UNIT */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-8px] bg-white px-2 text-xs font-medium text-gray-600">
                            Cost/Unit
                          </label>

                          <input
                            type="number"
                            placeholder="0"
                            disabled={itemdisable}
                            min={1}
                            className="w-[110%] px-4 py-4 border-2 rounded-xl"  // ← slightly increased width
                            value={row.cost_per_unit}
                            onChange={(e) => handleItemChange(index, "cost_per_unit", Number(e.target.value))}
                            required
                          />
                        </div>

                        {/* REMOVE BUTTON */}
                        {PurchaseOrder.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            className="size-10 rounded-lg border-2 border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50 transition"
                            aria-label="Remove row"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                        )}

                      </div>
                    ))}



                    {!itemdisable && (
                      <button
                        onClick={handleAddRow}
                        type="button"
                        className="
    mt-6 w-full py-4 border-2 border-black text-black rounded-xl font-semibold
    flex items-center justify-center gap-2
    transition hover:bg-gray-100 
    hover:shadow-[inset_0_0_10px_3px_rgba(0,0,0,0.3)]
    active:shadow-[inset_0_0_14px_5px_rgba(0,0,0,0.35)]
  "
                        disabled={itemdisable}

                      >
                        <Plus className="w-5 h-5" />
                        Add Item
                      </button>

                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loadingRow}
                        className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-medium 
             hover:bg-blue-700 transition shadow-lg flex items-center 
             justify-center min-h-[48px]"
                      >
                        {loadingRow ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : (
                          "Add Order"
                        )}
                      </button>

                    </div>
                  </form>
                </div>
              </div>
            </>
          )}


          <TabsContent value="suppliers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
                <p className="text-gray-600">Manage your supply chain partners</p>
              </div>
              <Button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </div>
            {isOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Header */}
                  <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-bold text-center text-black">Add a new Supplier</h3>
                  </div>
                  {/* Compact Form */}
                  <form
                    className="p-5 space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();        //  Form reload stop
                      setLoadingSupplier(true);

                      await AddNewSupplier(e);   // same function ko yaha call karo

                      setLoadingSupplier(false);
                    }}
                  >

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <User className="w-4 h-4 text-gray-500" />
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Supplier name"
                        value={AddSupplier.name}
                        onChange={(e) => setAddSupplier({ ...AddSupplier, name: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail className="w-4 h-4 text-gray-500" />
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="supplier@example.com"
                        value={AddSupplier.email}
                        onChange={(e) => setAddSupplier({ ...AddSupplier, email: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 text-gray-500" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 011-2553-2553"
                        value={AddSupplier.phone}
                        onChange={(e) => setAddSupplier({ ...AddSupplier, phone: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                      />
                    </div>

                    {/* Compact Rating */}


                    {/* Submit */}
                    <button
                      type="submit"               // submit button
                      disabled={loadingSupplier}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium 
             py-2.5 rounded-lg text-sm transition hover:scale-105 
             flex items-center justify-center min-h-[42px]"
                    >
                      {loadingSupplier ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      ) : (
                        "Add Supplier"
                      )}
                    </button>


                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AllSuppliers.map((supplier) => (

                <Card key={supplier.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                        <p className="text-sm text-gray-600">{supplier.phone}</p>
                        <p className="text-sm text-gray-600">{supplier.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${i < supplier.rating ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{supplier.rating}/5</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Items supplied</span>
                        <span className="font-semibold"> {getSupplierItems(supplier).length}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedName(supplier.name);
                          { passingSupplier(getSupplierItems(supplier)) };
                        }}
                        size="sm" variant="outline" className="flex-1">
                        View Items
                      </Button>
                      {openView && (
                        <div className="fixed inset-0 bg-neutral-900/20 backdrop-blur-[1px] flex items-center justify-center z-[9999] p-6"
                        onClick={()=>setOpenView(false)}
                        >

                          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-8 relative border border-gray-200 z-[10000]">

                            {/* Close */}
                            <button
                              onClick={() => setOpenView(false)}
                              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            >
                              <X size={22} />
                            </button>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-gray-900">{selectedName}</h2>

                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                {viewSuppler.length} Items
                              </span>
                            </div>

                            {viewSuppler.length > 0 ? (
                              viewSuppler.map(item => (
                                <div key={item.id} className="p-4 border-b flex items-center justify-between">
                                  <div className="space-y-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.category_name}</p>
                                  </div>

                                  <p className="text-base font-semibold text-gray-800 text-right">
                                    ₹{item.cost_per_unit}
                                    <span className="block text-xs text-gray-500 font-normal">per {item.unit}</span>
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500 border-b">
                                <p className="font-medium"> No items supplied by this supplier.</p>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setOpen(true);
                          setSelectedSupplier(supplier.slug);
                          setDisabling(true);
                        }}

                        size="sm" className="flex-1">
                        Create Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {/* Assumes ShoppingCart is imported from 'lucide-react' or similar */}
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Purchase Orders
                </CardTitle>
                <CardDescription>Track and manage purchase orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Purchase Order
                  </Button>
                </div>
                {/* Assumes allpurchaserders, setOpen, Button, Plus, ShoppingCart are defined/imported */}
                {allpurchaserders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Orders</h3>
                    <p className="text-gray-600 mb-6">Create your first purchase order to get started</p>
                    <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Purchase Order
                    </Button>
                  </div>
                ) : (

                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full border-collapse text-sm">
                      <thead className="bg-gray-100 text-gray-600">
                        <tr>
                          <th className="px-4 py-3 text-left">Supplier</th>
                          <th className="px-4 py-3 text-left">Item</th>
                          <th className="px-4 py-3 text-left">Cost/Unit</th>
                          <th className="px-4 py-3 text-left">Total Cost</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Last Restocked</th>
                          <th className="px-4 py-3 text-left">Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">

                        {allpurchaserders.map((order) => (

                          <tr
                            key={order.slug}
                            className="border-b hover:bg-gray-50 hover:shadow-md hover:-translate-y-[2px] transition-all duration-200"
                          >

                            <td className="px-4 py-5 font-semibold text-gray-900">
                              {order.supplier_name}
                            </td>

                            <td className="px-4 py-5 text-gray-700 space-y-2">
                              {order.items?.map((i, index) => (
                                <div key={index}>
                                  <span className="font-medium text-gray-900">{i.item}</span>
                                  <span className="text-gray-500"> (x{i.quantity})</span>
                                </div>
                              ))}
                            </td>

                            <td className="px-4 py-5 text-gray-900 space-y-2">
                              {order.items?.map((i, index) => (
                                <div key={index}>₹{i.cost_per_unit}</div>
                              ))}
                            </td>

                            <td className="px-4 py-5 font-semibold text-gray-900 space-y-2">
                              {order.items?.map((i, index) => (
                                <div key={index}>₹{i.total_cost}</div>
                              ))}
                            </td>

                            {/* 👉 This is the important fix */}
                            <td className="px-4 py-5 flex items-start">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                {order.status}
                              </span>
                            </td>

                            <td className="px-4 py-5 text-gray-600 text-sm">
                              {order.created_at.split("T")[0]}
                            </td>

                            <td className="px-4 py-5">
                              <button
                                onClick={async () => {
                                  if (order.status === "delivered") return; // delivered par kuch na kare

                                  setLoadingStatus(order.slug);

                                  const next = statusFlow[order.status];
                                  await UpdateOrder(order.slug, next);

                                  setLoadingStatus(null);
                                }}
                                className={`
      flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg min-w-[140px] justify-center transition
      
      ${order.status === "delivered"
                                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  }
    `}
                                disabled={loadingStatus === order.slug || order.status === "delivered"}
                              >
                                {loadingStatus === order.slug ? (
                                  <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                  </svg>
                                ) : (
                                  <>
                                    {/*  DELIVERED HO TO REFRESH ICON HIDE */}
                                    {order.status !== "delivered" && <RefreshCcw className="w-4 h-4" />}

                                    {order.status === "delivered" ? "Delivered" : "Update Status"}
                                  </>
                                )}
                              </button>
                            </td>



                          </tr>


                        ))}
                      </tbody>
                    </table>
                  </div>

                )}


              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Inventory Reports
                </CardTitle>
                <CardDescription>Analyze inventory trends and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Category Breakdown</h3>
                    {reportsOverview.category_breakdown.map((cat) => {

                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{cat.category}</span>
                            <span>{cat.item_count} items - $ {cat.total_value}</span>
                          </div>
                          <Progress value={cat.item_count} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Stock Status</h3>
                    {reportsOverview.stock_status.map((stat) => {

                      // const percentage = (statusItems.length / inventory.length) * 100;

                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{stat.status}</span>
                            <span>{stat.item_count} items ({stat.percentage}%)</span>
                          </div>
                          <Progress value={stat.percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >
    </>
  );
};