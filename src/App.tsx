
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HotelDetail from "./pages/HotelDetail";
import RestaurantDetail from "./pages/RestaurantDetail";
import MenuManagement from "./pages/MenuManagement";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { RoomBooking } from "./components/hotel/RoomBooking";
import { RestaurantManagement } from "./components/restaurant/RestaurantManagement";
import { HotelManagement } from "./components/hotel/HotelManagement";
import HotelDashboard from "./components/dashboard/HotelDashboard";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Dashboard from "./userDashboard/Dashboard";
import VendorDashboard from "./VendorDashboard/VendorDashboard";
import StaffDashboard from "./StaffDashboard/StaffDashboard";
import SetPasswordPage from "./components/setpassword/SetPasswordPage";
import RestaurantList from "./components/restaurant/RestaurantList";
 
import AuthRedirect from "./pages/AuthRedirect";


const queryClient = new QueryClient();

const App = () => {

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotel/:id" element={<ProtectedRoute><HotelDetail /></ProtectedRoute>} />
          {/* <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetail /></ProtectedRoute>} /> */}
            {/* <Route path="/restaurant" element={<RestaurantList />} /> */}
        <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
          <Route path="/menu-management" element={<ProtectedRoute><MenuManagement /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
           <Route path="/booking" element={<ProtectedRoute><RoomBooking /></ProtectedRoute>} />
           <Route path="/hotelDashboard" element={<ProtectedRoute><HotelDashboard /></ProtectedRoute>} />
          <Route path="/RestaurantManagement" element={<ProtectedRoute><RestaurantManagement viewingRestaurantSlug="" /></ProtectedRoute>}/>
          {/* <Route path="/"/> */}
          <Route path="/verify-email-reset-password/:slug?" element={<SetPasswordPage/>}/>
          <Route path="/verify-email/:slug" element={<AuthRedirect />} />
          {/* Protected dashboard route */}
          <Route path="/dashboard" element={ <ProtectedRoute>  <Index /> </ProtectedRoute>} />
          <Route path="/dashboard/:id" element={ <ProtectedRoute> <Index /> </ProtectedRoute>} />
          <Route path="/dashboard/hotel/:id" element={ <ProtectedRoute> <Index /> </ProtectedRoute>} />
          <Route path="/dashboard/restaurant/:id" element={ <ProtectedRoute> <Index /> </ProtectedRoute>} />
          
          
          {/* Hotel Management route with navbar/sidebar */}
          <Route path="/hotel-management" element={<ProtectedRoute><Index /></ProtectedRoute>} />
           <Route path="/user-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
           <Route path="/vendor-dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
           <Route path="/staff-dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
          
          {/* Redirect root to home page */}
          <Route path="/" element={<Home />} />
          
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)};

export default App;
