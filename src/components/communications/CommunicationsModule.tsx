import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail, MessageSquare, Send, Phone, Users,
  Calendar, Clock, CheckCircle, AlertCircle, X
} from "lucide-react";
import { useEffect, useState } from "react";

type Direction = "next" | "prev";

export const CommunicationsModule = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [dashboardSummary, setDashboardSummary] = useState<any>({});
const [recentCommunications, setRecentCommunications] = useState<any[]>([]);
const [offset, setOffset] = useState(0);
const limit = 4;
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
  const [messageTemplates, setMessageTemplates] = useState<any>([]);

  const [quickSend, setQuickSend] = useState<any>({
    recipient: "",
    channel: "",
    subject: "",
    message: ""
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(() => {
    return new Date().toISOString().slice(0, 16);
  });

  const handleChannelSelect = (channel: string) => {
    setQuickSend((prev: any) => ({
      ...prev,
      channel
    }));
  };



  const statsConfig = [
    { key: "messages_sent", label: "Messages Sent", icon: Send, color: "text-blue-600" },
    { key: "email_delivered", label: "Email Delivered", icon: Mail, color: "text-green-600" },
    { key: "whatsapp_sent", label: "WhatsApp Active", icon: MessageSquare, color: "text-green-600" },
    { key: "sms_delivered", label: "SMS Delivered", icon: Phone, color: "text-purple-600" }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-100 text-green-800";
      case "delivered": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "failed": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "email": return <Mail className="w-4 h-4" />;
      case "whatsapp": return <MessageSquare className="w-4 h-4" />;
      case "sms": return <Phone className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };
  const getDashboardSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/messages/overview/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardSummary(data);

      }
    }
    catch (error) {
      console.log(error);
    }
  };

const getRecentCommunications = async (direction: Direction) => {
  try {
    setLoading(true);

    let newOffset = offset;

    if (direction === "next") {
      newOffset = offset + limit;
    }

    if (direction === "prev") {
      newOffset = Math.max(offset - limit, 0); // 👈 0 se niche nahi
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/messages/recent?limit=${limit}&offset=${newOffset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("Data:", data);

    if (response.ok) {
      // 🔹 sirf current page ka data
      setRecentCommunications(data?.items || []);

      // 🔹 offset update
      setOffset(newOffset);

      // 🔹 hasMore update
      setHasMore(data?.items?.length === limit);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};


  const getMessageTemplates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/messages/templates/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessageTemplates(data);

      }
    }
    catch (error) {
      console.log(error);
    }
  };

  type QuickSendAction = "send" | "schedule" | "save";

  const handleQuickSend = async (action: QuickSendAction, extraData?: any) => {
    try {
      setLoadingAction(action); // ✅ start loading
      let payload = { ...quickSend };

      // ✅ Condition-based payload update
      if (action === "schedule") {
        payload = {
          ...payload,
          schedule_at: extraData?.schedule_at // ISO string / datetime
        };
      }

      if (action === "save") {
        payload = {
          ...payload,
          save_template: true
        };
      }

      console.log("Final Payload:", payload);

      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/messages/quick-send/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Response Data:", data);


      if (response.ok) {
        setQuickSend({
          recipient: "",
          channel: "",
          subject: "",
          message: ""
        });

        if (action === "schedule") {
          alert("Scheduled successfully!");
        } else if (action === "save") {
          alert("Template saved successfully!");
        } else {
          alert("Sent successfully!");
        }

      } else {
        alert(`Failed. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoadingAction(null); // ✅ stop loading
    }
  };

  const handleEditTemplate = (templateData: any) => {
    console.log("Editing template:", templateData);
    setQuickSend({
      recipient: templateData.recipient,
      channel: templateData.channel,
      subject: templateData.subject,
      message: templateData.body
    });

  }


  useEffect(() => {
    getDashboardSummary();
    getRecentCommunications("next");
    getMessageTemplates();
  }, [])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Overview */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;

          // 👇 yahin se REAL & UPDATED value aa rahi hai
          const value =
            dashboardSummary[stat.key] !== undefined
              ? dashboardSummary[stat.key]
              : "--";

          return (
            <Card key={stat.key}>
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                    <p className={`text-lg md:text-xl font-bold ${stat.color}`}>
                      {value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Quick Send */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Quick Send</span>
          </CardTitle>
          <CardDescription>Send messages via Email, WhatsApp, or SMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recipient</label>
              <Input placeholder="Enter email, phone, or select contact..." name="recipient" value={quickSend.recipient} onChange={(e) => { setQuickSend({ ...quickSend, [e.target.name]: e.target.value }) }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Channel</label>
              <div className="flex space-x-2">
                <Button
                  variant={quickSend.channel === "email" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleChannelSelect("email")}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>

                <Button
                  variant={quickSend.channel === "whatsapp" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleChannelSelect("whatsapp")}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>

                <Button
                  variant={quickSend.channel === "sms" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleChannelSelect("sms")}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  SMS
                </Button>
              </div>

            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <Input placeholder="Message subject..." name="subject" value={quickSend.subject} onChange={(e) => { setQuickSend({ ...quickSend, [e.target.name]: e.target.value }) }} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[100px]"
              name="message"
              value={quickSend.message}
              onChange={(e) => { setQuickSend({ ...quickSend, [e.target.name]: e.target.value }) }}
            />
          </div>


          <div className="flex flex-col sm:flex-row gap-2">
            {/* SEND NOW */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              onClick={() => handleQuickSend("send")}
              disabled={loadingAction === "send"}
            >
              {loadingAction === "send" ? "Sending..." : <><Send className="w-4 h-4 mr-2" />Send Now</>}
            </Button>

            {/* SCHEDULE */}
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowScheduleModal(true)}
              disabled={loadingAction === "schedule"}
            >
              {loadingAction === "schedule" ? "Scheduling..." : <><Calendar className="w-4 h-4 mr-2" />Schedule</>}
            </Button>

            {/* SAVE TEMPLATE */}
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleQuickSend("save")}
              disabled={loadingAction === "save"}
            >
              {loadingAction === "save" ? "Saving..." : "Save Template"}
            </Button>
          </div>


        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>Pre-configured templates for common communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messageTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm md:text-base">{template.name}</h3>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    {getChannelIcon(template.channel)}
                    <span className="capitalize">{template.channel}</span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Used {template.use_count} times</span>
                  <Button variant="ghost" size="sm" onClick={() => {handleEditTemplate(template)}}>Use Template</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Recent Communications</span>
          </CardTitle>
          <CardDescription>Latest sent messages and their delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCommunications?.map((comm) => (
              <div key={comm.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getChannelIcon(comm.channel)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <h3 className="font-semibold text-sm md:text-base truncate">{comm.subject.charAt(0).toUpperCase() + comm.subject.slice(1)}</h3>
                      <span className="text-sm text-gray-600 truncate">{comm.recipient}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{comm.time_ago}</span>
                      <Badge variant="outline" className="text-xs">
                        {comm.channel.charAt(0).toUpperCase() + comm.channel.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Badge className={`${getStatusColor(comm.status)} flex items-center space-x-1`}>
                  {getStatusIcon(comm.status)}
                  <span className="capitalize">{comm.status}</span>
                </Badge>
              </div>
            ))}
          </div>
<div className="mt-4 text-center flex gap-2 justify-center">
  
  {/* BACK BUTTON */}
  {offset > 0 && (
    <Button
      variant="outline"
      onClick={() => getRecentCommunications("prev")}
      className="w-full sm:w-auto"
    >
      Back Communications
    </Button>
  )}

  {/* NEXT BUTTON */}
  {hasMore && (
    <Button
      variant="outline"
      onClick={() => getRecentCommunications("next")}
      className="w-full sm:w-auto"
    >
      View All Communications
    </Button>
  )}

</div>


        </CardContent>
      </Card>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            {/* ❌ Close Icon */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowScheduleModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule Message</span>
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Date & Time</label>
              <Input
                type="datetime-local"
                value={selectedScheduleDate}
                onChange={(e) => setSelectedScheduleDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleQuickSend("schedule", {
                    schedule_at: new Date(selectedScheduleDate).toISOString()
                  });
                  setShowScheduleModal(false);
                }}
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};