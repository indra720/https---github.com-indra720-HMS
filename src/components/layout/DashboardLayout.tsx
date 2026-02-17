import { ReactNode, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Icons from "lucide-react";
import { defaultNavigationItems } from "./defaultNavigation";
// import { AlertCircle, LogOutIcon, SettingsIcon, Home, Calendar, Users, Menu, BarChart3, Bell, TrendingUp, UserCheck, Shirt, FileText, CreditCard, Calculator, Activity, Star, Send, Building, User, Package, Wrench, PartyPopper, Headphones, ChevronsLeft, ChevronsRight, Hotel } from "lucide-react";
import {
    AlertCircle,
    LogOutIcon,
    SettingsIcon,
    Home,
    Calendar,
    Users,
    Menu,
    Hotel,
    BarChart3,
    Bell,
    TrendingUp,
    UserCheck,
    Shirt,
    FileText,
    CreditCard,
    Calculator,
    Activity,
    Star,
    Send,
    Building,
    User,
    Package,
    Wrench,
    PartyPopper,
    Headphones,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import Dashboardlive from "@/components/dashboard/Dashboardlive";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
    children: ReactNode;
    activeView: string;
    setActiveView: (view: string) => void;
}

const LOGOUT_API_URL = ` ${import.meta.env.VITE_API_BACKEND_URL}/api/logout/`

export const DashboardLayout = ({
    children,
    activeView,
    setActiveView,
}: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sidenbarButtons, setSidenbarButtons] = useState([
        { order: 1, route: "dashboard", label: "Dashboard", icon: "Home" },
        { order: 2, route: "new-hotel", label: "Add Hotel", icon: "Hotel" },
        { order: 3, route: "hotel", label: "Hotel", icon: "Building" },
        { order: 4, route: "restaurant", label: "Restaurant", icon: "UtensilsCrossed" },
        { order: 5, route: "staff", label: "Staff", icon: "Users" },
        { order: 6, route: "inventory", label: "Inventory", icon: "Package" },
        { order: 7, route: "maintenance", label: "Maintenance", icon: "Wrench" },
        { order: 8, route: "events", label: "Events", icon: "Calendar" },
        { order: 9, route: "crm", label: "CRM", icon: "UserCheck" },
        { order: 10, route: "billing", label: "Billing", icon: "CreditCard" }
    ])
    // --- Dynamic User State ---
    const [userName, setUserName] = useState("Guest");
    const { toast } = useToast();

    // --- Load User Name on Component Mount ---
    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                const userData = JSON.parse(userString);
                // 'full_name' or 'fullName' key को प्राथमिकता दें, नहीं तो email का हिस्सा दिखाएँ।
                const nameToDisplay = userData.full_name || userData.fullName || userData.email?.split('@')[0] || "User";
                setUserName(nameToDisplay);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                setUserName("Error User");
            }
        }
    }, []);

    // --- LOGOUT FUNCTION ---
    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        // 1. Local Tokens Removal (Security First)

        // 2. API Call to Invalidate Token
        console.log(refreshToken);
        if (refreshToken) {
            try {
                const response = await fetch(LOGOUT_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`, },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                // const data = await response.json();
                console.log(response);
                if (response.status === 205) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');

                    toast({ title: "Logout Successful", description: "You have been securely logged out.", });

                    // 3. Redirect to Login
                    window.location.href = "/login";
                }


            } catch (error) {
                // Network error
                console.log("Network Error:", error);
            }
        }


    };
    // -------------------------

    const handleSidebarButtons = async () => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/sidebar-apps/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`, // include token
                },
            });
            const data = await response.json();
            if (data) {
                setSidenbarButtons(Array.isArray(data) ? data : []);
            }
        }

        catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        handleSidebarButtons();
    }, []);
    // const navigationItems = [
    //   { id: "dashboard", label: "Dashboard", icon: Home },
    //   { id: "new-hotel", label: "Add Hotel", icon: Hotel },
    //   { id: "hotel", label: "Hotel", icon: Calendar },
    //   { id: "restaurant", label: "Restaurant", icon: Menu },
    //   { id: "staff", label: "Staff", icon: Users },
    //   { id: "inventory", label: "Inventory", icon: Package },
    //   { id: "maintenance", label: "Maintenance", icon: Wrench },
    //   { id: "events", label: "Events", icon: PartyPopper },
    //   { id: "guest-services", label: "Guest Services", icon: Headphones },
    //   { id: "crm", label: "CRM", icon: UserCheck },
    //   { id: "laundry", label: "Laundry", icon: Shirt },
    //   { id: "cms", label: "CMS", icon: FileText },
    //   { id: "billing", label: "Billing", icon: CreditCard },
    //   { id: "accounting", label: "Accounting", icon: Calculator },
    //   { id: "marketing", label: "Marketing", icon: TrendingUp },
    //   { id: "analytics", label: "Analytics", icon: BarChart3 },
    //   { id: "activities", label: "Activities", icon: Activity },
    //   { id: "reviews", label: "Reviews", icon: Star },
    //   { id: "communications", label: "Communications", icon: Send },
    //   { id: "pos", label: "POS System", icon: Calculator },
    //   // { id: "settings", label: "Settings", icon: Settings },
    // ];

    const alerts = [
        { id: 1, message: "Low inventory: Towels (12 remaining)", type: "warning" },
        { id: 2, message: "Kitchen equipment maintenance due", type: "info" },
        { id: 3, message: "Payment gateway offline", type: "error" },
    ];

    const user = JSON.parse(localStorage.getItem('user'));

    const MobileNavContent = () => (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white">
            {/* ... Header/Logo (unchanged) ... */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Building className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            Hotel
                        </h1>
                        <p className="text-blue-300 text-sm font-medium">
                            Management System
                        </p>
                    </div>
                </div>
            </div>


            <ScrollArea className="flex-1 p-4">
                <nav className="space-y-2">
                   {sidenbarButtons.filter((item) => {
    const role = user?.role;

    // new-hotel: sirf superAdmin (null) ya Customer
    if (
        item.route === "new-hotel" &&
        !(role === null || role === "Customer")
    ) {
        return false;
    }

    return true;
})
                        .map((item) => {
                            // const Icon = item.icon;
                            const Icon = Icons[item.icon] || Icons.HelpCircle;
                            const isActive = activeView === item.route;

                            return (
                                <Button
                                    key={item.order}
                                    variant="ghost"
                                    className={`w-full justify-start h-12 px-4 rounded-xl transition-all duration-300 text-left ${isActive
                                        ? "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                                        }`}
                                    onClick={() => {
                                        setActiveView(item.route);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    <Icon
                                        className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-blue-300"
                                            }`}
                                    />
                                    <span className="font-medium">{item.label}</span>
                                </Button>
                            );
                        })}
                </nav>
            </ScrollArea>



            <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-3 text-blue-200 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        {/* Mobile User Name */}
                        <p className="text-sm font-semibold text-white">{userName}</p>
                        <p className="text-xs">Online</p>
                    </div>
                </div>

                {/* Mobile Logout Button */}
                <Button
                    variant="ghost"
                    className="w-full justify-start h-12 px-4 rounded-xl transition-all duration-300 text-left bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleLogout}
                >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
                <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10">
                    <div className="px-2 sm:px-4 py-0 sm:py-1">

                        {/* ✅ Mobile: row layout  | ✅ Desktop: same as before */}
                        <div className="flex flex-row flex-wrap sm:flex-row items-center justify-between gap-2">

                            {/* --- Logo Section --- */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Building className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                                        Hotel
                                    </h1>
                                    <p className="text-blue-200 text-xs font-medium hidden sm:block">
                                        Management System
                                    </p>
                                </div>
                            </div>

                            {/* --- User Info & Actions --- */}
                            <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">

                                {/* ✅ Welcome Section (Desktop Only) */}
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-semibold text-white">Welcome</p>
                                    <p className="text-xs text-blue-200">
                                        {new Date().toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>

                                {/* 🔔 Bell Icon */}
                                <div className="relative group">
                                    <button className="relative bg-white/10 border border-white/20 text-white p-2 rounded-md hover:bg-white/20">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>
                                    {/* Alert Dropdown (unchanged) */}
                                    <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                                        <div className="p-3 border-b font-semibold text-sm flex items-center space-x-2 text-amber-800">
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                            <span> System Alerts ({alerts.length})</span>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {alerts.map((alert) => (
                                                <div
                                                    key={alert.id}
                                                    className={`px-4 py-3 text-sm border-b last:border-none rounded-lg m-2 ${alert.type === "error"
                                                        ? "bg-red-50 text-red-800"
                                                        : alert.type === "warning"
                                                            ? "bg-yellow-50 text-yellow-800"
                                                            : "bg-blue-50 text-blue-800"
                                                        }`}
                                                >
                                                    {alert.message}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 👤 User Section (Desktop only) */}
                                <div
                                    className="relative hidden sm:block"
                                    onMouseEnter={(e) =>
                                        e.currentTarget
                                            .querySelector(".dropdown")
                                            ?.classList.remove("invisible", "opacity-0")
                                    }
                                    onMouseLeave={(e) =>
                                        e.currentTarget
                                            .querySelector(".dropdown")
                                            ?.classList.add("invisible", "opacity-0")
                                    }
                                >
                                    <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 cursor-pointer">
                                        <User className="w-4 h-4 text-blue-200" />
                                        <span className="text-sm font-medium">{userName}</span>
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    </div>

                                    <div className="dropdown invisible opacity-0 transition-all duration-200 absolute right-0 top-full mt-2 bg-white text-black rounded-lg shadow-lg p-4 w-40 z-50 space-y-2">
                                        <div className="border-b-2">
                                            <p className="flex gap-1 text-sm text-blue-500 font-semibold">
                                                Welcome, {userName}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 w-full text-left px-3 py-1 text-gray-400 hover:text-gray-600">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full text-left px-3 py-1 text-gray-400 hover:text-gray-600"
                                            onClick={() => setActiveView("settings")}
                                        >
                                            <SettingsIcon className="w-4 h-4" />
                                            Settings
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full text-left px-3 py-1 text-red-600 hover:underline hover:text-red-700"
                                            onClick={handleLogout}
                                        >
                                            <LogOutIcon className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>

                                {/* 📱 Mobile Menu Toggle */}
                                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="md:hidden bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        >
                                            <Menu className="w-4 h-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="p-0 w-80">
                                        <MobileNavContent />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Navigation (unchanged) */}
                <div
                    className={`fixed left-0 top-18 z-30 hidden md:block ${isExpanded ? "md:w-56" : "md:w-16"
                        } transition-all duration-300`}
                >
                    <div className="bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 shadow-xl border-r border-white/10 h-[calc(100vh-5rem)]">
                        <ScrollArea className="h-full">
                            <nav className="p-2 space-y-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-12 h-12 p-0 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    title="Toggle Sidebar"
                                >
                                    {isExpanded ? (
                                        <ChevronsLeft className="w-5 h-5 text-blue-300" />
                                    ) : (
                                        <ChevronsRight className="w-5 h-5 text-blue-300" />
                                    )}
                                </Button>

                                {sidenbarButtons.filter((item) => {
                                    if (item.route === "new-hotel" && user?.email !== "ak@gmail.com" && user?.role === null) {
                                        return false;
                                    }
                                    if (item.route === "hotel" && user?.email === "ak@gmail.com" && user?.role === null) {
                                        return false;
                                    }
                                    return true;
                                })
                                    .map((item) => {
                                        const Icon = Icons[item.icon] || Icons.HelpCircle;
                                        const isActive = activeView === item.route;

                                        return (
                                            <Button
                                                key={item.order}
                                                variant="ghost"
                                                size="sm"
                                                // **MODIFICATION:** px-2 को px-4 में बदला (आइकन को right शिफ्ट करने के लिए) और justify-start जोड़ा
                                                className={`w-12 md:w-full h-12 px-4 rounded-lg flex items-center justify-start ${isActive
                                                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                                                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                onClick={() => setActiveView(item.route)}
                                                title={item.label}
                                            >
                                                {/* ICON CONTAINER: w-8 (fixed width) और flex/items-center रखा गया। mr-2 हटा दिया गया क्योंकि px-4 पैडिंग अब स्पेस दे रही है। */}
                                                <div className={`${isExpanded ? "w-8" : "w-full flex justify-center"} flex items-center transition-all duration-300`}>
                                                    <Icon
                                                        className={`w-5 h-5 ${isActive ? "text-white" : "text-blue-300"
                                                            }`}
                                                    />
                                                </div>
                                                {/* Label (only visible when expanded) */}
                                                {isExpanded && <span className="text-left flex-1 truncate">{item.label}</span>}
                                            </Button>
                                        );
                                    })}
                            </nav>
                        </ScrollArea>
                    </div>
                </div>
            </header>

            {/* Main Content (unchanged) */}
            <main
                className={`min-h-screen md:ml-16 relative z-10 ${isExpanded ? "md:ml-56" : "md:ml-16"
                    } transition-all duration-300`}
            >
                {activeView === "dashboard" && (
                    <div className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/50 mx-8 mt-4 rounded-md">
                        <div className="px-2 sm:px-4 md:px-8 py-2">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                                        {getPageTitle(activeView)}
                                    </h2>
                                    <p className="text-gray-600 text-xs sm:text-sm mt-1 font-medium">
                                        {getPageDescription(activeView)}
                                    </p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <Dashboardlive />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-2 sm:p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
};

// ... Helper functions (getPageTitle, getPageDescription)
const getPageTitle = (activeView: string) => {
    const titles = {
        dashboard: "Dashboard Overview",
        hotel: "Hotel Management",
        restaurant: "Restaurant Management",
        staff: "Staff Management",
        inventory: "Inventory Management",
        maintenance: "Maintenance & Housekeeping",
        events: "Event Management",
        "guest-services": "Guest Services",
        crm: "Customer Relationship Management",
        laundry: "Laundry Management",
        cms: "Content Management System",
        billing: "Billing & Invoicing",
        accounting: "Accounting & Finance",
        marketing: "Marketing Hub",
        analytics: "Analytics & Reports",
        activities: "Real-time Activities",
        reviews: "Reviews & Ratings",
        communications: "Communications Center",
        pos: "POS System",
        settings: "System Settings",
    };
    return titles[activeView as keyof typeof titles] || "Management";
};

const getPageDescription = (activeView: string) => {
    const descriptions = {
        dashboard: "Overview of all hotel operations and key metrics",
        hotel: "Manage rooms, bookings, and hotel services",
        restaurant: "Handle dining reservations and restaurant operations",
        staff: "Manage employees, schedules, and performance",
        inventory: "Track stock levels, suppliers, and procurement",
        maintenance: "Facility maintenance and housekeeping operations",
        events: "Organize conferences, banquets, and special events",
        "guest-services": "Concierge services and guest experience",
        crm: "Manage customer relationships and profiles",
        laundry: "Track and manage laundry services",
        cms: "Manage website content and information",
        billing: "Handle invoicing and payment processing",
        accounting: "Financial management and reporting",
        marketing: "Online & offline marketing campaigns",
        analytics: "Business insights and data analysis",
        activities: "Monitor real-time system activities",
        reviews: "Reviews & Ratings",
        communications: "Email, WhatsApp, and SMS communications",
        pos: "Point of Sale system for restaurant orders",
        settings: "System configuration and preferences",
    };

    return (
        descriptions[activeView as keyof typeof descriptions] ||
        "Manage your operations"
    );
};