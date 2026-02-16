
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { BookingsView } from "@/components/dashboard/BookingsView";
import { HotelManagement } from "@/components/hotel/HotelManagement";
import { HotelAddManagement } from "@/components/hotelAdd/HotelAddManagement";
import { RestaurantManagement } from "@/components/restaurant/RestaurantManagement";
import  RestaurantList  from "@/components/restaurant/RestaurantList";
import { StaffManagement } from "@/components/staff/StaffManagement";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";
import { MaintenanceModule } from "@/components/maintenance/MaintenanceModule";
import { EventManagement } from "@/components/events/EventManagement";
import { GuestServices } from "@/components/services/GuestServices";
import { CustomerManagement } from "@/components/customer/CustomerManagement";
import { Analytics } from "@/components/analytics/Analytics";
import { Settings } from "@/components/settings/Settings";
import { MarketingHub } from "@/components/marketing/MarketingHub";
import { CRMModule } from "@/components/crm/CRMModule";
import { LaundryManagement } from "@/components/laundry/LaundryManagement";
import { CMSModule } from "@/components/cms/CMSModule";
import { BillingModule } from "@/components/billing/BillingModule";
import { AccountingModule } from "@/components/accounting/AccountingModule";
import { ActivitiesModule } from "@/components/activities/ActivitiesModule";
import { ReviewsModule } from "@/components/reviews/ReviewsModule";
import { CommunicationsModule } from "@/components/communications/CommunicationsModule";
import POSSystem from "@/components/restaurant/POSSystem";
import WhatsAppMarketing from "@/components/marketing/WhatsAppMarketing";
import { QuotationMaker } from "@/components/quotations/QuotationMaker";
import { FinanceManagement } from "@/components/finance/FinanceManagement";
import { ReportingModule } from "@/components/reporting/ReportingModule";
import HotelDashboard from "@/components/dashboard/HotelDashboard";
import RolePermissionsTable from "@/components/dashboard/RolePermissionsTable";

const Index = () => {
  const [activeView, setActiveView] = useState("hotel");
  const [viewingHotelSlug, setViewingHotelSlug] = useState(null);
  const [viewingRestaurantSlug, setViewingRestaurantSlug] = useState(null);


 useEffect(() => {
    const userData = localStorage.getItem("user");
    let role = null;

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        role = parsed?.role;
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }

    if (role === null || role === "Customer") {
      setActiveView("new-hotel"); // SUPER user → new-hotel
    } else {
      setActiveView("hotel"); // Normal → hotel
    }
  }, []);

  const handleViewHotel = (hotelSlug) => {
    // Store slug for HotelManagement component
    setViewingHotelSlug(hotelSlug);
    localStorage.setItem("currentHotelSlug", hotelSlug);
    // Switch to hotel view
    setActiveView("hotel");
  };


    const handleViewRestaurant = (restaurantSlug) => {
    // Store slug for RestaurantManagement component
    setViewingRestaurantSlug(restaurantSlug);
    localStorage.setItem("currentRestaurantSlug", restaurantSlug);
    // Switch to restaurant view
    setActiveView("restaurant");
  
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview setActiveView={setActiveView} />;
      case "bookings":
        return <BookingsView />;
        case "new-hotel":
        return <HotelAddManagement onViewHotel={handleViewHotel} />;
      case "hotel":
        return <HotelManagement viewingHotelSlug={viewingHotelSlug} />;
      case "restaurant":
        return <RestaurantManagement viewingRestaurantSlug={viewingRestaurantSlug} />;
          case "add-restaurant":
        return <RestaurantList onViewRestaurant={handleViewRestaurant} />;
      case "staff":
        return <StaffManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "maintenance":
        return <MaintenanceModule />;
      case "events":
        return <EventManagement />;
      case "guest-services":
        return <GuestServices />;
      case "crm":
        return <CRMModule />;
      case "laundry":
        return <LaundryManagement />;
      case "cms":
        return <CMSModule />;
      case "billing":
        return <BillingModule />;
      case "accounting":
        return <AccountingModule />;
      case "marketing":
        return <MarketingHub />;
      case "analytics":
        return <Analytics />;
      case "activities":
        return <ActivitiesModule />;
      case "reviews":
        return <ReviewsModule />;
      case "communications":
        return <CommunicationsModule />;
        case "pos":
          return <POSSystem />;
        case "whatsapp":
          return <WhatsAppMarketing />;
      case "quotations":
        return <QuotationMaker />;
      case "finance":
        return <FinanceManagement />;
      case "reporting":
        return <ReportingModule />;
         case "roles":
        return <RolePermissionsTable />;
      case "settings":
        return <Settings />;
      case "hotelDashboard":
        return <HotelDashboard />;
      default:
        return <HotelManagement viewingHotelSlug={viewingHotelSlug} />; // Default to hotel view
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderActiveView()}
    </DashboardLayout>
  );
};

export default Index;
