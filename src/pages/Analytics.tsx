import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  Clock,
  BarChart3,
  PieChart,
  Download
} from "lucide-react";

export default function Analytics() {
  const stats = {
    revenue: {
      current: 24780,
      previous: 21650,
      change: 14.4
    },
    orders: {
      current: 456,
      previous: 412,
      change: 10.7
    },
    customers: {
      current: 1248,
      previous: 1156,
      change: 8.0
    },
    avgOrderValue: {
      current: 54.30,
      previous: 52.55,
      change: 3.3
    }
  };

  const topDishes = [
    { name: "Grilled Salmon", orders: 89, revenue: 2580, trend: "up" },
    { name: "Pasta Carbonara", orders: 76, revenue: 1900, trend: "up" },
    { name: "Caesar Salad", orders: 65, revenue: 1105, trend: "down" },
    { name: "Chocolate Cake", orders: 54, revenue: 702, trend: "up" },
    { name: "Wagyu Burger", orders: 32, revenue: 1056, trend: "up" }
  ];

  const hourlyData = [
    { hour: "11:00", orders: 12, revenue: 650 },
    { hour: "12:00", orders: 28, revenue: 1520 },
    { hour: "13:00", orders: 45, revenue: 2430 },
    { hour: "14:00", orders: 32, revenue: 1740 },
    { hour: "15:00", orders: 18, revenue: 970 },
    { hour: "16:00", orders: 15, revenue: 810 },
    { hour: "17:00", orders: 22, revenue: 1190 },
    { hour: "18:00", orders: 56, revenue: 3030 },
    { hour: "19:00", orders: 68, revenue: 3680 },
    { hour: "20:00", orders: 71, revenue: 3840 },
    { hour: "21:00", orders: 52, revenue: 2810 },
    { hour: "22:00", orders: 29, revenue: 1570 }
  ];

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return {
      isPositive,
      text: `${isPositive ? '+' : ''}${change.toFixed(1)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-100' : 'bg-red-100'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Restaurant Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Comprehensive insights into your restaurant performance</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary">${stats.revenue.current.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {(() => {
                      const change = formatChange(stats.revenue.change);
                      const Icon = change.icon;
                      return (
                        <div className={`flex items-center space-x-1 ${change.color}`}>
                          <Icon className="w-3 h-3" />
                          <span className="text-xs font-medium">{change.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.orders.current}</p>
                  <div className="flex items-center mt-1">
                    {(() => {
                      const change = formatChange(stats.orders.change);
                      const Icon = change.icon;
                      return (
                        <div className={`flex items-center space-x-1 ${change.color}`}>
                          <Icon className="w-3 h-3" />
                          <span className="text-xs font-medium">{change.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Customers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.customers.current}</p>
                  <div className="flex items-center mt-1">
                    {(() => {
                      const change = formatChange(stats.customers.change);
                      const Icon = change.icon;
                      return (
                        <div className={`flex items-center space-x-1 ${change.color}`}>
                          <Icon className="w-3 h-3" />
                          <span className="text-xs font-medium">{change.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-3xl font-bold text-purple-600">${stats.avgOrderValue.current}</p>
                  <div className="flex items-center mt-1">
                    {(() => {
                      const change = formatChange(stats.avgOrderValue.change);
                      const Icon = change.icon;
                      return (
                        <div className={`flex items-center space-x-1 ${change.color}`}>
                          <Icon className="w-3 h-3" />
                          <span className="text-xs font-medium">{change.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Hourly Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hourlyData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-muted-foreground font-medium">
                      {data.hour}
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                          style={{ width: `${(data.orders / 80) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium min-w-[60px]">
                        {data.orders} orders
                      </div>
                      <div className="text-sm text-muted-foreground min-w-[80px]">
                        ${data.revenue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Dishes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-primary" />
                <span>Top Performing Dishes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDishes.map((dish, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{dish.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={dish.trend === "up" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {dish.trend === "up" ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {dish.trend}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{dish.orders} orders</span>
                        <span className="font-medium text-primary">${dish.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lunch Rush</span>
                  <span className="font-medium">12:00 PM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Dinner Rush</span>
                  <span className="font-medium">7:00 PM - 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Busiest Day</span>
                  <span className="font-medium">Saturday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Customer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Repeat Customers</span>
                  <span className="font-medium text-green-600">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Visit Duration</span>
                  <span className="font-medium">1h 15m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Customer Rating</span>
                  <span className="font-medium text-yellow-600">4.7/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Operational Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Prep Time</span>
                  <span className="font-medium">18 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Table Turnover</span>
                  <span className="font-medium">3.2x/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Kitchen Efficiency</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}