import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CabSearch = () => {
  const { toast } = useToast();
  const [cabType, setCabType] = useState("outstationOneWay");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState<Date>();
  const [rentalDuration, setRentalDuration] = useState("");

  const validateCabSearch = () => {
    if (!fromLocation) {
      toast({ title: "Error", description: "Please enter pickup location", variant: "destructive" });
      return false;
    }
    
    if (cabType !== "hourlyRentals" && !toLocation) {
      toast({ title: "Error", description: "Please enter drop location", variant: "destructive" });
      return false;
    }
    
    if (!pickupDate) {
      toast({ title: "Error", description: "Please select pickup date", variant: "destructive" });
      return false;
    }
    
    if (!pickupTime) {
      toast({ title: "Error", description: "Please select pickup time", variant: "destructive" });
      return false;
    }
    
    if (cabType === "outstationRoundTrip" && !returnDate) {
      toast({ title: "Error", description: "Please select return date", variant: "destructive" });
      return false;
    }
    
    if (cabType === "hourlyRentals" && !rentalDuration) {
      toast({ title: "Error", description: "Please select rental duration", variant: "destructive" });
      return false;
    }
    
    return true;
  };

  const handleSearch = () => {
    if (validateCabSearch()) {
      toast({ title: "Searching Cabs", description: "Finding available cabs for you..." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cab Options */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="cabOption" 
            value="outstationOneWay" 
            checked={cabType === "outstationOneWay"} 
            onChange={(e) => setCabType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Outstation One-Way</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="cabOption" 
            value="outstationRoundTrip" 
            checked={cabType === "outstationRoundTrip"} 
            onChange={(e) => setCabType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Outstation Round-Trip</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="cabOption" 
            value="airportTransfers" 
            checked={cabType === "airportTransfers"} 
            onChange={(e) => setCabType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Airport Transfers</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="cabOption" 
            value="hourlyRentals" 
            checked={cabType === "hourlyRentals"} 
            onChange={(e) => setCabType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Hourly Rentals</span>
          <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full ml-1">new</span>
        </label>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {/* From */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">FROM</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pickup Location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="pl-10 h-12 border-gray-200"
            />
          </div>
        </div>

        {/* To - Hide for hourly rentals */}
        {cabType !== "hourlyRentals" && (
          <div className="lg:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">TO</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Drop Location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="pl-10 h-12 border-gray-200"
              />
            </div>
          </div>
        )}

        {/* Rental Duration - Show only for hourly rentals */}
        {cabType === "hourlyRentals" && (
          <div className="lg:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">DURATION</label>
            <Select value={rentalDuration} onValueChange={setRentalDuration}>
              <SelectTrigger className="h-12 border-gray-200">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="8h">8 Hours</SelectItem>
                <SelectItem value="12h">12 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pickup Date */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">PICKUP DATE</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-gray-200",
                  !pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {pickupDate ? format(pickupDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Pickup Time */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">PICKUP TIME</label>
          <Select value={pickupTime} onValueChange={setPickupTime}>
            <SelectTrigger className="h-12 border-gray-200">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="12:00" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="06:00">06:00 AM</SelectItem>
              <SelectItem value="09:00">09:00 AM</SelectItem>
              <SelectItem value="12:00">12:00 PM</SelectItem>
              <SelectItem value="15:00">03:00 PM</SelectItem>
              <SelectItem value="18:00">06:00 PM</SelectItem>
              <SelectItem value="21:00">09:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Return Date - Show only for round trip */}
        {cabType === "outstationRoundTrip" && (
          <div className="lg:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">RETURN DATE</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal border-gray-200",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Search Button */}
        <div className="lg:col-span-1 flex items-end">
          <Button 
            onClick={handleSearch}
            className="w-full h-12 bg-gradient-to-r from-[#0f172a] to-[#334155] hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Search className="!w-5 !h-5"/>
            SEARCH
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CabSearch;