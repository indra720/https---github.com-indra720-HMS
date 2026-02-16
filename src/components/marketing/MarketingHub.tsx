
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Mail, 
  Users, 
  Target, 
  Calendar, 
  DollarSign, 
  Eye, 
  MousePointer,
  Send,
  Gift,
  Star,
  BarChart3,
  IndianRupee
} from "lucide-react";
import { useEffect, useState } from "react";

interface Overview {
  active_campaigns: number;
    active_campaigns_improvement: number;
    email_open_rate: number;
    email_open_rate_improvement: number;
    conversion_rate: number;
    conversion_rate_improvement: number;
    marketing_roi: number;
    marketing_roi_improvement: number;
}

export const MarketingHub = () => {
  const [eventTypeOpenForm, setEventTypeOpenForm] = useState(false);

const [campaigns, setCampaigns] = useState({
  name: "",
  description: "",
  type: "",
  status: "",
  start_date: "",
  end_date: "",
  budget: "",
  results: "",
  slug : ""
});




  const [activeCampaigns, setActiveCampaigns] = useState<any>([]);
  interface ReviewsSummary {
  average_rating: number;
  total_reviews: number;
  positive_reviews_percentage: number;
}

const [isEditMode, setIsEditMode] = useState(false);
const [editingSlug, setEditingSlug] = useState<string | null>(null);


const [reviewsSummary, setReviewsSummary] = useState<ReviewsSummary>({
  average_rating: 0,
  total_reviews: 0,
  positive_reviews_percentage: 0,
});

const [promotions, setPromotions] = useState([]);
const [promoOpen, setPromoOpen] = useState(false);
const [isEditPromo, setIsEditPromo] = useState(false);
const [promoForm, setPromoForm] = useState({
  title: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  start_date: "",
  end_date: "",
  status: "active",
});
const [promoSlug, setPromoSlug] = useState(null);

  const accessToken  = localStorage.getItem("accessToken") || "";
 const [summaryOverview, setSummaryOverview] = useState<Overview>({
  active_campaigns: 0,
  active_campaigns_improvement: 0,
  email_open_rate: 0,
  email_open_rate_improvement: 0,
  conversion_rate: 0,
  conversion_rate_improvement: 0,
  marketing_roi: 0,
  marketing_roi_improvement: 0,
});
   
const [analyticsData,setAnalyticsData] = useState({
  total_impressions:0,
  impressions_improvement:'',
  click_through_rate : '',
  ctr_improvement : ''
})
    const handleEdit = (data) => {
      console.log("Edit Campaign Data 👉", data);
  setCampaigns({
    name: data.name || "",
    description: data.description || "",
    type: data.type?.toLowerCase() || "",
    status: data.status === "Active" ? "active" : "inactive",
    start_date: data.start_date || "",
    end_date: data.end_date || "",
    budget: data.budget || "",
    results: data.results || "",
    slug: data.slug || ""
  });

  setIsEditMode(true);
  setEditingSlug(data.slug);
  setEventTypeOpenForm(true);
};

  const getSummary = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/overview/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setSummaryOverview(data);
      if (response.ok) {
        console.log('Dashboard Summary', data)
      }
      else {
        throw new Error(`Dashboard Summary ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Dashboard Summary", error);
    }

  }
  const getAnalyticsData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/analytics/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setAnalyticsData(data);
      if (response.ok) {
        console.log('Analytics Summary', data)
      }
      else {
        throw new Error(`Analytics Summary ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Analytics Summary", error);
    }

  }


  const getCampaigns = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/campaigns/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const campaignsWithStatus = data.map((campaign: any) => ({
        ...campaign,
        status: campaign.is_active ? "Active" : "Inactive",
      }));
      setActiveCampaigns(campaignsWithStatus);
      console.log(campaignsWithStatus);
    } else {
      throw new Error(JSON.stringify(data));
    }
  } catch (error) {
    console.error("Campaign API Error", error);
  }
};
 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setCampaigns((prev) => ({
    ...prev,
    [name]: value,
  }));
};



  const handleSubmit = async () => {
    console.log("Submitting Campaign Form 👉", "hiiiiii");
  try {
    const payload = {
      name: campaigns.name,
      description: campaigns.description,
      type: campaigns.type,
      is_active: campaigns.status === 'active' ? true : false,
      start_date: campaigns.start_date,
      end_date: campaigns.end_date,
      budget: campaigns.budget,
      results: campaigns.results,
    };

    console.log("Submitting Campaign Payload 👉", payload);

    const url = isEditMode
      ? `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/campaigns/${editingSlug}/`
      : `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/campaigns/`;

    const method = isEditMode ? "PUT" : "POST";

    console.log(`${method} PAYLOAD 👉`, payload);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Response 👉", data);

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    alert(
      isEditMode
        ? "Campaign updated successfully ✅"
        : "Campaign created successfully ✅"
    );

    setEventTypeOpenForm(false);
    setIsEditMode(false);
    setEditingSlug(null);

    // refresh table
    getCampaigns();

  } catch (error) {
    console.error("Campaign Submit Error:", error);
    alert("Something went wrong");
  }
};

const getPromotions = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/promotions/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) throw data;

    const promotionsWithStatus = data.map((promo: any) => ({
      ...promo,
      status: promo.is_active ? "active" : "inactive",
    }));
    setPromotions(promotionsWithStatus);
  } catch (err) {
    console.error("GET Promotions Error", err);
  }
};

  const submitPromotion = async () => {
    try {
      const url = isEditPromo
        ? `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/promotions/${promoSlug}/`
        : `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/promotions/`;

      const method = isEditPromo ? "PUT" : "POST";

      const payload = {
        title: promoForm.title,
        description: promoForm.description,
        start_date: promoForm.start_date,
        end_date: promoForm.end_date,
        is_active: promoForm.status === 'active' ? true : false,
        discount_type: promoForm.discount_type,
        discount_value: promoForm.discount_value ? Number(promoForm.discount_value) : 0
      };

      console.log("Submitting Promotion Payload:", payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      if (!res.ok) {
        console.error("Promotion Submit Error Response:", data);
        throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
      }

      alert(isEditPromo ? "Promotion Updated ✅" : "Promotion Created ✅");

      setPromoOpen(false);
      setIsEditPromo(false);
      setPromoSlug(null);

      getPromotions(); // refresh list
    } catch (err) {
      console.error("POST/PUT Promotion Error", err);
      alert("Failed to save promotion. Check console for details.");
    }
  };



const getReviewsSummary = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/marketing/reviews/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("Reviews Summary", data);

    if (response.ok) {
      setReviewsSummary(data);
      console.log("Reviews Summary", data);
    } else {
      throw new Error(JSON.stringify(data));
    }
  } catch (error) {
    console.error("Reviews API Error", error);
  }
};


  useEffect(()=>{
    getSummary();
    getAnalyticsData();
    getCampaigns(); 
    getReviewsSummary();
    getPromotions();
  },[])

  const campaignStats = [
    {
      title: "Active Campaigns",
      value: summaryOverview.active_campaigns,
      change: summaryOverview.active_campaigns_improvement,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200/50"
    },
    {
      title: "Email Open Rate",
      value: summaryOverview.email_open_rate,
      change: summaryOverview.email_open_rate_improvement,
      icon: Mail,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200/50"
    },
    {
      title: "Conversion Rate",
      value: summaryOverview.conversion_rate,
      change: summaryOverview.conversion_rate_improvement,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200/50"
    },
    {
      title: "Marketing ROI",
      value: summaryOverview.marketing_roi,
      change: summaryOverview.marketing_roi_improvement,
      icon: IndianRupee,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
      borderColor: "border-orange-200/50"
    }
  ];
   
  return (
    <div className="space-y-8">
      {/* Marketing Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {campaignStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`hover:shadow-xl transition-all duration-500 cursor-pointer border-2 ${stat.borderColor} ${stat.bgColor} group hover:scale-105 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} border-2 ${stat.borderColor} shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Marketing Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-2">
          <TabsTrigger value="campaigns" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Target className="w-4 h-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Gift className="w-4 h-4" />
            <span>Promotions</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Star className="w-4 h-4" />
            <span>Reviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Active Campaigns</h3>
            <Button onClick={ ()=>{setEventTypeOpenForm(true)}} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Send className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Campaign Name</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Reach</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Engagement</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody>
  {activeCampaigns.length === 0 ? (
    <tr>
      <td colSpan={6} className="p-6 text-center text-gray-500">
        No campaigns found
      </td>
    </tr>
  ) : (
    activeCampaigns.map((campaign) => (
      <tr
        key={campaign.id}
        className="border-b hover:bg-gray-50 transition-colors"
      >
        <td className="p-4 font-medium text-gray-900">
          {campaign.name}
        </td>

        <td className="p-4">
          <Badge variant="outline">{campaign.type}</Badge>
        </td>

        <td className="p-4">
          <Badge
            className={
              campaign.status === "Active"
                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                : campaign.status === "Scheduled"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {campaign.status}
          </Badge>
        </td>

        <td className="p-4 text-gray-600">
          {campaign.reach ?? 0}
        </td>

        <td className="p-4 text-gray-600">
          {campaign.engagement ?? 0}%
        </td>

        <td className="p-4">
         <Button
  size="sm"
  variant="outline"
  onClick={() => handleEdit(campaign)}
>
  Edit
</Button>

        </td>
      </tr>
    ))
  )}
</tbody>

                </table>
              </div>
            </CardContent>

          </Card>
        </TabsContent>
  <Dialog open={eventTypeOpenForm} onOpenChange={setEventTypeOpenForm}>
    <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Update Campaign" : "Create Campaign"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Campaign Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
            Campaign Name
          </Label>
          <Input
            id="name"
            placeholder="Enter campaign name"
            name="name"
            value={campaigns.name}
            onChange={handleChange}
            className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
            Description
          </Label>
          <Input
            id="description"
            placeholder="Enter description"
            name="description"
            value={campaigns.description}
            onChange={handleChange}
            className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
          />
        </div>

        {/* Grid for Type and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campaign Type */}
          <div>
            <Label htmlFor="type" className="text-sm font-semibold text-gray-700 mb-2 block">
              Campaign Type
            </Label>
            <Select value={campaigns.type} onValueChange={(value) => {
              setCampaigns(prev => ({ ...prev, type: value }));
            }}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 block">
              Status
            </Label>
            <Select value={campaigns.status} onValueChange={(value) => {
              setCampaigns(prev => ({ ...prev, status: value }));
            }}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid for Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <Label htmlFor="start_date" className="text-sm font-semibold text-gray-700 mb-2 block">
              Start Date
            </Label>
            <Input
              id="start_date"
              type="date"
              name="start_date"
              value={campaigns.start_date}
              onChange={handleChange}
              className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="end_date" className="text-sm font-semibold text-gray-700 mb-2 block">
              End Date
            </Label>
            <Input
              id="end_date"
              type="date"
              name="end_date"
              value={campaigns.end_date}
              onChange={handleChange}
              className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>
        </div>

        {/* Grid for Budget and Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Budget */}
          <div>
            <Label htmlFor="budget" className="text-sm font-semibold text-gray-700 mb-2 block">
              Budget (₹)
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter budget"
              name="budget"
              value={campaigns.budget}
              onChange={handleChange}
              className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>

          {/* Expected Results */}
          <div>
            <Label htmlFor="results" className="text-sm font-semibold text-gray-700 mb-2 block">
              Expected Results
            </Label>
            <Input
              id="results"
              placeholder="Leads / Bookings / ROI"
              name="results"
              value={campaigns.results}
              onChange={handleChange}
              className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isEditMode ? "Update Campaign" : "Create Campaign"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>

        <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
    <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-bold text-gray-900">
          {isEditPromo ? "Update Promotion" : "Create Promotion"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
            Promotion Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter promotion title"
            value={promoForm.title}
            onChange={(e) => setPromoForm(prev => ({ ...prev, title: e.target.value }))}
            className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
            Description
          </Label>
          <Input
            id="description"
            name="description"
            placeholder="Enter promotion description"
            value={promoForm.description}
            onChange={(e) => setPromoForm(prev => ({ ...prev, description: e.target.value }))}
            className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
          />
        </div>

        {/* Discount Type and Value */}

        {/* Start and End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <Label htmlFor="promo_start_date" className="text-sm font-semibold text-gray-700 mb-2 block">
              Start Date
            </Label>
            <Input
              id="promo_start_date"
              name="start_date"
              type="date"
              value={promoForm.start_date}
              onChange={(e) => setPromoForm(prev => ({ ...prev, start_date: e.target.value }))}
              className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
            />
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="promo_end_date" className="text-sm font-semibold text-gray-700 mb-2 block">
              End Date
            </Label>
            <Input
              id="promo_end_date"
              name="end_date"
              type="date"
              value={promoForm.end_date}
              onChange={(e) => setPromoForm(prev => ({ ...prev, end_date: e.target.value }))}
              className="border-2 border-gray-200 focus:border-green-500 rounded-lg"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 block">
            Status
          </Label>
          <Select value={promoForm.status} onValueChange={(value) => {
            setPromoForm(prev => ({ ...prev, status: value }));
          }}>
            <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-lg">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          onClick={submitPromotion}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isEditPromo ? "Update Promotion" : "Create Promotion"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Marketing Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Total Impressions</h4>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{analyticsData.total_impressions}</p>
                  <p className="text-sm text-blue-600 mt-2">{analyticsData.impressions_improvement}from last month</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <MousePointer className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Click-through Rate</h4>
                  </div>
                  <p className="text-3xl font-bold text-purple-700">{analyticsData.click_through_rate}</p>
                  <p className="text-sm text-purple-600 mt-2">{analyticsData.ctr_improvement} improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span>Active Promotions</span>
            </h3>
            <Button 
              onClick={() => {
                setPromoForm({
                  title: "",
                  description: "",
                  discount_type: "percentage",
                  discount_value: "",
                  start_date: "",
                  end_date: "",
                  status: "active",
                });
                setIsEditPromo(false);
                setPromoSlug(null);
                setPromoOpen(true);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Gift className="w-4 h-4 mr-2" />
              Create Promotion
            </Button>
          </div>
          <Card className="shadow-xl">
            <CardContent className="p-0">
              {promotions.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Promotions</h3>
                  <p className="text-gray-500 mb-6">Create your first promotion to engage customers</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-900">Title</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Discount</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Period</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotions.map((promo) => (
                        <tr key={promo.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{promo.title}</td>
                          <td className="p-4 text-gray-600">
                            {promo.discount_value} {promo.discount_type === "percentage" ? "%" : "₹"}
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {promo.start_date} to {promo.end_date}
                          </td>
                          <td className="p-4">
                            <Badge className={
                              promo.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : promo.status === "scheduled"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }>
                              {promo.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPromoForm({
                                  title: promo.title || "",
                                  description: promo.description || "",
                                  discount_type: promo.discount_type || "percentage",
                                  discount_value: promo.discount_value || "",
                                  start_date: promo.start_date || "",
                                  end_date: promo.end_date || "",
                                  status: promo.status || "active",
                                });
                                setPromoSlug(promo.slug);
                                setIsEditPromo(true);
                                setPromoOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="reviews" className="space-y-6">
  <Card className="shadow-xl">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Star className="w-5 h-5 text-yellow-600" />
        <span>Customer Reviews</span>
      </CardTitle>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Average Rating */}
        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200/50">
          <div className="text-4xl font-bold text-yellow-700 mb-2">
            {reviewsSummary.average_rating}
          </div>

          <div className="flex justify-center space-x-1 mb-2">
            {[1,2,3,4,5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(reviewsSummary.average_rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-yellow-600">Average Rating</p>
        </div>

        {/* Total Reviews */}
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200/50">
          <div className="text-4xl font-bold text-green-700 mb-2">
            {reviewsSummary.total_reviews}
          </div>
          <p className="text-sm text-green-600">Total Reviews</p>
        </div>

        {/* Positive Reviews */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200/50">
          <div className="text-4xl font-bold text-blue-700 mb-2">
            {reviewsSummary.positive_reviews_percentage}
          </div>
          <p className="text-sm text-blue-600">Positive Reviews</p>
        </div>

      </div>
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>
    </div>
  );
};
