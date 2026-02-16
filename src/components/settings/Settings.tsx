
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Users, Mail, Phone } from "lucide-react";

export const Settings = () => {
  const userRoles = [
    { id: 1, name: "Admin", permissions: "Full Access", users: 2, active: true },
    { id: 2, name: "Hotel Manager", permissions: "Hotel Management", users: 3, active: true },
    { id: 3, name: "Restaurant Manager", permissions: "Restaurant Management", users: 2, active: true },
    { id: 4, name: "Front Desk", permissions: "Check-in/out, Bookings", users: 5, active: true },
    { id: 5, name: "Waiter", permissions: "Order Management", users: 8, active: true },
  ];

  const systemSettings = [
    { name: "Email Notifications", description: "Send booking confirmations via email", enabled: true },
    { name: "SMS Notifications", description: "Send SMS updates to customers", enabled: false },
    { name: "Auto Check-out", description: "Automatically check out guests at 12 PM", enabled: true },
    { name: "Room Service Orders", description: "Allow room service orders through the system", enabled: true },
    { name: "Online Payments", description: "Accept online payments for bookings", enabled: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage system configuration and user roles</p>
      </div>

      {/* Hotel Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <span>Hotel Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hotelName">Hotel Name</Label>
              <Input id="hotelName" defaultValue="Grand Palace Hotel" />
            </div>
            <div>
              <Label htmlFor="hotelEmail">Email</Label>
              <Input id="hotelEmail" type="email" defaultValue="info@grandpalace.com" />
            </div>
            <div>
              <Label htmlFor="hotelPhone">Phone</Label>
              <Input id="hotelPhone" defaultValue="+1 234-567-8900" />
            </div>
            <div>
              <Label htmlFor="hotelAddress">Address</Label>
              <Input id="hotelAddress" defaultValue="123 Luxury Ave, City, State 12345" />
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Update Information
          </Button>
        </CardContent>
      </Card>

      {/* User Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-600" />
            <span>User Roles & Permissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.permissions}</p>
                  </div>
                  <Badge variant="secondary">
                    {role.users} user{role.users !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={role.active} />
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Add New Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-purple-600" />
            <span>System Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{setting.name}</h3>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-orange-600" />
            <span>Notification Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Booking Confirmation</h3>
              <p className="text-sm text-gray-600 mb-3">Email template for booking confirmations</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Check-in Reminder</h3>
              <p className="text-sm text-gray-600 mb-3">SMS template for check-in reminders</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Payment Receipt</h3>
              <p className="text-sm text-gray-600 mb-3">Email template for payment receipts</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Feedback Request</h3>
              <p className="text-sm text-gray-600 mb-3">Email template for feedback requests</p>
              <Button variant="outline" size="sm">Edit Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
