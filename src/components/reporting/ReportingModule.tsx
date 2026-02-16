import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, Download, Share, Calendar as CalendarIcon, 
  BarChart3, PieChart, TrendingUp, Clock, Filter,
  Mail, Printer, Eye, RefreshCw
} from "lucide-react";

export const ReportingModule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const reportTemplates = [
    {
      name: "Financial Performance",
      description: "Revenue, expenses, and profit analysis",
      category: "Finance",
      frequency: "Monthly",
      lastGenerated: "2024-01-15",
      status: "ready"
    },
    {
      name: "Occupancy Report",
      description: "Room occupancy rates and trends",
      category: "Operations",
      frequency: "Weekly",
      lastGenerated: "2024-01-14",
      status: "ready"
    },
    {
      name: "Guest Satisfaction",
      description: "Reviews and feedback analysis",
      category: "Guest Services",
      frequency: "Monthly",
      lastGenerated: "2024-01-10",
      status: "generating"
    },
    {
      name: "Staff Performance",
      description: "Employee productivity and KPIs",
      category: "HR",
      frequency: "Monthly",
      lastGenerated: "2024-01-12",
      status: "ready"
    },
    {
      name: "Marketing ROI",
      description: "Campaign effectiveness and conversion rates",
      category: "Marketing",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      status: "outdated"
    }
  ];

  const scheduledReports = [
    {
      name: "Daily Operations Summary",
      recipients: ["manager@hotel.com", "ops@hotel.com"],
      schedule: "Daily at 9:00 AM",
      nextRun: "Tomorrow 9:00 AM",
      status: "active"
    },
    {
      name: "Weekly Revenue Report",
      recipients: ["finance@hotel.com", "ceo@hotel.com"],
      schedule: "Every Monday at 8:00 AM",
      nextRun: "Mon 8:00 AM",
      status: "active"
    },
    {
      name: "Monthly Guest Analysis",
      recipients: ["marketing@hotel.com"],
      schedule: "1st of every month",
      nextRun: "Feb 1st",
      status: "paused"
    }
  ];

  const quickStats = [
    { label: "Reports Generated", value: "1,248", change: "+12%" },
    { label: "Automated Reports", value: "34", change: "+5%" },
    { label: "Export Downloads", value: "892", change: "+18%" },
    { label: "Shared Reports", value: "156", change: "+25%" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-100 text-green-800";
      case "generating": return "bg-blue-100 text-blue-800";
      case "outdated": return "bg-orange-100 text-orange-800";
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Reporting & Analytics
          </h1>
          <p className="text-muted-foreground">Generate insights and track business performance</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{template.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{template.frequency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Generated:</span>
                      <span className="font-medium">{template.lastGenerated}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Automated Report Schedule</h3>
            <Button>
              <Clock className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>

          <div className="space-y-4">
            {scheduledReports.map((report, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{report.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Recipients: {report.recipients.join(", ")}
                      </p>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule:</p>
                      <p className="font-medium">{report.schedule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Run:</p>
                      <p className="font-medium">{report.nextRun}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Edit Recipients
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="w-4 h-4 mr-2" />
                      Edit Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      {report.status === "active" ? "Pause" : "Resume"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Custom Report Builder
              </CardTitle>
              <CardDescription>Create custom reports with your specific metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Data Sources</h4>
                  <div className="space-y-2">
                    {["Revenue Data", "Occupancy Rates", "Guest Reviews", "Staff Performance", "Marketing Metrics"].map((source) => (
                      <label key={source} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Chart Types</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Bar Chart
                    </Button>
                    <Button variant="outline" size="sm">
                      <PieChart className="w-4 h-4 mr-2" />
                      Pie Chart
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Line Chart
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Table
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};