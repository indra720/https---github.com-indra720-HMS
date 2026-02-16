import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Minus, Search, CreditCard, DollarSign, Trash2, X, QrCode, Wallet} from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  available: boolean;
}
interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
}
interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  tableNumber?: string;
  customerName?: string;
  timestamp: Date;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
}

const POSSystem = () => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Starters");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [menuCategoryList, setMenuCategoryList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  const [paymentMethod, setPaymentMethod] = useState("");



  const menuItems: MenuItem[] = [
    // Appetizers
    { id: 1, name: "Truffle Arancini", price: 18, category: "appetizers", description: "Crispy risotto balls with truffle oil", image: "🍚", available: true },
    { id: 2, name: "Tuna Tartare", price: 24, category: "appetizers", description: "Fresh yellowfin tuna with avocado", image: "🍣", available: true },
    { id: 3, name: "Burrata Caprese", price: 16, category: "appetizers", description: "Fresh burrata with tomatoes and basil", image: "🧀", available: true },

    // Main Course
    { id: 4, name: "Wagyu Ribeye", price: 85, category: "mains", description: "A5 Wagyu with seasonal vegetables", image: "🥩", available: true },
    { id: 5, name: "Pan-Seared Halibut", price: 38, category: "mains", description: "Fresh halibut with lemon butter sauce", image: "🐟", available: true },
    { id: 6, name: "Duck Confit", price: 42, category: "mains", description: "Slow-cooked duck leg with cherry sauce", image: "🦆", available: true },
    { id: 7, name: "Lobster Ravioli", price: 34, category: "mains", description: "House-made pasta with lobster filling", image: "🦞", available: false },

    // Desserts
    { id: 8, name: "Chocolate Soufflé", price: 14, category: "desserts", description: "Dark chocolate soufflé with vanilla ice cream", image: "🍫", available: true },
    { id: 9, name: "Tiramisu", price: 12, category: "desserts", description: "Classic Italian dessert", image: "🍰", available: true },

    // Beverages
    { id: 10, name: "Espresso", price: 4, category: "beverages", description: "Italian espresso", image: "☕", available: true },
    { id: 11, name: "Fresh Orange Juice", price: 6, category: "beverages", description: "Freshly squeezed orange juice", image: "🍊", available: true },

    // Wine & Spirits
    { id: 12, name: "Chateau Margaux 2015", price: 450, category: "wine", description: "Premium Bordeaux wine", image: "🍷", available: true },
    { id: 13, name: "Craft Beer Selection", price: 8, category: "wine", description: "Local craft beer", image: "🍺", available: true }
  ];

  // const filteredItems = menuItems.filter(item => {
  //   const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = activeCategory === "all" || item.category === activeCategory;
  //   return matchesSearch && matchesCategory && item.available;
  // });

 const filteredItems = menuList.filter((item: any) => {
  const matchesCategory =
    item.category?.toLowerCase() === activeCategory.toLowerCase();

  const matchesSearch =
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase());

  // 🔹 Agar searchTerm empty hai → sirf category filter
  if (searchTerm.trim() === "") {
    return matchesCategory;
  }

  // 🔹 Agar searchTerm hai → sirf search result dikhao
  return matchesSearch;
});


  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: number) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setTableNumber("");
    setCustomerName("");
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const tax = (subtotal - discountAmount) * 0.1; // 10% tax
    const total = subtotal - discountAmount + tax;

    return { subtotal, discountAmount, tax, total };
  };

  const processPayment = async () => {
  const { subtotal, discountAmount, tax, total } = calculateTotals();

  // 1️⃣ Order object create karna
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    items: [...cart],
    subtotal,
    tax,
    discount: discountAmount,
    total,
    paymentMethod,
    tableNumber: tableNumber || undefined,
    customerName: customerName || undefined,
    timestamp: new Date(),
    status: 'preparing'
  };

  // 2️⃣ Invoice object structure backend ke hisab se
  const invoicePayload = {
    object_id: newOrder.id,
    customer_name: newOrder.customerName || "Guest",
    due_date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
    total_amount: total.toFixed(2),
    amount_paid: total.toFixed(2), // full payment assumed
    notes: "", // optional notes
    content_type: 1, // example value, aap apne backend ke hisab se change kare
    items: newOrder.items.map(item => ({
      description: item.name,
      quantity: item.quantity,
      unit_price: item.price,
    })),
    payments: [
      {
        amount_paid: total.toFixed(2),
        method: paymentMethod,
        reference: `PAY-${Date.now()}`,
      }
    ]
  };
     console.log(invoicePayload);
  try {
    // 3️⃣ POST request
    const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/invoices/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(invoicePayload)
    });

    if (!response.ok) throw new Error("Failed to create invoice");

    const data = await response.json();
     console.log(data);

    // 4️⃣ Local state update
    setOrders([...orders, newOrder]);
    setCurrentOrder(newOrder);
    clearCart();
    setIsPaymentOpen(false);

    toast.success(`Payment processed! Invoice ${data.object_id} created.`);
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
  }
};


  const { subtotal, discountAmount, tax, total } = calculateTotals();

  const handleGetMenuCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/menu-categories/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data) {

        setMenuCategoryList(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleGetMenu = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/menu-items/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        setMenuList(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetMenuCategory();
    handleGetMenu();
  }, []);


  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Left Panel - Menu Items */}
      <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r overflow-hidden">
        {/* Search and Categories */}
        <div className="p-2 md:p-4 border-b">
          <div className="relative mb-2 md:mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 md:h-4 md:w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 md:pl-10 text-xs md:text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-0">
            {menuCategoryList.map((category: any) => {
              // Agar category me icon field hai to use karenge, nahi to null
              const Icon = category.icon ? category.icon : null;

              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.name)}
                  className="text-xs md:text-sm flex-shrink-0"
                >
                  {Icon && <Icon className="h-3 w-3 md:h-4 md:w-4 mr-1" />}
                  {category.name} {/* real data ka name show hoga */}
                </Button>
              );
            })}
          </div>

        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-auto p-2 md:p-4">
          <div className="grid grid-cols-2 md:lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-2 md:p-4">
                  {/* <div className="text-4xl mb-2 text-center">{item.image}</div> */}
                  <img className="text-3xl md:text-4xl mb-2 text-center rounded-lg w-full h-16 md:h-20 object-cover" src={item.image} alt={item.name} />
                  <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2 hidden md:block">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-xs md:text-sm">${item.price}</span>
                    <Button size="sm" onClick={() => addToCart(item)} className="h-6 w-6 md:h-8 md:w-8 p-0">
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart and Checkout */}
      <div className="flex-1 md:w-80 flex flex-col bg-muted/10">
        {/* Cart Header */}
        <div className="p-2 md:p-4 border-b">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold flex items-center">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Current Order
            </h2>
            <Badge variant="secondary" className="text-xs md:text-sm">{cart.length} items</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs md:text-sm text-muted-foreground">Table</label>
              <Input
                placeholder="Table #"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="mt-1 text-xs md:text-sm"
              />
            </div>
            <div>
              <label className="text-xs md:text-sm text-muted-foreground">Customer</label>
              <Input
                placeholder="Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 text-xs md:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-2 md:p-4">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-4 md:py-8">
              <ShoppingCart className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 md:mb-4 opacity-50" />
              <p className="text-xs md:text-sm">No items in cart</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-2 md:p-3">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <h4 className="font-medium text-xs md:text-sm line-clamp-1">{item.name}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-5 w-5 md:h-6 md:w-6 p-0"
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-muted-foreground">${item.price}</span>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-6 w-6 md:h-8 md:w-8 p-0"
                        >
                          <Minus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <span className="text-xs md:text-sm font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(item)}
                          className="h-6 w-6 md:h-8 md:w-8 p-0"
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary and Payment */}
        {cart.length > 0 && (
          <div className="p-2 md:p-4 border-t">
            {/* Discount */}
            <div className="mb-2 md:mb-4">
              <label className="text-xs md:text-sm text-muted-foreground">Discount %</label>
              <Input
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="mt-1 text-xs md:text-sm"
                min="0"
                max="100"
              />
            </div>

            {/* Totals */}
            <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
              <div className="flex justify-between text-xs md:text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs md:text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs md:text-sm">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base md:text-lg border-t pt-1 md:pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-2">
              <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 md:h-4 md:w-4 mr-2" />
                    Process Payment
                  </Button>
                </DialogTrigger>
                 <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center">Select Payment Method</DialogTitle>
                    <DialogDescription className="text-center">
                      Choose how the customer wants to pay
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                    
                    {/* Cash */}
                    <div
                      onClick={() => setPaymentMethod('cash')}
                      className="cursor-pointer border rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-green-500 hover:bg-green-50 transition"
                    >
                      <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                      <span className="font-medium text-sm">Cash</span>
                    </div>

                    {/* Card */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className="cursor-pointer border rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      <span className="font-medium text-sm">Card</span>
                    </div>

                    {/* UPI */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className="cursor-pointer border rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-purple-500 hover:bg-purple-50 transition"
                    >
                      <QrCode className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                      <span className="font-medium text-sm">UPI</span>
                    </div>

                    {/* Wallet */}
                    <div
                      onClick={() => setPaymentMethod('wallet')}
                      className="cursor-pointer border rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-orange-500 hover:bg-orange-50 transition"
                    >
                      <Wallet className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                      <span className="font-medium text-sm">Wallet</span>
                    </div>

                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={processPayment}
                      disabled={paymentMethod === ''}
                      variant="outline"
                      className="w-full sm:w-auto bg-orange-500 text-white"
                    >
                      Submit
                    </Button>
                  </div>
                </DialogContent>

              </Dialog>

              <Button variant="outline" onClick={clearCart} className="w-full">
                <Trash2 className="h-4 w-4 md:h-4 md:w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSSystem;