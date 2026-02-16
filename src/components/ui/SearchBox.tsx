import { useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import FlightSearch from "@/components/search/FlightSearch";
import HotelSearch from "@/components/search/HotelSearch";
import HomestaySearch from "@/components/search/HomestaySearch";
import HolidayPackageSearch from "@/components/search/HolidayPackageSearch";
import TrainSearch from "@/components/search/TrainSearch";
import BusSearch from "@/components/search/BusSearch";
import CabSearch from "@/components/search/CabSearch";
import RestaurantSearch from "@/components/search/RestaurantSearch";
import { Bus, BusFront, Car, CarTaxiFront, Coffee, Hotel, House, MapPin, Plane, Train } from "lucide-react";

const SearchBox = () => {
  const [activeTab, setActiveTab] = useState("Hotels");
  

  const tabs = [
    { name: "Hotels", icon: <Hotel className="w-4 h-4 mr-2" /> },
    { name: "Restaurants", icon: <Coffee className="w-4 h-4 mr-2" /> },
    { name: "Flights", icon: <Plane className="w-4 h-4 mr-2" /> },
    { name: "Homestays", icon: <House className="w-4 h-4 mr-2" /> },
    { name: "Holiday Packages", icon: <MapPin className="w-4 h-4 mr-2" /> },
    { name: "Trains", icon: <Train className="w-4 h-4 mr-2" /> },
    { name: "Buses", icon: <BusFront className="w-4 h-4 mr-2" /> },
    { name: "Cabs", icon: <CarTaxiFront className="w-4 h-4 mr-2" /> },
  ];

  return (
<div className="w-full max-w-7xl mx-auto bg-white/90  rounded-lg shadow-2xl p-6 ">
      {/* Tabs */}
      <div className="flex md:justify-center overflow-x-auto  border-gray-200 mb-6 gap-4">
  {tabs.map((tab) => (
  <button
    key={tab.name}
    onClick={() => setActiveTab(tab.name)}
    className={cn(
      "flex items-center flex-shrink-0 px-4 py-3 text-base border-b-2  transition-all duration-200", 
      activeTab === tab.name
        ? "font-bold shadow-md border-[hsl(var(--makemytrip-blue))]" 
        : "font-semibold border-transparent hover:text-gray-900"
    )}
    style={{ color: "#172a64" }} 
  >
    {React.cloneElement(tab.icon, { className: "w-5 h-5 mr-2", color: "#172a64" })} 
    {tab.name}
  </button>
))}
</div>




      {/* Content */}
      <div className="space-y-6">
        {activeTab === "Hotels" && <HotelSearch />}
        {activeTab === "Restaurants" && <RestaurantSearch />}
        {activeTab === "Flights" && <FlightSearch />}
        {activeTab === "Homestays" && <HomestaySearch />}
        {activeTab === "Holiday Packages" && <HolidayPackageSearch />}
        {activeTab === "Trains" && <TrainSearch />}
        {activeTab === "Buses" && <BusSearch />}
        {activeTab === "Cabs" && <CabSearch />}
      </div>
    </div>
  );
};

export default SearchBox;
