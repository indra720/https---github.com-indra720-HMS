import { useState, useEffect, useRef } from "react";
import { DynIcon } from "../ui/DynIcon";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";

import {
  Wrench, Plus, AlertTriangle, CheckCircle, Clock, Calendar as CalendarIcon,
  MapPin, User, Zap, Droplets, Thermometer, Wifi, Camera, Building,
  XCircle,
  FileText,
  Boxes,
  ChevronDown,
  LucideIcon,
  Tag,
  List, Pencil
} from "lucide-react";
import Spinner from "../ui/Spinner";
import { FaSignLanguage } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface Dashboard {
  total_tasks: number,
  completed_tasks: number,
  in_progress_tasks: number,
  urgent_tasks: number
}



interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignedTo: string;
  location: string;
  type: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
}
interface Tasks {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  assigned_to_name: string;
  location_name: string;
  category_name: string;
  due_date: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
}

interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  status: "clean" | "maintenance" | "occupied" | "dirty";
  lastCleaned: string;
  nextMaintenance: string;
  issues: string[];
}
interface RoomStatus {
  room_number: string;
  room_slug: string;
  floor: string;
  category: string;
  slug: "";
  status: "maintenance" | "clean" | "available";
  last_cleaned: string;
  next_cleaning: string;
  active_issues: string[];
}


export const MaintenanceModule = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const { toast } = useToast();
  const [loadingSave, setLoadingSave] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const accessToken = localStorage.getItem("accessToken") || "";
  const dropdownRef = useRef(null);
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [search, setSearch] = useState("");
  const [openIcon, setOpenIcon] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isEquipment, setIsEquipment] = useState(false);
  const [AllCategories, setAllCategories] = useState<any[]>([]);
  const [AllMembers, setAllMembers] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loadingItem, setLoadingItem] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [roomsStatus, setRoomsStatus] = useState<RoomStatus[]>([]);
  const [allTasks, setAllTasks] = useState<Tasks[]>([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [reports, setReports] = useState<any>({});
  const [viewTask, setViewTask] = useState(null);
  console.log(" viewTask:", viewTask);

  const [loadedTabs, setLoadedTabs] = useState({
    tasks: false,
    rooms: false,
    schedule: false,
    reports: false,
  });
  const STATUS_FLOW = ["pending", "in_progress", "completed"];

  const [dashboardSummary, setDashboardSummary] = useState<Dashboard>({
    total_tasks: 0,
    completed_tasks: 0,
    in_progress_tasks: 0,
    urgent_tasks: 0,
  });

  const [allEquipments, setAllEquipments] = useState([]);
  const [task, setTask] = useState({
    category: "",
    location_type: "",
    title: "",
    description: "",
    priority: "",
    assigned_to: "",
    due_date: "",
    facility: "",
    equipment: "",
    slug: ""
  });

  const iconNames = Object.keys(Icons)
    .filter((key) => {
      const value = (Icons as any)[key];
      // Sirf real React components (function + renderable as SVG)
      return typeof value === "function" &&
        value.toString().includes("svg") ||
        key.match(/^[A-Z][a-zA-Z]*$/) &&
        !["icons", "Icon", "createLucideIcon", "default"].includes(key);
    })
    .sort();



  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(timer);
  }, [search]);

  const [addFacility, setAddFacility] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    console.log(selectedIcon)
  }, [selectedIcon])

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "location_type") {
      setTask((prev) => ({
        ...prev,
        location_type: value,
        equipment: value === "facility" ? "" : prev.equipment,
        facility: value === "equipment" ? "" : prev.facility,
      }));
    } else {
      setTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (!open) {
      setTask({
        category: "",
        location_type: "",
        title: "",
        description: "",
        priority: "",
        assigned_to: "",
        due_date: "",
        facility: "",
        equipment: "",
        slug: ""
      })
      setOpenEdit(false)
    }
  }, [open])

  const handleEditTask = async (task) => {
    console.log(" Editing task:", task);
    if (task) {
      setTask({
        category: task?.category,
        location_type: task?.location_type,
        title: task?.title,
        description: task?.description,
        priority: task?.priority,
        assigned_to: task?.assigned_to,
        due_date: task?.due_date,
        facility: task?.facility,
        equipment: task?.equipment,
        slug: task?.slug
      })
      setOpenEdit(true); setOpen(true)
    }
  }


  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenDropdown(false);
    }
  }



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "in_progress":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "completed":
        return "bg-green-500 text-white hover:bg-green-600";
      default:
        return "";
    }
  };


  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "clean": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-red-100 text-red-800";
      case "occupied": return "bg-blue-100 text-blue-800";
      case "dirty": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  useEffect(() => {
    if (!facilityOpen) {
      setAddFacility({
        name: "",
        description: ""
      });
      setIsEquipment(false)
      setIsCategory(false)
      setSelectedIcon("");
      setSearch("")
      setOpenIcon(false)
      setDebouncedSearch("")
    }
  }, [facilityOpen])

  const getDashboardSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/tasks/dashboard/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setDashboardSummary(data);
      console.log(" dashboard  data:", data);
      if (response.ok) {
        console.log("Fetched dashboard:", data);
      } else {
        throw new Error(`Failed to get dashboard: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting summary:", error);
    }
  }

  const getAllCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/categories/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllCategories(data);
      console.log(" categories  data:", data);
      if (response.ok) {
        console.log("Fetched categories:", data);
      } else {
        throw new Error(`Failed to get categories: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting categories:", error);
    }
  }

  const getAllMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/staff/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllMembers(data);
      console.log(" members  data:", data);
      if (response.ok) {
        console.log("Fetched members:", data);
      } else {
        throw new Error(`Failed to get members: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting members:", error);
    }
  }



  const getAllFacilities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/facilities/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllFacilities(data);
      console.log(" facilities  data:", data);
      if (response.ok) {
        console.log("Fetched facilities:", data);
      } else {
        throw new Error(`Failed to get facilities: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting facilities:", error);
    }
  }
  const getAllEquipments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/equipment/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllEquipments(data);
      console.log(" equipments  data:", data);
      if (response.ok) {
        console.log("Fetched equipments:", data);
      } else {
        throw new Error(`Failed to get equipments: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting equipments:", error);
    }
  }
  const getTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/tasks/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAllTasks(data);
      console.log(" tasks  data:", data);
      if (response.ok) {
        console.log("Fetched tasks:", data);
      } else {
        throw new Error(`Failed to get tasks: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting tasks:", error);
    }
  }
  const getRoomStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/room-status/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setRoomsStatus(data);
      console.log(" room-status  data:", data);
      if (response.ok) {
        console.log("Fetched room-status :", data);
      } else {
        throw new Error(`Failed to get room-status: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting room-status:", error);
    }
  }

  const getReports = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/reports/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReports(data);
      if (response.ok) {
      } else {
        throw new Error(`Failed to get room-status: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting room-status:", error);
    }
  }



  useEffect(() => {
    const fetchData = async () => {
      // If data for this tab is already loaded, do not fetch again
      if (loadedTabs[activeTab]) return;

      try {
        switch (activeTab) {
          case "tasks":
            console.log("Fetching tasks...");
            await [

              getDashboardSummary(),
              getTasks(),
              getAllCategories(),
              getAllFacilities(),
              getAllEquipments(),
              getAllMembers()

            ];
            break;

          case "rooms":
            console.log("Fetching rooms...");
            await getRoomStatus();
            break;

          case "orders":
            console.log("Fetching schedule...");
            // await getAllPurchaseOrders();
            break;

          case "reports":
            console.log("Fetching Reports...");
            await getReports();
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

  const UpdateTask = async (slug, status) => {
    const payload = {
      status: status
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/tasks/${slug}/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(" Task Status :", data);
      if (response.ok) {
        toast({
          title: "Task Updated",
          description: "Task updated successfully.",
          className: "bg-emerald-600 text-white border-none shadow-lg"
        });
        console.log("Updated task:", data);
      } else {
        throw new Error(`Failed to Updated task: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error Updating task:", error);
    }
    getTasks();
    getRoomStatus();
  }

  const PostTask = async () => {
    console.log(" Task data to be sent:", task);

    try {
      const url = openEdit
        ? `${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/tasks/${task.slug}/`
        : `${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/tasks/`;

      const method = openEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(task),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        toast({
          title: `${openEdit ? "Task Updated" : "Task Created"}`,
          description: `${openEdit ? "Task updated successfully." : "New task created successfully."}`,
          className: "bg-emerald-600 text-white border-none shadow-lg"
        });
      } else {
        throw new Error(`API failed: ${JSON.stringify(data)}`);
      }

    } catch (error) {
      console.error("Error in task operation:", error);
    }

    getTasks();
    getRoomStatus();
    setOpen(false);
  };


  const PostFacility = async (e) => {
    e.preventDefault();
    console.log(" Short data:", addFacility);
    const endpoint = isEquipment ? "equipment" : isCategory ? "categories" : "facilities";
    const load = {
      ...addFacility,
      icon: selectedIcon
    }
    const payload = isEquipment ? addFacility : isCategory ? load : addFacility;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/${endpoint}/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(" Facility data:", data);
      if (response.ok) {
        toast({
          title: `${isEquipment ? "Equipment Created" : isCategory ? "Category Created" : "Facility Created"}`,
          description: `${isEquipment ? "New equipment created successfully." : isCategory ? "New category created successfully." : "New facility created successfully."}`,
          className: "bg-emerald-600 text-white border-none shadow-lg"
        });
        console.log("Created Facility:", data);
      } else {
        throw new Error(`Failed to post Facility: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error posting Facility:", error);
    }
    setAddFacility({
      name: "",
      description: ""
    });

    if (isEquipment) {
      await getAllEquipments();
    } else if (isCategory) {
      await getAllCategories();
    } else {
      await getAllFacilities();
    }


    setFacilityOpen(false);
  }



  const ScheduleRoom = async (room_slug) => {
    const payload = {
      room_slug: room_slug
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/maintenance/schedule-available/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert("room scheduled available successfully!");
        console.log("Created task:", data);
      } else {
        throw new Error(`Failed to scheduled available: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error scheduling :", error);
    }
    getRoomStatus();
  }


  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Tasks</p>
                <p className="text-3xl font-bold">{dashboardSummary.total_tasks}</p>
              </div>
              <Wrench className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed</p>
                <p className="text-3xl font-bold">{dashboardSummary.completed_tasks}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">In Progress</p>
                <p className="text-3xl font-bold">{dashboardSummary.in_progress_tasks}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Urgent Tasks</p>
                <p className="text-3xl font-bold">{dashboardSummary.urgent_tasks}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={`sticky top-0 ${facilityOpen ? '' : 'z-50'} grid w-full grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-0 py-0 h-16 transition-all duration-300 ${facilityOpen ? 'opacity-40 pointer-events-none blur-sm' : ''}`}
        >
          <TabsTrigger value="tasks" className="self-center">Maintenance Tasks</TabsTrigger>
          <TabsTrigger value="rooms" className="self-center">Room Status</TabsTrigger>
          <TabsTrigger value="schedule" className="self-center">Schedule</TabsTrigger>
          <TabsTrigger value="reports" className="self-center">Reports</TabsTrigger>
        </TabsList>




        <TabsContent value="tasks" className="space-y-6 mt-16">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Maintenance Tasks</h2>
              <p className="text-gray-600">Track and manage maintenance requests</p>
            </div>

            {/*  -------------------------------------------- Quick Add Dropdown ----------------------------------------------------------------------  */}

            <div className="relative" onClick={handleClickOutside}>
              {/* ADD NEW BUTTON */}
              <button
                className="flex items-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-6 rounded-xl hover:bg-blue-700 shadow transition-all duration-200 select-none pl-8"  // ← Yeh add kiya
                style={{ width: "190px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown((prev) => !prev);
                }}
              >
                {/* Icon Container */}
                <div className="relative w-5 h-5">
                  <Plus
                    size={20}
                    className="absolute inset-0 transition-all duration-300 ease-in-out"
                    style={{
                      opacity: openDropdown ? 0 : 1,
                      transform: openDropdown ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)",
                    }}
                  />
                  <ChevronDown
                    size={20}
                    className="absolute inset-0 transition-all duration-300 ease-in-out"
                    style={{
                      opacity: openDropdown ? 1 : 0,
                      transform: openDropdown ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
                    }}
                  />
                </div>

                <span>Quick Add</span>
              </button>

              {/*  --------------------------------- Dropdown Options ---------------------------------------------------------------------------------- */}

              {openDropdown && (
                <div
                  ref={dropdownRef}
                  className="
    absolute left-0 mt-2 rounded-xl p-3 
    backdrop-blur-lg bg-white/20 
    border border-white/30 shadow-2xl 
    z-30
  "
                  style={{
                    width: "190px",
                    animation: `${openDropdown ? "slideDown 0.35s ease-out forwards" : "slideUp 0.32s ease-in forwards"}`,
                    animationFillMode: "forwards",
                  } as React.CSSProperties}
                  onClick={(e) => e.stopPropagation()}
                  onAnimationEnd={() => {
                    if (!openDropdown) setOpenDropdown(false);
                  }}
                >
                  <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(-12px); }
          }
        `}</style>

                  <button
                    onClick={() => {
                      setOpenDropdown(false)
                      setOpen(true)

                    }}
                    className="w-full flex items-center gap-2 bg-[#787A91] hover:bg-[#8f91a8] text-white font-medium py-2 px-3 rounded-lg transition-all mb-2 shadow">
                    <Wrench size={18} />
                    Add Task
                  </button>
                  <button onClick={() => {
                    setOpenDropdown(false)
                    setFacilityOpen(true)

                  }} className="w-full flex items-center gap-2 bg-[#787A91] hover:bg-[#8f91a8] text-white font-medium py-2 px-3 rounded-lg transition-all mb-2 shadow">
                    <FileText size={18} />
                    Add Facility
                  </button>
                  <button
                    onClick={() => {
                      setIsEquipment(true)
                      setOpenDropdown(false)
                      setFacilityOpen(true)
                    }}
                    className="w-full flex items-center gap-2 bg-[#787A91] hover:bg-[#8f91a8] text-white font-medium py-2 px-3 rounded-lg transition-all mb-2 shadow">
                    <Boxes size={18} />
                    Add Equipment
                  </button>
                  <button
                    onClick={() => {
                      setIsCategory(true)
                      setOpenDropdown(false)
                      setFacilityOpen(true)
                    }}
                    className="w-full flex items-center gap-2 bg-[#787A91] hover:bg-[#8f91a8] text-white font-medium py-2 px-3 rounded-lg transition-all shadow">
                    <List size={18} />
                    Add Category
                  </button>
                </div>
              )}
            </div>

            {/* ----------------------------------------------- Facility and Equipment Add Form ------------------------------------------------------------------- */}

            <>
              {/* Overlay */}
              {facilityOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
                  onClick={() => setFacilityOpen(false)}
                ></div>
              )}

              {/* Drawer Panel */}
              <div
                className="fixed inset-0 z-50 flex justify-end items-center pointer-events-none"
                style={{
                  visibility: facilityOpen ? 'visible' : 'hidden',
                }}
              >
                <div
                  className={`
          bg-white shadow-xl w-[380px] max-h-[400px] pointer-events-auto
          rounded-tl-3xl rounded-bl-3xl
          `}
                  style={{
                    transform: facilityOpen ? 'translateX(0)' : 'translateX(100%)',
                    opacity: facilityOpen ? 1 : 0,
                    transition: 'transform 300ms ease-out 50ms, opacity 300ms ease-out 50ms',
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setFacilityOpen(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
                  >
                    <XCircle />
                  </button>

                  {/* Drawer Content */}
                  <div className="p-6 space-y-5 mt-8">

                    {/* --- Facility Name Field (Input 1) --- */}
                    <div className="space-y-1">
                      <label htmlFor="facility-name" className="text-sm font-medium text-gray-700 flex items-center">
                        <Tag className="w-4 h-4 mr-1 text-gray-500" />
                        {isEquipment ? "Equipment" : isCategory ? "Category" : "Facility"} Name
                      </label>
                      <input
                        id="facility-name"
                        name="name"
                        value={addFacility.name}
                        onChange={(e) =>
                          setAddFacility({ ...addFacility, name: e.target.value })
                        }
                        type="text"
                        placeholder="e.g., Swimming Pool, Gym"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* -------------------------------------- Icon Selector --------------------------------------------------------------------------- */}

                    {/* ---------------- Icon Option ------------------------- */}
                    {isCategory && (
                      <div className="relative w-64">
                        <button
                          type="button"
                          onClick={() => setOpenIcon(!openIcon)}
                          className="flex w-full items-center justify-between rounded-lg border px-4 py-2 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-2">
                            {selectedIcon ? (
                              <>
                                {React.createElement((Icons as any)[selectedIcon], { size: 18 })}
                                <span>{selectedIcon}</span>
                              </>
                            ) : (
                              <span className="text-gray-500">Select icon</span>
                            )}
                          </div>
                          <ChevronDown className={`h-4 w-4 transition ${openIcon ? "rotate-180" : ""}`} />
                        </button>

                        {openIcon && (
                          <div className="absolute top-full z-50 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-hidden">
                            <Input
                              placeholder="Search icon..."
                              value={search}
                              onChange={(e) => {
                                setSearch(e.target.value)

                              }}
                              className="border-0 border-none outline-none focus-visible:ring-0"
                              autoFocus
                            />

                            <div className="max-h-80 overflow-y-auto py-1">

                              {/* --------------- Searching Loader ------------------- */}
                              {search !== "" && debouncedSearch !== search && (
                                <div className="px-4 py-3 text-sm text-gray-600">
                                  Searching...
                                </div>
                              )}

                              {/* Agar type kiya hai aur debounce complete ho gaya → filtered results dikhao */}
                              {search !== "" && debouncedSearch === search && (
                                <>
                                  {iconNames
                                    .filter((name) => name.toLowerCase().includes(debouncedSearch.toLowerCase()))
                                    .map((name) => {
                                      const Icon = (Icons as any)[name];
                                      return (
                                        <div
                                          key={name}
                                          onClick={() => {
                                            setSelectedIcon(name);
                                            setOpenIcon(false);
                                            setSearch("");
                                          }}
                                          className={`flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 ${selectedIcon === name ? "bg-blue-50" : ""}`}
                                        >
                                          <Icon size={18} />
                                          <span className="text-sm">{name}</span>
                                        </div>
                                      );
                                    })}

                                  {/* ------------- If Icons No Found --------------- */}
                                  {iconNames.filter(n => n.toLowerCase().includes(debouncedSearch.toLowerCase())).length === 0 && (
                                    <div className="px-4 py-3 text-sm text-gray-500">No icons found</div>
                                  )}
                                </>
                              )}

                              {/* ------------- If value is Empty Show 30 Icons Only ------------- */}

                              {search === "" && (
                                <>
                                  {iconNames.slice(0, 30).map((name) => {
                                    const Icon = (Icons as any)[name];
                                    return (
                                      <div
                                        key={name}
                                        onClick={() => {
                                          setSelectedIcon(name);
                                          setOpenIcon(false);
                                          setSearch("");
                                        }}
                                        className={`flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 ${selectedIcon === name ? "bg-blue-50" : ""}`}
                                      >
                                        <Icon size={18} />
                                        <span className="text-sm">{name}</span>
                                      </div>
                                    );
                                  })}
                                  <div className="px-4 py-3 text-xs text-gray-500 border-t">
                                    Start typing to search {iconNames.length}+ icons
                                  </div>
                                </>
                              )}

                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ------------------------------ Icon Selector End ---------------------------------------------------------------------------------------- */}


                    {/* --- Facility Description Field (Input 2) --- */}
                    <div className="space-y-1">
                      <label htmlFor="facility-description" className="text-sm font-medium text-gray-700 flex items-center">
                        <FileText className="w-4 h-4 mr-1 text-gray-500" />
                        {isEquipment ? "Equipment" : isCategory ? "Category" : "Facility"} Description
                      </label>
                      <input
                        id="facility-description"
                        name="description"
                        type="text"
                        value={addFacility.description}
                        onChange={(e) =>
                          setAddFacility({ ...addFacility, description: e.target.value })
                        }
                        placeholder="Detailed description of the facility"
                        required
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>


                    <button
                      type="submit"
                      onClick={async (e) => {
                        setLoadingSave(true);
                        await PostFacility(e);
                        setLoadingSave(false);
                      }}
                      disabled={loadingSave}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center relative"
                    >
                      {/* Button text — always occupies space */}
                      <span className={loadingSave ? "opacity-0" : ""}>
                        Add {isEquipment ? "Equipment" : "Facility"}
                      </span>

                      {loadingSave && (
                        <div className="absolute">
                          <Spinner />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>


            {/* -------------------------------------- Add Task Form--------------------------------------------- */}



            {open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative"> {/* reduced width */}
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    <XCircle />
                  </button>

                  {/* Form */}
                  <form
                    className="grid grid-cols-2 gap-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setLoadingItem(true);
                        await PostTask();
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setLoadingItem(false);
                      }
                    }}
                  >

                    {/* Category */}
                    <div className={`space-y-1.5 ${openEdit ? "col-span-2" : ""}`}>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={task.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        required
                      >
                        <option value="">Select Category</option>
                        {AllCategories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Type - Hidden in Edit Mode */}
                    {!openEdit && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Location Type</label>
                        <select
                          name="location_type"
                          value={task.location_type}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                          required={!openEdit}
                        >
                          <option value="">Select Location</option>
                          <option value="facility">Facility</option>
                          <option value="equipment">Equipment</option>
                        </select>
                      </div>
                    )}

                    {/* Due Date */}
                    <div className={`space-y-1.5 ${openEdit ? "col-span-2" : ""}`}>
                      <label className="text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="date"
                        name="due_date"
                        value={task.due_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        required
                      />
                    </div>

                    {/* Reminder - Hidden in Edit Mode */}
                    {!openEdit && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Reminder</label>
                        <select
                          name="reminder"
                          value={task.location_type === "facility" ? task.facility : task.equipment}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (task.location_type === "facility") {
                              setTask(prev => ({ ...prev, facility: value }));
                            } else if (task.location_type === "equipment") {
                              setTask(prev => ({ ...prev, equipment: value }));
                            }
                          }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                          disabled={task.location_type === ""}
                          required={!openEdit}
                        >
                          <option value="">No Reminder</option>
                          {(task.location_type === "facility" ? allFacilities : allEquipments).map((item) => (
                            <option key={item.slug} value={item.slug}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none text-sm"
                        rows={2}
                        required
                      />
                    </div>

                    {/* Priority */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <select
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        required
                      >
                        <option value="">Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Assigned To */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Assigned To</label>
                      <select
                        name="assigned_to"
                        value={task.assigned_to}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl 
      focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                        required
                      >
                        <option value="">Select Member</option>
                        {AllMembers.map((member) => (
                          <option key={member.slug} value={member.slug}>
                            {member.user_full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Submit */}
                    <div className="col-span-2 pt-3">
                      <button
                        type="submit"
                        disabled={loadingItem}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl 
      transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed 
      disabled:hover:scale-[1.00] flex items-center justify-center"
                      >
                        {loadingItem ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                        ) : (
                          openEdit ? "Update Task" : "Add Task"
                        )}
                      </button>
                    </div>

                  </form>

                </div>
              </div>
            )}

          </div>

          {/* ------------------------------------------------------ All Maintenance Tasks Card --------------------------------------------------------------- */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTasks.map((task) => {
              return (
                <Card key={task.slug} className="hover:shadow-lg transition-all duration-300">

                  <div className="relative">
                    <button
                      onClick={() => { handleEditTask(task) }}
                      className="
        absolute top-2 right-2 z-20
        bg-white shadow p-1 rounded-full
        hover:bg-gray-100
        transition duration-200
      "
                    >
                      <Pencil className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DynIcon name={task.icon} className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.category_name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <DropdownMenu onOpenChange={(open) => setIsOpened(open)}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              className={`${getStatusColor(task.status)} flex items-center gap-2`}
                              disabled={task.status === "completed"}
                            >
                              {task.status}

                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${isOpened ? "rotate-180" : "rotate-0"
                                  }`}
                              />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent>
                            {STATUS_FLOW.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                className="
                                bg-white             
                                text-gray-700        
                                px-3 py-2            
                                rounded-md           
                                shadow-sm            
                                hover:bg-gray-100    
                                cursor-pointer       
                                font-medium          
                              "
                                onClick={() => UpdateTask(task.slug, status)}
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>

                        </DropdownMenu>

                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{task.location_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{task.assigned_to_name || "No Name"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span>Due: {task.due_date || "No Date"}</span>
                        </div>
                      </div>

                      {task.status === "in_progress" && task.actualHours && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{task.actualHours}h / {task.estimatedHours}h</span>
                          </div>
                          <Progress value={(task.actualHours / task.estimatedHours) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        {task.status === "pending" && (
                          <Button size="sm" className="flex-1" onClick={() => { UpdateTask(task?.slug, "in_progress") }}>Start</Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button size="sm" className="flex-1" onClick={() => { UpdateTask(task?.slug, "completed") }}>Complete</Button>
                        )}
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewTask(task)}>View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {viewTask && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">

                {/* Close Button */}
                <button
                  onClick={() => setViewTask(null)}
                  className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                >
                  ✕
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DynIcon name={viewTask.icon_name} className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{viewTask.title}</h2>
                    <p className="text-sm text-gray-600">{viewTask.category_name}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600 mt-1">{viewTask.description}</p>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                  {/* Assigned To */}
                  <div>
                    <p className="text-gray-500">Assigned To:</p>
                    <p className="font-medium">{viewTask.assigned_to_name || "N/A"}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-gray-500">Status:</p>
                    <Badge className={getStatusColor(viewTask.status)}>
                      {viewTask.status}
                    </Badge>
                  </div>

                  {/* Priority */}
                  <div>
                    <p className="text-gray-500">Priority:</p>
                    <Badge className={getPriorityColor(viewTask.priority)}>
                      {viewTask.priority}
                    </Badge>
                  </div>

                  {/* Due Date */}
                  <div>
                    <p className="text-gray-500">Due Date:</p>
                    <p className="font-medium">{viewTask.due_date}</p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-gray-500">Location:</p>
                    <p className="font-medium">{viewTask.location_name}</p>
                  </div>

                  {/* Location Type */}
                  <div>
                    <p className="text-gray-500">Location Type:</p>
                    <p className="font-medium capitalize">{viewTask.location_type}</p>
                  </div>

                  {/* Room Number if exists */}
                  {viewTask.room_number && (
                    <div>
                      <p className="text-gray-500">Room Number:</p>
                      <p className="font-medium">{viewTask.room_number}</p>
                    </div>
                  )}

                  {/* Guest Name if exists */}
                  {viewTask.guest_name && (
                    <div>
                      <p className="text-gray-500">Guest Name:</p>
                      <p className="font-medium">{viewTask.guest_name}</p>
                    </div>
                  )}

                  {/* Created By */}
                  <div>
                    <p className="text-gray-500">Created By:</p>
                    <p className="font-medium">{viewTask.created_by_name}</p>
                  </div>

                  {/* Created At */}
                  <div>
                    <p className="text-gray-500">Created At:</p>
                    <p className="font-medium">
                      {new Date(viewTask.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Updated At */}
                  <div>
                    <p className="text-gray-500">Updated At:</p>
                    <p className="font-medium">
                      {new Date(viewTask.updated_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Hotel */}
                  <div>
                    <p className="text-gray-500">Hotel:</p>
                    <p className="font-medium capitalize">{viewTask.hotel_name}</p>
                  </div>

                </div>

                {/* Notes */}
                {viewTask.location_note && viewTask.location_note.trim() !== "" && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-700">Notes</h3>
                    <p className="text-gray-600 mt-1">{viewTask.location_note}</p>
                  </div>
                )}

                {/* Progress (only if in-progress) */}
                {viewTask.status === "in_progress" && viewTask.actualHours && (
                  <div className="mt-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{viewTask.actualHours}h / {viewTask.estimatedHours}h</span>
                    </div>
                    <Progress
                      value={(viewTask.actualHours / viewTask.estimatedHours) * 100}
                      className="h-2"
                    />
                  </div>
                )}

              </div>
            </div>
          )}



        </TabsContent>

        {/* ----------------------------------------------------------------- Room Status Tab ------------------------------------------------------------------ */}

        <TabsContent value="rooms" className="space-y-6 mt-16">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Room Status</h2>
              <p className="text-gray-600">Monitor room conditions and maintenance schedules</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Camera className="w-4 h-4 mr-2" />
              Room Inspection
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsStatus.map((room) => (
              <Card key={room.slug} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Room {room.room_number}</h3>
                        <p className="text-sm text-gray-600">Floor {room.floor} • {room.category}</p>
                      </div>
                    </div>
                    <Badge className={getRoomStatusColor(room.status)}>
                      {room.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last cleaned:</span>
                        <span>{room.last_cleaned || "No Date"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next maintenance:</span>
                        <span>{room.next_cleaning || "No Date"}</span>
                      </div>
                    </div>

                    {room.active_issues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-red-600">Active Issues:</p>
                        <div className="space-y-1">
                          {room.active_issues.map((issue, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-gray-700">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      {room.status === "clean" && (
                        <Button
                          onClick={() => ScheduleRoom(room.room_slug)}
                          size="sm" variant="outline" className="flex-1">
                          Schedule Available
                        </Button>
                      )}

                      <Button size="sm" variant="outline" className="flex-1">
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* -------------------------------------------------------------- Maintenance Schedule Tab --------------------------------------------------------------- */}

        <TabsContent value="schedule" className="space-y-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Maintenance Schedule
              </CardTitle>
              <CardDescription>Plan and track maintenance activities</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ---------------------- CALENDAR ---------------------- */}
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                {/* ---------------------- TASKS FOR SELECTED DATE ---------------------- */}
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Today's"} Schedule
                  </h3>

                  {allTasks
                    .filter(task => {
                      const taskDate = new Date(task.due_date).toDateString();
                      const compareDate = selectedDate ? selectedDate.toDateString() : new Date().toDateString();
                      return taskDate === compareDate;
                    })
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-gray-50 rounded-lg h-24 flex flex-col justify-between" // height बढ़ाई, padding बढ़ाई
                      >
                        <div className="flex flex-col gap-1"> {/* text के बीच gap */}
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600">
                            {task.location_name} • {task.assigned_to_name || "Unassigned"}
                          </p>
                        </div>
                        <div className="self-end">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                  {allTasks.filter(task => {
                    const taskDate = new Date(task.due_date).toDateString();
                    const compareDate = selectedDate ? selectedDate.toDateString() : new Date().toDateString();
                    return taskDate === compareDate;
                  }).length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No tasks scheduled for this date
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* ---------------------------------------------- Maintenance Reports ---------------------------------------------------------------------- */}

        <TabsContent value="reports" className="space-y-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Reports</CardTitle>
              <CardDescription>Analyze maintenance performance and trends</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ---------------------- STATUS DISTRIBUTION ---------------------- */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Task Status Distribution</h3>

                  {reports?.by_status?.map((item) => {
                    const percentage = (item.count / reports.summary.total) * 100;

                    return (
                      <div key={item.status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">
                            {item.status.replace("_", " ")}
                          </span>
                          <span>
                            {item.count} tasks ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                {/* ---------------------- PRIORITY BREAKDOWN ---------------------- */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Priority Breakdown</h3>

                  {reports?.by_priority?.map((item) => {
                    const percentage = (item.count / reports.summary.total) * 100;

                    return (
                      <div key={item.priority} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{item.priority}</span>
                          <span>
                            {item.count} tasks ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};