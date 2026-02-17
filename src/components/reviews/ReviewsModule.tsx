
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, MessageSquare, TrendingUp, Users, 
  Hotel, UtensilsCrossed, User, Clock
} from "lucide-react";
import { useEffect, useState } from "react";

export const ReviewsModule = () => {
    const [categoryBreakdown, setCategoryBreakdown] = useState<any>([]);
    const [dashboardSummary, setDashboardSummary] = useState<any>([]);
    const [recentReviews, setRecentReviews] = useState<any>([]);


    const accessToken = localStorage.getItem('accessToken');
  
    
  const handleGetDashboardSummary = async () => { 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotel-reviews/dashboard-stats/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok && data) {
      
        setDashboardSummary(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
 
    useEffect(() => {
      handleGetDashboardSummary();
    }, []);

  const reviews = [
    {
      id: 1,
      guest: "Sarah Johnson",
      category: "Hotel",
      rating: 5,
      title: "Excellent Service!",
      comment: "Amazing stay! The room was clean, staff was friendly, and the location is perfect.",
      date: "2024-01-15",
      service: "Room Service",
      staff: "Emily Chen"
    },
    {
      id: 2,
      guest: "Mike Wilson",
      category: "Restaurant",
      rating: 4,
      title: "Great Food",
      comment: "The dinner was delicious, especially the seafood. Chef did an amazing job!",
      date: "2024-01-14",
      service: "Dining",
      staff: "Chef Marco"
    },
    {
      id: 3,
      guest: "John Smith",
      category: "Housekeeping",
      rating: 5,
      title: "Spotless Room",
      comment: "Room was perfectly clean and well-maintained. Housekeeping team is fantastic!",
      date: "2024-01-13",
      service: "Housekeeping",
      staff: "Maria Rodriguez"
    },
    {
      id: 4,
      guest: "Emily Davis",
      category: "Restaurant",
      rating: 3,
      title: "Good Service",
      comment: "Food was good but service was a bit slow. Waiter was polite though.",
      date: "2024-01-12",
      service: "Dining",
      staff: "James Wilson"
    }
  ];

  const stats = [
    { label: "Overall Rating", value: dashboardSummary?.overall_rating ?? "0", icon: Star, color: "text-yellow-600" },
    { label: "Total Reviews", value: dashboardSummary?.total_reviews ?? "0", icon: MessageSquare, color: "text-blue-600" },
    { label: "This Month", value: dashboardSummary?.this_month ?? "0", icon: TrendingUp, color: "text-green-600" },
    { label: "Response Rate", value: dashboardSummary?.response_rate ?? "0%", icon: Users, color: "text-purple-600" }
  ];

   
   const handleGetRatingBreakdown = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/hotel-reviews/rating-breakdown/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok || !data) return;

       setCategoryBreakdown(data);
       
    } catch (err) {
      console.error("Rating Breakdown API Error:", err);
    }
  };
   const handleGetRecentReviews = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/hotel-reviews/recent-reviews/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();
    if (res.ok) {
      setRecentReviews(data);
    }
  } catch (error) {
    console.error("Recent Reviews API Error", error);
  }
};
  useEffect(() => {
    handleGetDashboardSummary();
    handleGetRatingBreakdown();
      handleGetRecentReviews();
  }, []);
 
  const getRatingStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "hotel service":
        return <Hotel className="w-4 h-4" />;
      case "restaurant":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "housekeeping":
        return <User className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  


  const stats2 = [
    {
      label: "Overall Rating",
      value: dashboardSummary?.overall_rating ?? "0",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      label: "Total Reviews",
      value: dashboardSummary?.total_reviews ?? "0",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      label: "This Month",
      value: dashboardSummary?.this_month ?? "0",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Response Rate",
      value: dashboardSummary?.response_rate ?? "0%",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats2.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                    <p className={`text-lg md:text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Breakdown</CardTitle>
          <CardDescription>Performance by service category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryBreakdown.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm md:text-base">{item.category}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{item.reviews} reviews</span>
                  <div className="flex space-x-1">
                    {getRatingStars(Math.round(item.rating))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Recent Reviews</span>
          </CardTitle>
          <CardDescription>Latest guest feedback and ratings</CardDescription>
        </CardHeader>
        <CardContent>
  <div className="space-y-4">
    {recentReviews.map((review: any, index: number) => {
      const guestName =
        review.guest ||
        review.guest_name ||
        review.customer_name ||
        "Guest User";

      return (
        <div
          key={review.id || index}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8 md:w-10 md:h-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                {guestName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm md:text-base">
                    {guestName}
                  </h3>

                  <Badge variant="outline" className="flex items-center space-x-1">
                    {getCategoryIcon(review.category || "")}
                    <span>{review.category || "General"}</span>
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  <div className="flex space-x-1">
                    {getRatingStars(Number(review.rating || 0))}
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {review.date || review.created_at || "--"}
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-1">
                {review.title || "No Title"}
              </h4>

              <p className="text-sm text-gray-600 mb-3">
                {review.comment || review.review || "No comment provided"}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>
                    <strong>Service:</strong>{" "}
                    {review.service || "N/A"}
                  </span>
                  <span>
                    <strong>Staff:</strong>{" "}
                    {review.staff || "N/A"}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 sm:mt-0 w-full sm:w-auto"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>

  <div className="mt-4 text-center">
    <Button variant="outline" className="w-full sm:w-auto">
      Load More Reviews
    </Button>
  </div>
</CardContent>

      </Card>
    </div>
  );
};
 