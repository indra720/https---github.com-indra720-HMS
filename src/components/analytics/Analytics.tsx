
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Menu, Settings, TrendingUp, ArrowUp, ArrowDown, Eye, DollarSign,IndianRupee, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

export const Analytics = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [customerInsight, setCustomerInsight] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<any>(null);
  const [monthlyDatas, setMonthlyDatas] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any>([]);

  const kpiTemplate = [
    { key: "monthly_revenue", title: "Monthly Revenue", icon: IndianRupee, color: "text-green-600", bgColor: "bg-gradient-to-br from-green-50 to-emerald-50", borderColor: "border-green-200/50" },
    { key: "average_occupancy", title: "Average Occupancy", icon: Calendar, color: "text-blue-600", bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50", borderColor: "border-blue-200/50" },
    { key: "restaurant_revenue", title: "Restaurant Revenue", icon: Menu, color: "text-purple-600", bgColor: "bg-gradient-to-br from-purple-50 to-pink-50", borderColor: "border-purple-200/50" },
    { key: "customer_satisfaction", title: "Customer Satisfaction", icon: Star, color: "text-orange-600", bgColor: "bg-gradient-to-br from-orange-50 to-amber-50", borderColor: "border-orange-200/50" },
  ];

  const handleGetDashboardSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/analytics/reports/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const formattedKpiData = kpiTemplate.map(kpi => {
          const item = data[kpi.key];
          return {
            ...kpi,
            value: item?.value ?? 0,
            change: item?.growth ?? "0%",
            trend: item?.growth?.startsWith("-") ? "down" : "up",
          };
        });

        setDashboardSummary(formattedKpiData);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleGetCustomerInsights = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/analytics/customers-insight/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const formattedData = {
          new_customers: { ...data.new_customers, period: "This Month" },
          returning_customers: { ...data.returning_customers, period: "Retention Rate" },
          average_stay: { ...data.average_stay, period: "Per Booking" },
          customer_lifetime_value: { ...data.customer_lifetime_value, period: "Average" },
        };

        setCustomerInsight(formattedData);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleGetTopPerformers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/analytics/top-performing/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTopPerformers(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleGetRecentActivity = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/recent-activities/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRecentActivities(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };


  const handleGetMonthsAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/analytics/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMonthlyDatas(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };




  const formatMetricName = (key: string) => {
    switch (key) {
      case "average_stay":
        return "Average Stay";
      case "customer_lifetime_value":
        return "Customer Lifetime Value";
      case "new_customers":
        return "New Customers";
      case "returning_customers":
        return "Returning Customers";
      default:
        return key;
    }
  };

  useEffect(() => { handleGetDashboardSummary(), handleGetCustomerInsights(), handleGetTopPerformers(), handleGetRecentActivity(), handleGetMonthsAnalytics() }, []);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-600 mt-2">Track performance and business insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dashboardSummary && dashboardSummary?.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className={`hover:shadow-lg transition-all duration-300 border-2 ${kpi.borderColor} ${kpi.bgColor}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-gray-600 font-medium">{kpi.title}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center space-x-1">
                      {kpi.trend === 'up' ? (
                        <ArrowUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-600" />
                      )}
                      <Badge variant="secondary" className={`text-xs ${kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {kpi.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.bgColor} border ${kpi.borderColor}`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
       
        <Card className="xl:col-span-2">
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <TrendingUp className="w-5 h-5" />
      <span>Monthly Revenue Comparison</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
    {monthlyDatas?.chart_data?.map((data: any, index: number) => {
  const maxValue = 110000; // max revenue for scale

  const hotelPercent = (data.hotel_revenue / maxValue) * 100;
  const restaurantPercent = (data.restaurant_revenue / maxValue) * 100;

  return (
    <div key={index} className="flex items-center space-x-4">
      <div className="w-12 text-sm font-medium text-gray-700">{data.month}</div>

      <div className="flex-1 relative h-6 rounded-full bg-gray-200 overflow-hidden">
        {/* Hotel bar: left se start hota hai */}
        {data.hotel_revenue > 0 && (
          <div
            className="bg-blue-600 h-full rounded-l-full"
            style={{ width: `${hotelPercent}%` }}
            title={`Hotel Revenue: ₹${data.hotel_revenue.toLocaleString()}`}
          />
        )}

        {/* Restaurant bar ka logic */}
        {data.restaurant_revenue > 0 && (
          // Agar hotel revenue bhi hai, toh restaurant bar hotel ke right side se start hoga (absolute positioning)
          data.hotel_revenue > 0 ? (
            <div
              className="bg-purple-600 h-full rounded-r-full absolute top-0"
              style={{
                width: `${restaurantPercent}%`,
                left: `${hotelPercent}%`,
              }}
              title={`Restaurant Revenue: ₹${data.restaurant_revenue.toLocaleString()}`}
            />
          ) : (
            // Agar hotel revenue 0 hai, toh restaurant bar right se align hoke dikhega (flex box use karke)
            <div
              className="bg-purple-600 h-full rounded-r-full absolute top-0 right-0"
              style={{
                width: `${restaurantPercent}%`,
              }}
              title={`Restaurant Revenue: ₹${data.restaurant_revenue.toLocaleString()}`}
            />
          )
        )}
      </div>

      <div className="w-20 text-right text-sm font-semibold text-gray-900">
        ₹{(data.hotel_revenue + data.restaurant_revenue).toLocaleString()}
      </div>
    </div>
  );
})}

      <div className="flex flex-wrap items-center justify-center space-x-4 md:space-x-6 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
          <span className="text-sm text-gray-600">Hotel Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded"></div>
          <span className="text-sm text-gray-600">Restaurant Revenue</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>


        {/* Customer Insights */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Customer Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerInsight &&
                Object.entries(customerInsight).map(([key, item]: [string, any], index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{formatMetricName(key)}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.period ?? ""}</p> {/* optional period */}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-600">{item.value}</p>
                        <Badge
                          variant="secondary"
                          className={`text-xs mt-1 ${item.growth?.startsWith("-")
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}
                        >
                          {item.growth ?? item.retention_rate ?? ""}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Top Performing Rooms</span>
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {topPerformers?.rooms?.map((room, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{room.name}</p>
                      <p className="text-sm text-gray-600">{room.bookings} bookings • {room.occupancy} occupied</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹ {room.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Menu className="w-5 h-5 text-purple-600" />
                <span>Top Menu Items</span>
              </CardTitle>
              <Button variant="outline" size="sm">View Menu</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers?.menu_items?.map((dish, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dish.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{dish.orders} orders</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹ {dish.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities?.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border">
                <div className="flex items-center space-x-3">

                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activity.status_color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.time_ago}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{activity.value || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
