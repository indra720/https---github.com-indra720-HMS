
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Mail, Phone, MapPin, Calendar, TrendingUp, Award, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CustomerManagement = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const customers = [
    {
      id: "CUST001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 234-567-8901",
      location: "New York, USA",
      totalBookings: 5,
      totalSpent: "$1,250",
      status: "VIP",
      lastVisit: "2024-01-15",
      joinDate: "2023-05-12",
      preferences: ["Ocean View", "Late Checkout"],
      loyaltyPoints: 2450
    },
    {
      id: "CUST002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 234-567-8902",
      location: "Los Angeles, USA",
      totalBookings: 3,
      totalSpent: "$750",
      status: "Regular",
      lastVisit: "2024-01-10",
      joinDate: "2023-08-20",
      preferences: ["Gym Access", "Continental Breakfast"],
      loyaltyPoints: 890
    },
    {
      id: "CUST003",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 234-567-8903",
      location: "Chicago, USA",
      totalBookings: 8,
      totalSpent: "$2,100",
      status: "VIP",
      lastVisit: "2024-01-12",
      joinDate: "2022-11-05",
      preferences: ["Business Center", "Room Service"],
      loyaltyPoints: 3200
    },
    {
      id: "CUST004",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 234-567-8904",
      location: "Miami, USA",
      totalBookings: 1,
      totalSpent: "$180",
      status: "New",
      lastVisit: "2024-01-08",
      joinDate: "2024-01-08",
      preferences: ["Pool Access"],
      loyaltyPoints: 180
    },
  ];

  const bookingHistory = [
    {
      id: "BK001",
      customer: "John Smith",
      type: "Hotel",
      room: "Deluxe Suite",
      date: "2024-01-15",
      checkOut: "2024-01-18",
      amount: "$540",
      status: "Completed",
      rating: 5,
      nights: 3
    },
    {
      id: "BK002",
      customer: "Sarah Johnson",
      type: "Restaurant",
      table: "Table 5",
      date: "2024-01-10",
      amount: "$85",
      status: "Completed",
      rating: 4,
      guests: 2
    },
    {
      id: "BK003",
      customer: "Mike Wilson",
      type: "Hotel",
      room: "Premium Room",
      date: "2024-01-12",
      checkOut: "2024-01-14",
      amount: "$320",
      status: "Completed",
      rating: 5,
      nights: 2
    },
    {
      id: "BK004",
      customer: "Emma Davis",
      type: "Restaurant",
      table: "Table 12",
      date: "2024-01-08",
      amount: "$65",
      status: "Completed",
      rating: 4,
      guests: 1
    },
  ];

  const customerStats = [
    { title: "Total Customers", value: "1,234", change: "+12%", icon: Users, color: "blue" },
    { title: "VIP Customers", value: "87", change: "+8%", icon: Award, color: "purple" },
    { title: "New This Month", value: "45", change: "+23%", icon: TrendingUp, color: "green" },
    { title: "Loyalty Members", value: "892", change: "+15%", icon: Heart, color: "pink" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Regular":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "New":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      pink: "bg-pink-100 text-pink-600"
    };
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || customer.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600 mt-1">Manage customer profiles and booking history</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {customerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-xl ${getStatColor(stat.color)}`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search customers..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "customers" ? "default" : "ghost"}
          className={activeTab === "customers" ? "bg-white shadow-sm" : ""}
          onClick={() => setActiveTab("customers")}
          size="sm"
        >
          Customer Profiles
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          className={activeTab === "history" ? "bg-white shadow-sm" : ""}
          onClick={() => setActiveTab("history")}
          size="sm"
        >
          Booking History
        </Button>
        <Button
          variant={activeTab === "analytics" ? "default" : "ghost"}
          className={activeTab === "analytics" ? "bg-white shadow-sm" : ""}
          onClick={() => setActiveTab("analytics")}
          size="sm"
        >
          Analytics
        </Button>
      </div>

      {/* Content */}
      {activeTab === "customers" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{customer.name}</h3>
                      <Badge className={`${getStatusColor(customer.status)} text-xs font-medium`}>
                        {customer.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Profile
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {customer.joinDate}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{customer.totalBookings}</p>
                      <p className="text-xs text-gray-600">Bookings</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{customer.totalSpent}</p>
                      <p className="text-xs text-gray-600">Total Spent</p>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-purple-600">{customer.loyaltyPoints}</span> loyalty points
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-600 mb-2">Preferences:</p>
                  <div className="flex flex-wrap gap-1">
                    {customer.preferences.map((pref, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingHistory.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {booking.id.slice(-2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.customer}</h3>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-sm text-gray-600">
                          <span className="font-medium">{booking.type}</span>
                          <span>
                            {booking.type === "Hotel" ? `${booking.room} • ${booking.nights} nights` : `${booking.table} • ${booking.guests} guests`}
                          </span>
                          <span>{booking.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-green-600">{booking.amount}</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-600">Rating:</span>
                          <span className="text-yellow-500 text-sm">{"★".repeat(booking.rating)}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { segment: "VIP Customers", count: 87, percentage: 7, color: "purple" },
                  { segment: "Regular Customers", count: 456, percentage: 37, color: "blue" },
                  { segment: "Occasional Visitors", count: 567, percentage: 46, color: "green" },
                  { segment: "New Customers", count: 124, percentage: 10, color: "orange" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-${item.color}-500`} />
                      <span className="font-medium">{item.segment}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.count}</p>
                      <p className="text-sm text-gray-600">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rating: "5 Stars", count: 456, percentage: 76, color: "green" },
                  { rating: "4 Stars", count: 98, percentage: 16, color: "blue" },
                  { rating: "3 Stars", count: 34, percentage: 6, color: "yellow" },
                  { rating: "2 Stars", count: 8, percentage: 1, color: "orange" },
                  { rating: "1 Star", count: 4, percentage: 1, color: "red" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium w-16">{item.rating}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-${item.color}-500 h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{item.count}</span>
                      <span className="text-sm text-gray-600 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
