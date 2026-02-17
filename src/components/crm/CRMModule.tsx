
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, Search, Plus, Mail, Phone, MapPin, Calendar,
  TrendingUp, Award, Heart, UserCheck, Star, Clock,
  Filter, Download, Upload, Eye, Edit, Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { truncateSync } from "fs";
import { FaUser, FaStar, FaUsers, FaCrown, FaQuestion } from "react-icons/fa";

const iconMap: Record<string, any> = {
  active_monthly: FaUser,
  satisfaction: FaStar,
  total_customers: FaUsers,
  vip_customers: FaCrown,
};

export const CRMModule = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const accessToken = localStorage.getItem('accessToken');
  const [customersList, setCustomersList] = useState<any>([])
  const [recentActivitiesList, setRecentActivitiesList] = useState<any>([])
  const [dashboardSummary, setDashboardSummary] = useState<any>([])
  const [customerOpenForm, setCustomerOpenForm] = useState(false)
  const [customerEditForm, setCustomerEditForm] = useState(false)
  const [isExcel, setIsExcel] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    customer_type: "regular",
    preferences: "",
    status: "active",
    last_visit: "",
    feedback: "",
  });

  const [customerEditData, setCustomerEditData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    customer_type: "regular",
    preferences: "",
    status: "active",
    last_visit: "",
    feedback: "",
    slug: ""
  });

  const crmStats = [
    { title: "Total Customers", value: "2,847", change: "+12%", icon: Users, color: "blue" },
    { title: "VIP Customers", value: "247", change: "+8%", icon: Award, color: "purple" },
    { title: "Active This Month", value: "1,234", change: "+15%", icon: UserCheck, color: "green" },
    { title: "Customer Satisfaction", value: "4.8/5", change: "+0.2", icon: Star, color: "yellow" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setCustomerEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetCustomers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setCustomersList(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }


  const handleRecentActivity = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/recent-activities/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        setRecentActivitiesList(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleAddCustomer = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(customerData)
      });
      const data = await response.json();
      if (response.status === 201) {
        alert("Customer Added Successfully")
        setCustomerOpenForm(false)
        handleGetCustomers();
        setCustomerData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          customer_type: "regular",
          preferences: "",
          status: "active",
          last_visit: "",
          feedback: "",
        }
        )
      }
    }
    catch (error) {
      console.error(error);
    }
  }


  const handleEditCustomer = (customer) => {
    console.log(customer);
    setCustomerEditData({
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: customer?.city || "",
      country: customer?.country || "",
      customer_type: customer?.customer_type || "regular",
      preferences: customer?.preferences || "",
      status: customer?.status || "active",
      last_visit: customer?.last_visit || "",
      feedback: customer?.feedback || "",
      slug: customer?.slug
    });

    setCustomerEditForm(true);
  };


  const handleUpdateCustomer = async () => {
    if (!customerEditData?.slug) {
      alert("Please select a customer first.")
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/${customerEditData?.slug}/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(customerEditData)
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Customer Update Successfully")
        setCustomerEditForm(false)
        handleGetCustomers();
        setCustomerEditData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          customer_type: "regular",
          preferences: "",
          status: "active",
          last_visit: "",
          feedback: "",
          slug: "",
        }
        )
      }
    }
    catch (error) {
      console.error(error);
    }
  };



  const handleImportCustomerExcel = async () => {
    try {
      // 1️⃣ Prepare data as array of objects
      const exportData = Array.isArray(customerData) ? customerData : [customerData];

      // 2️⃣ Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // 3️⃣ Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      // 4️⃣ Convert workbook to binary string
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // 5️⃣ Convert to Blob for sending to backend
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // 6️⃣ Send to backend
      const formData = new FormData();
      formData.append("file", blob, "customers.xlsx");

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/import/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // Excel file sent as form-data
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "success") {
        alert("Customer Excel Imported Successfully");
        setCustomerOpenForm(false);
        setIsExcel(false);
        handleGetCustomers();
        setCustomerData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          customer_type: "regular",
          preferences: "",
          status: "active",
          last_visit: "",
          feedback: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };


  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  };

  const handleSubmit = async () => {
    if (isExcel) {
      await handleImportCustomerExcel();
    } else {
      await handleAddCustomer();
    }
  };

  const handleExportCustomer = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/export/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      window.open(url);
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleGetCustomersSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/customers/summary/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        // convert object to array
        const summaryArray = Object.keys(data).map(key => ({
          key,
          ...data[key]
        }));
        setDashboardSummary(summaryArray);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetCustomers();
    handleRecentActivity();
    handleGetCustomersSummary();
  }, [])

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Customer Relationship Management</h2>
          <p className="text-gray-600 text-sm mt-1">Comprehensive customer data and relationship tracking</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => { handleExportCustomer() }}>
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => { setCustomerOpenForm(true); setIsExcel(true) }}>
            <Upload className="w-3 h-3 mr-1" />
            Import
          </Button>
          <Button size="sm" onClick={() => { setCustomerOpenForm(true); setIsExcel(false) }} className="bg-gradient-to-r from-blue-600 to-purple-600 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {dashboardSummary.map((stat: any, index: number) => {
          // Correct color mapping
          const colorMap: Record<string, string> = {
            active_monthly: "blue",
            satisfaction: "green",
            total_customers: "purple",
            vip_customers: "yellow",
          };

          // Correct icon mapping
          const iconMap: Record<string, any> = {
            active_monthly: FaUser,
            satisfaction: FaStar,
            total_customers: FaUsers,
            vip_customers: FaCrown,
          };

          const DefaultIcon = FaQuestion;
          const Icon = iconMap[stat.key] || DefaultIcon;
          const color = colorMap[stat.key] || "gray";
          const formatTitle = (key: string) => {
            return key
              .split("_")                  // ["active", "monthly"]
              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // ["Active", "Monthly"]
              .join(" ");                  // "Active Monthly"
          };

          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">{formatTitle(stat.key)}</p>
                    <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${stat.trend_direction === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {stat.trend}%
                    </Badge>
                  </div>
                  <div className={`p-2 rounded-lg bg-${color}-100`}>
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              className="pl-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add Customer Modal */}

      <Dialog open={customerOpenForm} onOpenChange={setCustomerOpenForm}>
        <DialogContent
          className="
      w-full 
      max-w-md          /* SMALLER FORM WIDTH */
       max-h-fit        /* HEIGHT AUTO */
    overflow-y-visible
      rounded-lg 
      p-4 
      backdrop-blur-md
    "
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isExcel ? "Import Excel" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            {/* ROW 1 — Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Name *</label>
                <Input
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Email *</label>
                <Input
                  name="email"
                  value={customerData.email}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ROW 2 — Phone + Address */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Phone *</label>
                <Input
                  name="phone"
                  value={customerData.phone}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Address</label>
                <Input
                  name="address"
                  value={customerData.address}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ROW 3 — City + Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">City</label>
                <Input
                  name="city"
                  value={customerData.city}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Country</label>
                <Input
                  name="country"
                  value={customerData.country}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ROW 4 — Customer Type + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Customer Type</label>
                <select
                  name="customer_type"
                  value={customerData.customer_type}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">Status</label>
                <select
                  name="status"
                  value={customerData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* ROW 5 — Preferences + Last Visit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Preferences</label>
                <Input
                  name="preferences"
                  value={customerData.preferences}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Last Visit</label>
                <Input
                  type="datetime-local"
                  name="last_visit"
                  value={formatDateTimeLocal(customerData.last_visit)}
                  onChange={handleChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* FEEDBACK (full width, no change) */}
            <div>
              <label className="text-xs font-medium">Feedback</label>
              <textarea
                name="feedback"
                value={customerData.feedback}
                onChange={handleChange}
                className="w-full text-sm border rounded-md px-3 py-2 resize-none"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm py-2"
            >
              {isExcel ? "Import Excel" : "Add Customer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>




      <Dialog open={customerEditForm} onOpenChange={setCustomerEditForm}>
        <DialogContent
          className="
      w-full 
      max-w-md          /* SMALLER FORM WIDTH */
       max-h-fit        /* HEIGHT AUTO */
    overflow-y-visible
      rounded-lg 
      p-4 
      backdrop-blur-md
    "
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Update Customer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            {/* ROW 1 — Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Name *</label>
                <Input
                  name="name"
                  value={customerEditData.name}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Email *</label>
                <Input
                  name="email"
                  value={customerEditData.email}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ROW 2 — Phone + Address */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Phone *</label>
                <Input
                  name="phone"
                  value={customerEditData.phone}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Address</label>
                <Input
                  name="address"
                  value={customerEditData.address}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ROW 3 — City + Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">City</label>
                <Input
                  name="city"
                  value={customerEditData.city}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Country</label>
                <Input
                  name="country"
                  value={customerEditData.country}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* ROW 4 — Customer Type + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Customer Type</label>
                <select
                  name="customer_type"
                  value={customerEditData.customer_type}
                  onChange={handleEditChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">Status</label>
                <select
                  name="status"
                  value={customerEditData.status}
                  onChange={handleEditChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* ROW 5 — Preferences + Last Visit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">Preferences</label>
                <Input
                  name="preferences"
                  value={customerEditData.preferences}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Last Visit</label>
                <Input
                  type="datetime-local"
                  name="last_visit"
                  value={formatDateTimeLocal(customerEditData.last_visit)}
                  onChange={handleEditChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* FEEDBACK (full width, no change) */}
            <div>
              <label className="text-xs font-medium">Feedback</label>
              <textarea
                name="feedback"
                value={customerEditData.feedback}
                onChange={handleEditChange}
                className="w-full text-sm border rounded-md px-3 py-2 resize-none"
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpdateCustomer}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm py-2"
            >
              Updte Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Compute and render displayed customers (search + filter) */}
      {
        (() => {
          const normalizedSearch = (searchTerm || "").trim().toLowerCase();
          const bySearch = normalizedSearch
            ? customersList.filter((c: any) => (c?.name || "").toLowerCase().includes(normalizedSearch))
            : customersList;

          const byStatus = filterStatus && filterStatus !== "all"
            ? bySearch.filter((c: any) => {
                if (filterStatus === "vip") return c?.customer_type === "vip";
                return c?.status === filterStatus;
              })
            : bySearch;

          const displayedCustomers = byStatus;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedCustomers.map((customer: any) => (
                <Card
                  key={customer.id}
                  className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
                >
                  <CardContent className="p-4">

                    {/* TOP SECTION */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {customer.name ? customer.name.charAt(0).toUpperCase() : "?"}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">{customer.name.charAt(0).toUpperCase() + customer.name.slice(1)}</h3>

                          <Badge
                            className={`text-xs ${customer.customer_type === "vip"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1) || "Regular"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { handleEditCustomer(customer) }}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{customer.email}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate"> {customer.address || "—"}, {customer.city || "—"}, {customer.country || "—"}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>Last visit: {customer.last_visit || "Not visited yet"}</span>
                      </div>
                    </div>

                    {/* METRICS */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-sm font-bold text-blue-600">
                            {customer.total_bookings_count}
                          </p>
                          <p className="text-xs text-gray-600">Bookings</p>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-green-600">
                            {customer.total_spent_amount}
                          </p>
                          <p className="text-xs text-gray-600">Spent</p>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-purple-600">
                            {customer.loyalty_points}
                          </p>
                          <p className="text-xs text-gray-600">Points</p>
                        </div>
                      </div>
                    </div>

                    {/* PREFERENCES */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-1">Preferences:</p>

                      <div className="flex flex-wrap gap-1">
                        {customer.preferences ? (
                          <>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700"
                            >
                              {customer.preferences}
                            </Badge>
                          </>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            None
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })()
      }


      {/* Customer Journey Timeline */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Clock className="w-5 h-5" />
            <span>Recent Customer Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { customer: "John Smith", action: "Checked in to Premium Suite", time: "2 mins ago", type: "checkin" },
              { customer: "Sarah Johnson", action: "Made restaurant reservation", time: "15 mins ago", type: "booking" },
              { customer: "Mike Wilson", action: "Left 5-star review", time: "1 hour ago", type: "review" },
              { customer: "Emma Davis", action: "Updated profile preferences", time: "2 hours ago", type: "update" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'checkin' ? 'bg-green-100 text-green-600' :
                  activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                  }`}>
                  {activity.type === 'checkin' ? <UserCheck className="w-4 h-4" /> :
                    activity.type === 'booking' ? <Calendar className="w-4 h-4" /> :
                      activity.type === 'review' ? <Star className="w-4 h-4" /> :
                        <Edit className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.customer}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Clock className="w-5 h-5" />
            <span>Recent Customer Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivitiesList.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.icon === 'checkin' ? 'bg-green-100 text-green-600' :
                      activity.icon === 'booking' ? 'bg-blue-100 text-blue-600' :
                        activity.icon === 'food' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-purple-100 text-purple-600'
                    }`}
                >
                  {activity.icon === 'checkin' ? <UserCheck className="w-4 h-4" /> :
                    activity.icon === 'booking' ? <Calendar className="w-4 h-4" /> :
                      activity.icon === 'food' ? <Star className="w-4 h-4" /> :
                        <Edit className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.customer_name}</p>
                  <p className="text-xs text-gray-600">{activity.action_text || activity.model || "—"}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time_ago}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
