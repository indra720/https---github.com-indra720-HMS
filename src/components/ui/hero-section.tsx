  import React, { useRef, useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Calendar } from "@/components/ui/calendar";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { Badge } from "@/components/ui/badge";
  import {
    Plane,
    Building,
    MapPin,
    Calendar as CalendarIcon,
    Users,
    Search,
    ArrowLeftRight,
    Sparkles,
    Shield,
    Clock,
    Star,
    TrendingUp,
    Award,
    Globe,
    Zap,
    CheckCircle,
    Phone,
    Mail,
    Car,
    Train,
    Bus,
    Sailboat,
  } from "lucide-react";
  import { format } from "date-fns";
  import { cn } from "@/lib/utils";
  import SearchBox from "./SearchBox";
  import third from '../../assets/vid.mp4'
  import third_mobile from '../../assets/mbile vid.mp4'
  interface HeroSectionProps {
    onSearch?: (searchData: any) => void;
  }

  export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
    const [activeTab, setActiveTab] = useState("hotels");
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [checkInDate, setCheckInDate] = useState<Date>();
    const [checkOutDate, setCheckOutDate] = useState<Date>();
    const [guests, setGuests] = useState("2 Adults");
    const [rooms, setRooms] = useState("1 Room");
    const [tripType, setTripType] = useState("one-way");
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoSrc, setVideoSrc] = useState(third);

    const videoRef = useRef(null);

    React.useEffect(() => {
      if (window.innerWidth <= 767) {
        setVideoSrc(third_mobile);
      } else {
        setVideoSrc(third);
      }
    }, []);


    const handleSearch = () => {
      const searchData = {
        type: activeTab,
        from: fromLocation,
        to: toLocation,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        rooms,
        tripType,
      };

      onSearch?.(searchData);
    };

    const swapLocations = () => {
      const temp = fromLocation;
      setFromLocation(toLocation);
      setToLocation(temp);
    };



    const quickServices = [
      { icon: Building, label: "Hotels", active: true },
      { icon: Plane, label: "Flights" },
      { icon: Car, label: "Cabs" },
      { icon: Train, label: "Trains" },
      { icon: Bus, label: "Bus" },
      { icon: Sailboat, label: "Cruise" },
    ];

    const trustIndicators = [
      { icon: Shield, label: "100% Safe & Secure", color: "text-green-400" },
      { icon: Award, label: "Best Price Guarantee", color: "text-yellow-400" },
      { icon: Clock, label: "24x7 Support", color: "text-blue-400" },
      { icon: Globe, label: "50+ Countries", color: "text-purple-400" },
    ];

    const stats = [
      { number: "20M+", label: "Happy Customers" },
      { number: "1.2M+", label: "Hotels Worldwide" },
      { number: "4.5", label: "Average Rating", icon: Star },
      { number: "24/7", label: "Customer Support" },
    ];

    return (
      <div className="relative w-full overflow-hidden bg-transparent">
    {/* Video & fallback */}
    <div className="absolute inset-0 h-full w-full">
      <div className="relative w-full h-full min-h-0">

        {/* fallback */}
        <div
          id="video-fallback"
          className="absolute inset-0 z-10 transition-opacity duration-500"
          style={{
            opacity: 1,
            background: "#0f172a",
            backgroundImage: `
              radial-gradient(circle, rgba(139,92,246,0.6) 1px, transparent 1px),
              radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px),
              radial-gradient(circle, rgba(236,72,153,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px, 40px 40px, 60px 60px",
            backgroundPosition: "0 0, 10px 10px, 30px 30px",
          }}
        />

        {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        onLoadedData={() => {
          const fallback = document.getElementById("video-fallback");
          fallback!.style.opacity = "0";
          setTimeout(() => {
            fallback!.style.display = "none";
          }, 500);
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const fallback = document.getElementById("video-fallback");
          fallback!.style.display = "block";
          fallback!.style.opacity = "1";
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-green-900/40 z-10"></div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>

      </div>
    </div>

    {/* Main Content */}
    <div className="relative z-20 py-10 md:py-24">
      {/* Hero Content */}
      <div className="px-4 pb-8 max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold text-white mb-2 leading-tight">
            Discover Your Perfect
            <span className="block pb-3 bg-orange-500 bg-clip-text text-transparent">
              Stay Dine
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-3 md:mb-8 leading-relaxed">
            Where luxury hotels meet exceptional dining experiences.
            <span className="block md:mt-2 text-[16px] md:text-lg text-white/80">
              Create unforgettable memories with world-class hospitality.
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-base text-white/70">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              Premium Hotels
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              Fine Dining
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              Exclusive Experiences
            </span>
          </div>
        </div>

        <SearchBox />

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2 text-primary-foreground/80"
              >
                <indicator.icon
                  className={cn("h-5 w-5", indicator.color)}
                />
                <span className="text-sm font-medium">
                  {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>

    );
  };
