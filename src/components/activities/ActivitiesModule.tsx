
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, Clock, User, Bell, FileText, 
  CheckCircle, AlertTriangle, Info, Download
} from "lucide-react";

export const ActivitiesModule = () => {
  const activities = [
    {
      id: 1,
      type: "booking",
      title: "New Booking Created",
      description: "Room 205 booked by Sarah Johnson",
      user: "Reception Desk",
      time: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      description: "$450 payment processed for Invoice #INV-001",
      user: "Billing System",
      time: "5 minutes ago",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 3,
      type: "maintenance",
      title: "Maintenance Request",
      description: "AC repair needed in Room 301",
      user: "Mike Wilson",
      time: "12 minutes ago",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      id: 4,
      type: "checkin",
      title: "Guest Check-in",
      description: "John Smith checked into Room 101",
      user: "Front Desk",
      time: "18 minutes ago",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 5,
      type: "order",
      title: "Restaurant Order",
      description: "Table 5 - Order #ORD-024 completed",
      user: "Kitchen Staff",
      time: "25 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 6,
      type: "system",
      title: "System Update",
      description: "Daily backup completed successfully",
      user: "System",
      time: "1 hour ago",
      icon: Info,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  const stats = [
    { label: "Today's Activities", value: 142, color: "text-blue-600" },
    { label: "Active Users", value: 28, color: "text-green-600" },
    { label: "System Alerts", value: 3, color: "text-red-600" },
    { label: "Completed Tasks", value: 89, color: "text-purple-600" }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-3 md:p-4">
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Bell className="w-4 h-4 mr-2" />
          Set Alert
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Activities Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Real-time Activities</span>
          </CardTitle>
          <CardDescription>Live system activity logs and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${activity.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.user}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs capitalize ${activity.color}`}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full sm:w-auto">
              Load More Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
