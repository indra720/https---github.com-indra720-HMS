
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, Plus, Search, Edit, Eye, Trash2, 
  Image, Video, Calendar, User, Globe, Settings
} from "lucide-react";

export const CMSModule = () => {
  const [activeTab, setActiveTab] = useState("pages");

  const contentItems = [
    {
      id: "CMS001",
      title: "Hotel Welcome Page",
      type: "Page",
      status: "Published",
      author: "Admin",
      lastModified: "2024-01-15",
      views: "1,234"
    },
    {
      id: "CMS002",
      title: "Restaurant Menu",
      type: "Menu",
      status: "Draft",
      author: "Chef Manager",
      lastModified: "2024-01-14",
      views: "856"
    },
    // ... more content items
  ];

  const cmsStats = [
    { title: "Total Pages", value: "47", icon: FileText, color: "blue" },
    { title: "Published", value: "32", icon: Globe, color: "green" },
    { title: "Draft Pages", value: "15", icon: Edit, color: "orange" },
    { title: "Media Files", value: "128", icon: Image, color: "purple" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Content Management System</h2>
          <p className="text-gray-600 text-sm mt-1">Manage website content, menus, and media</p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cmsStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
            <CardTitle className="text-lg">Content Library</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search content..." className="pl-9 text-sm w-48" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">{item.title}</h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{item.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.lastModified}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views} views</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(item.status) + " text-xs"}>
                    {item.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Page</h3>
            <p className="text-sm text-gray-600">Add new web pages with rich content</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Media Library</h3>
            <p className="text-sm text-gray-600">Manage images, videos, and documents</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Site Settings</h3>
            <p className="text-sm text-gray-600">Configure website settings and SEO</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
