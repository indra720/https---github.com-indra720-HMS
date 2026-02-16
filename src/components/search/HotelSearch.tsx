import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const HotelSearch = () => {
  const { toast } = useToast();
  const [hotelType, setHotelType] = useState("regular");
  const [cityHotel, setCityHotel] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guestsRooms, setGuestsRooms] = useState("");

  const validateHotelSearch = () => {
    if (!cityHotel) {
      toast({ title: "Error", description: "Please enter city, hotel, or area", variant: "destructive" });
      return false;
    }
    if (!checkInDate) {
      toast({ title: "Error", description: "Please select check-in date", variant: "destructive" });
      return false;
    }
    if (!checkOutDate) {
      toast({ title: "Error", description: "Please select check-out date", variant: "destructive" });
      return false;
    }
    if (checkOutDate <= checkInDate) {
      toast({ title: "Error", description: "Check-out date must be after check-in date", variant: "destructive" });
      return false;
    }
    if (!guestsRooms) {
      toast({ title: "Error", description: "Please select guests and rooms", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (validateHotelSearch()) {
      toast({ title: "Searching Hotels", description: "Finding best hotels for you..." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hotel Options */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="hotelOption"
            value="regular"
            checked={hotelType === "regular"}
            onChange={(e) => setHotelType(e.target.value)}
            className="text-blue-600"
          />
          <span className="text-sm font-medium">Upto 4 Rooms</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="hotelOption"
            value="groupDeals"
            checked={hotelType === "groupDeals"}
            onChange={(e) => setHotelType(e.target.value)}
            className="text-blue-600"
          />
          <span className="text-sm font-medium">Group Deals</span>
          <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">new</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* City/Hotel */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">CITY, HOTEL, AREA, BUILDING</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Goa, India"
              value={cityHotel}
              onChange={(e) => setCityHotel(e.target.value)}
              className="pl-10 h-12 border-gray-200"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">CHECK-IN</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-gray-200",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">CHECK-OUT</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-gray-200",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests & Rooms */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">GUESTS & ROOMS</label>
          <Select value={guestsRooms} onValueChange={setGuestsRooms}>
            <SelectTrigger className="h-12 border-gray-200">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="2 Adults, 1 Room" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-1">1 Adult, 1 Room</SelectItem>
              <SelectItem value="2-1">2 Adults, 1 Room</SelectItem>
              <SelectItem value="3-1">3 Adults, 1 Room</SelectItem>
              <SelectItem value="4-1">4 Adults, 1 Room</SelectItem>
              <SelectItem value="2-2">2 Adults, 2 Rooms</SelectItem>
              <SelectItem value="4-2">4 Adults, 2 Rooms</SelectItem>
              <SelectItem value="6-3">6 Adults, 3 Rooms</SelectItem>
              <SelectItem value="8-4">8 Adults, 4 Rooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1 flex items-end">
  <Button
    onClick={handleSearch}
    className="group h-14 px-10 bg-gray-900 hover:bg-black text-white border-2 border-gray-900 font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
  >
    <Search className="!w-5 !h-5 shrink-0" />
    <span>Search</span>
  </Button>
</div>
      </div>
    </div>
  );
};

export default HotelSearch;