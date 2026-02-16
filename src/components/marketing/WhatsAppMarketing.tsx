import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Calendar, 
  BarChart3, 
  Plus, 
  Search,
  Filter,
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Download,
  Upload,
  Settings,
  Zap,
  Target,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive' | 'blocked';
  tags: string[];
  lastMessage?: Date;
  profileImage?: string;
}

interface Campaign {
  id: string;
  name: string;
  message: string;
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed';
  scheduledDate?: Date;
  createdDate: Date;
}

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  usage: number;
}

const WhatsAppMarketing = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      phone: "+1234567890",
      email: "sarah@example.com",
      status: "active",
      tags: ["VIP", "Frequent Guest"],
      lastMessage: new Date(Date.now() - 2 * 60 * 60 * 1000),
      profileImage: "SJ"
    },
    {
      id: "2", 
      name: "Mike Chen",
      phone: "+1234567891",
      email: "mike@example.com",
      status: "active",
      tags: ["Business", "Regular"],
      lastMessage: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      profileImage: "MC"
    },
    {
      id: "3",
      name: "Emily Davis",
      phone: "+1234567892",
      status: "inactive",
      tags: ["New Customer"],
      profileImage: "ED"
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Holiday Special Promotion",
      message: "🎉 Special holiday offer! Book now and get 30% off...",
      recipients: 250,
      sent: 250,
      delivered: 245,
      read: 180,
      replied: 25,
      status: "completed",
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Weekend Getaway Deal",
      message: "🏖️ Perfect weekend escape awaits! Limited time offer...",
      recipients: 180,
      sent: 180,
      delivered: 175,
      read: 120,
      replied: 15,
      status: "completed",
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  const templates: Template[] = [
    {
      id: "1",
      name: "Welcome Message",
      content: "Welcome to {{hotel_name}}, {{guest_name}}! We're excited to have you stay with us.",
      category: "greeting",
      variables: ["hotel_name", "guest_name"],
      usage: 45
    },
    {
      id: "2",
      name: "Booking Confirmation",
      content: "Your booking #{{booking_id}} is confirmed for {{date}}. Check-in: {{checkin_time}}",
      category: "booking",
      variables: ["booking_id", "date", "checkin_time"],
      usage: 32
    },
    {
      id: "3",
      name: "Special Offer",
      content: "🎉 Exclusive offer for you! Get {{discount}}% off your next stay. Use code: {{promo_code}}",
      category: "promotion",
      variables: ["discount", "promo_code"],
      usage: 28
    }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Message sent to ${selectedContacts.length} contacts`);
      setNewMessage("");
      setSelectedContacts([]);
      setIsLoading(false);
    }, 2000);
  };

  const handleZapierTrigger = async () => {
    if (!webhookUrl) {
      toast.error("Please enter your Zapier webhook URL");
      return;
    }

    setIsLoading(true);
    
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: "WhatsApp Marketing Module",
          campaign_data: {
            total_contacts: contacts.length,
            active_campaigns: campaigns.filter(c => c.status === 'sending').length
          }
        }),
      });

      toast.success("Zapier webhook triggered successfully!");
    } catch (error) {
      toast.error("Failed to trigger Zapier webhook");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const stats = {
    totalContacts: contacts.length,
    activeContacts: contacts.filter(c => c.status === 'active').length,
    campaignsSent: campaigns.length,
    avgOpenRate: campaigns.reduce((acc, camp) => acc + (camp.read / camp.sent * 100), 0) / campaigns.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            WhatsApp Marketing
          </h1>
          <p className="text-muted-foreground mt-1">Engage guests through WhatsApp campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>Set up a new WhatsApp marketing campaign</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Campaign name" />
                <Textarea placeholder="Message content..." rows={4} />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full">Create Campaign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Contacts</p>
                <p className="text-2xl font-bold">{stats.activeContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Campaigns Sent</p>
                <p className="text-2xl font-bold">{stats.campaignsSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold">{stats.avgOpenRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="dashboard" className="text-xs lg:text-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs lg:text-sm">Contacts</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs lg:text-sm">Campaigns</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs lg:text-sm">Templates</TabsTrigger>
          <TabsTrigger value="automation" className="text-xs lg:text-sm">Automation</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <Badge variant="secondary">{campaign.status}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-semibold">{campaign.sent}</p>
                          <p className="text-muted-foreground">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{campaign.delivered}</p>
                          <p className="text-muted-foreground">Delivered</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{campaign.read}</p>
                          <p className="text-muted-foreground">Read</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{campaign.replied}</p>
                          <p className="text-muted-foreground">Replied</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Zapier Integration
                </CardTitle>
                <CardDescription>Connect with external automation tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter Zapier webhook URL"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <Button 
                  onClick={handleZapierTrigger}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Triggering..." : "Trigger Zapier Webhook"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  This will send campaign data to your connected Zapier workflow
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{contact.profileImage}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                          {contact.email && (
                            <p className="text-xs text-muted-foreground">{contact.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                          {contact.status}
                        </Badge>
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <Card key={campaign.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge variant="secondary">{campaign.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {campaign.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{campaign.recipients} recipients</span>
                        <span>{campaign.createdDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="capitalize">{template.category}</CardDescription>
                    </div>
                    <Badge variant="secondary">{template.usage} uses</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{template.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Broadcast
              </CardTitle>
              <CardDescription>Send a message to selected contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  placeholder="Select contacts..." 
                  className="flex-1"
                  readOnly
                  value={selectedContacts.length > 0 ? `${selectedContacts.length} contacts selected` : ""}
                />
                <Button variant="outline">Select Contacts</Button>
              </div>
              <Button onClick={handleSendMessage} disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppMarketing;