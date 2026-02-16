import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Menu,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Sparkles,
  BarChart3,
  IndianRupee,
} from "lucide-react";
// import SystemAlerts from "../systemalerts/alerts";
import { BookingsList } from "../hotel/BookingsList";
import Dashboardlive from "./Dashboardlive";
import { useNavigate } from "react-router-dom";

interface DashboardOverviewProps {
  setActiveView: (view: string) => void;
}

export const DashboardOverview = ({ setActiveView }: DashboardOverviewProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardSummary, setDashboardSummary] = useState<any>([]);
  const [recentActivities, setRecentActivities] = useState<any>([]);
  const [todaySummary, setTodaySummary] = useState<any>({});


  const accessToken = localStorage.getItem('accessToken');

  const kpiMeta: Record<string, any> = {
    revenue: { title: "Today's Revenue", icon: IndianRupee, color: "text-emerald-600", bgColor: "bg-gradient-to-br from-emerald-50 to-green-50", borderColor: "border-emerald-200/50" },
    room_occupancy: { title: "Room Occupancy", icon: Calendar, color: "text-blue-600", bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50", borderColor: "border-blue-200/50" },
    active_orders: { title: "Active Orders", icon: Menu, color: "text-purple-600", bgColor: "bg-gradient-to-br from-purple-50 to-pink-50", borderColor: "border-purple-200/50" },
    total_guests: { title: "Total Guests", icon: Users, color: "text-orange-600", bgColor: "bg-gradient-to-br from-orange-50 to-amber-50", borderColor: "border-orange-200/50" },
  };

  // Transform backend data into array with icon, trend, etc.
  const transformKpiData = (data: any) => {
    return Object.keys(data).map((key) => {
      const value = data[key].value;
      const growth = data[key].growth;

      // Determine trend based on growth value
      let trend: "up" | "down" = "up";
      if (growth.includes("-") || Number(value) === 0) trend = "down";

      return {
        key,
        title: kpiMeta[key].title,
        value,
        change: growth,
        icon: kpiMeta[key].icon,
        color: kpiMeta[key].color,
        bgColor: kpiMeta[key].bgColor,
        borderColor: kpiMeta[key].borderColor,
        trend,
      };
    });
  };


  const handleGetDashboardSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/dashboard/stats-cards/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardSummary(transformKpiData(data));
        console.log("Dashboard Summary Data:", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetRecentActivities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/dashboard/recent-activities/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecentActivities(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetTodaySummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/dashboard/today-summary/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTodaySummary(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetDashboardSummary();
    handleGetRecentActivities();
    handleGetTodaySummary();
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate()


  return (
    <>
      <div className="space-y-6 lg:space-y-8">


        {/* KPI Cards - Mobile Responsive Grid */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {dashboardSummary.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={index}
                className={`hover:shadow-lg transition-all duration-500 cursor-pointer border-2 ${kpi.borderColor} ${kpi.bgColor} group hover:scale-105 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-2 relative z-10 space-y-4">
                  {/* Icon + Value */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-1 rounded-sm ${kpi.bgColor} border-2 ${kpi.borderColor} shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <Icon className={`w-6 h-6 lg:w-5 lg:h-5 ${kpi.color}`} />
                    </div>
                    <p className="text-xl lg:text-1xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                  </div>

                  {/* Title + Change */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {kpi.title}
                    </p>
                    <div className="flex items-center space-x-1">
                      {/* Show arrow only if change is not '0%' */}
                      {kpi.change !== "0%" && (
                        kpi.trend === "up" ? (
                          <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                        )
                      )}
                      <Badge
                        variant="secondary"
                        className={`${kpi.trend === "up"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-red-100 text-red-800 border-red-200"
                          } font-semibold text-xs lg:text-sm px-2 lg:px-3 py-1`}
                      >
                        {kpi.change}
                      </Badge>
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3">
                <div className="p-1 bg-blue-100 rounded-sm">
                  <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <span className="text-xl">Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 lg:space-y-4">


                <Button
                  className="w-full justify-start h-10 lg:h-12 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-sm lg:text-base font-semibold"
                  variant="outline"
                  onClick={() => setActiveView("bookings")}
                >
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 mr-3 lg:mr-4" />
                  New Booking
                </Button>
                <Button
                  className="w-full justify-start h-10 lg:h-12 text-sm lg:text-base font-semibold"
                  variant="outline"
                  onClick={() => navigate("/RestaurantManagement")}
                >
                  <Menu className="w-5 h-5 lg:w-6 lg:h-6 mr-3 lg:mr-4" />
                  Add Order
                </Button>
                <Button
                  className="w-full justify-start h-10 lg:h-12 text-sm lg:text-base font-semibold"
                  variant="outline"
                  onClick={() => navigate("/checkin")}
                >
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 mr-3 lg:mr-4" />
                  Check In Guest
                </Button>
                <Button
                  className="w-full justify-start h-10 lg:h-12 text-sm lg:text-base font-semibold"
                  variant="outline"
                  onClick={() => navigate("/reports")}
                >
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 mr-3 lg:mr-4" />
                  View Reports
                </Button>
                <Button
                  className="w-full justify-start h-10 lg:h-12 text-sm lg:text-base font-semibold"
                  variant="outline"
                  onClick={() => setActiveView("roles")}
                >
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 mr-3 lg:mr-4" />
                  Role Permission
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3">
                <div className="p-1 bg-purple-100 rounded-sm">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <span className="text-xl">Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 lg:space-y-5">
                {recentActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 lg:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-102 gap-3 sm:gap-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base">
                        {activity.description}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 font-medium">
                        {activity.time_ago}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${activity.priority === "high"
                        ? "bg-red-100 text-red-800 border-red-200 rounded-sm"
                        : activity.priority === "medium"
                          ? "bg-amber-100 text-amber-800 border-amber-200 rounded-sm"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200 rounded-sm"
                        } font-semibold text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-1 whitespace-nowrap`}
                    >
                      {activity.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Summary - Mobile Responsive */}
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="pb-4 lg:pb-4">
            <CardTitle className="text-xl lg:text-2xl font-bold flex items-center space-x-2 lg:space-x-3">
              <div className="p-1 bg-green-100 rounded-xl">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <span className="text-xl">Today's Summary</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-sm border-2 border-blue-200/50 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">
                  Check-ins
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {todaySummary.check_ins ?? 0}
                </p>
              </div>

              <div className="p-2 bg-gradient-to-br from-emerald-50 to-green-50 rounded-sm border-2 border-emerald-200/50 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <p className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wide">
                  Check-outs
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  {todaySummary.check_outs ?? 0}
                </p>
              </div>

              <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-sm border-2 border-purple-200/50 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <p className="text-xs font-bold text-purple-600 mb-1 uppercase tracking-wide">
                  Food Orders
                </p>
                <p className="text-lg font-bold text-purple-700">
                  {todaySummary.food_orders ?? 0}
                </p>
              </div>

              <div className="p-2 bg-gradient-to-br from-orange-50 to-amber-50 rounded-sm border-2 border-orange-200/50 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">
                  Revenue
                </p>
                <p className="text-lg font-bold text-orange-700">
                  ${todaySummary.revenue ?? 0}
                </p>
              </div>
            </div>
          </CardContent>

        </Card>
      </div>


    </>
  );
};
