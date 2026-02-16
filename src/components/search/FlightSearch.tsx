import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plane, PlaneLanding, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const FlightSearch = () => {
  const { toast } = useToast();
  const [tripMode, setTripMode] = useState("Round Trip");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [travelers, setTravelers] = useState("");
  const [multiCitySegments, setMultiCitySegments] = useState([
    { from: "", to: "", date: undefined },
    { from: "", to: "", date: undefined }
  ]);

  const tripModes = ["One Way", "Round Trip", "Multi-City"];

  const airports = [
    { code: "del", name: "Delhi", fullName: "Indira Gandhi International Airport" },
    { code: "bom", name: "Mumbai", fullName: "Chhatrapati Shivaji International Airport" },
    { code: "blr", name: "Bangalore", fullName: "Kempegowda International Airport" },
    { code: "ccu", name: "Kolkata", fullName: "Netaji Subhas Chandra Bose International Airport" },
    { code: "chn", name: "Chennai", fullName: "Chennai International Airport" },
    { code: "pun", name: "Pune", fullName: "Pune Airport" },
    { code: "amd", name: "Ahmedabad", fullName: "Sardar Vallabhbhai Patel International Airport" },
    { code: "hyd", name: "Hyderabad", fullName: "Rajiv Gandhi International Airport" }
  ];

  const getAirportDisplayName = (code: string) => {
    const airport = airports.find(a => a.code === code);
    return airport ? airport.fullName : "";
  };

  const validateFlightSearch = () => {
    if (!fromAirport) {
      toast({ title: "Error", description: "Please select departure airport", variant: "destructive" });
      return false;
    }
    if (!toAirport) {
      toast({ title: "Error", description: "Please select destination airport", variant: "destructive" });
      return false;
    }
    if (fromAirport === toAirport) {
      toast({ title: "Error", description: "Departure and destination cannot be same", variant: "destructive" });
      return false;
    }
    if (!departureDate) {
      toast({ title: "Error", description: "Please select departure date", variant: "destructive" });
      return false;
    }
    if (tripMode === "Round Trip" && !returnDate) {
      toast({ title: "Error", description: "Please select return date", variant: "destructive" });
      return false;
    }
    if (tripMode === "Round Trip" && returnDate && departureDate && returnDate <= departureDate) {
      toast({ title: "Error", description: "Return date must be after departure date", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (validateFlightSearch()) {
      toast({ title: "Searching Flights", description: "Finding best flights for you..." });
    }
  };

  const addMultiCitySegment = () => {
    if (multiCitySegments.length < 6) {
      setMultiCitySegments([...multiCitySegments, { from: "", to: "", date: undefined }]);
    }
  };

  const removeMultiCitySegment = (index: number) => {
    if (multiCitySegments.length > 2) {
      setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index));
    }
  };

  const renderMultiCitySearch = () => (
    <div className="space-y-4">
      {multiCitySegments.map((segment, index) => (
        <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2 lg:col-span-4">
            <span className="text-sm font-medium text-gray-600">Flight {index + 1}</span>
            {multiCitySegments.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMultiCitySegment(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>

          {/* From */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">FROM</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Select>
                <SelectTrigger className="pl-10 h-12 border-gray-200">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="del">Delhi (DEL)</SelectItem>
                  <SelectItem value="bom">Mumbai (BOM)</SelectItem>
                  <SelectItem value="blr">Bangalore (BLR)</SelectItem>
                  <SelectItem value="ccu">Kolkata (CCU)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">TO</label>
            <div className="relative">
              <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Select>
                <SelectTrigger className="pl-10 h-12 border-gray-200">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bom">Mumbai (BOM)</SelectItem>
                  <SelectItem value="del">Delhi (DEL)</SelectItem>
                  <SelectItem value="blr">Bangalore (BLR)</SelectItem>
                  <SelectItem value="ccu">Kolkata (CCU)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">DEPARTURE</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal border-gray-200"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Select date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Travellers (only on first segment) */}
          {index === 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">TRAVELLERS & CLASS</label>
              <Select>
                <SelectTrigger className="h-12 border-gray-200">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="1 Traveller" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-economy">1 Traveller, Economy</SelectItem>
                  <SelectItem value="2-economy">2 Travellers, Economy</SelectItem>
                  <SelectItem value="1-business">1 Traveller, Business</SelectItem>
                  <SelectItem value="2-business">2 Travellers, Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={addMultiCitySegment}
          disabled={multiCitySegments.length >= 6}
          className="text-[hsl(var(--makemytrip-blue))] border-[hsl(var(--makemytrip-blue))]"
        >
          + Add Another Flight
        </Button>

        <Button
          className="px-8 h-12 bg-[hsl(var(--makemytrip-blue))] hover:bg-[hsl(var(--makemytrip-blue-hover))] text-white font-semibold text-base rounded-lg transition-all duration-200 hover:scale-105"
        >
          SEARCH
        </Button>
      </div>
    </div>
  );

  const renderRegularFlightSearch = () => (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
      {/* From */}
      <div className="lg:col-span-1 relative">
        <label className="block text-xs font-medium text-gray-600 mb-1">FROM</label>
        <div className="relative">
          <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Select value={fromAirport} onValueChange={setFromAirport}>
            <SelectTrigger className="pl-10 h-12 border-gray-200">
              <SelectValue placeholder="Delhi" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.name} - {airport.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 mt-1">{fromAirport ? getAirportDisplayName(fromAirport) : "Select departure airport"}</p>
      </div>

      {/* To */}
      <div className="lg:col-span-1 relative">
        <label className="block text-xs font-medium text-gray-600 mb-1">TO</label>
        <div className="relative">
          <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Select value={toAirport} onValueChange={setToAirport}>
            <SelectTrigger className="pl-10 h-12 border-gray-200">
              <SelectValue placeholder="Mumbai" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  {airport.name} - {airport.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 mt-1">{toAirport ? getAirportDisplayName(toAirport) : "Select destination airport"}</p>
      </div>

      {/* Departure Date */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">DEPARTURE</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal border-gray-200",
                !departureDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {departureDate ? format(departureDate, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={departureDate}
              onSelect={setDepartureDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-gray-500 mt-1">Friday</p>
      </div>

      {/* Return Date */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">RETURN</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={tripMode === "One Way"}
              className={cn(
                "w-full h-12 justify-start text-left font-normal border-gray-200",
                (!returnDate || tripMode === "One Way") && "text-muted-foreground",
                tripMode === "One Way" && "opacity-50 cursor-not-allowed"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate && tripMode !== "One Way" ? format(returnDate, "PPP") : <span>Select date</span>}
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
        <p className="text-xs text-gray-500 mt-1">Sunday</p>
      </div>

      {/* Travellers & Class */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">TRAVELLERS & CLASS</label>
        <Select value={travelers} onValueChange={setTravelers}>
          <SelectTrigger className="h-12 border-gray-200">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="1 Traveller" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-economy">1 Traveller, Economy</SelectItem>
            <SelectItem value="2-economy">2 Travellers, Economy</SelectItem>
            <SelectItem value="3-economy">3 Travellers, Economy</SelectItem>
            <SelectItem value="4-economy">4 Travellers, Economy</SelectItem>
            <SelectItem value="1-business">1 Traveller, Business</SelectItem>
            <SelectItem value="2-business">2 Travellers, Business</SelectItem>
            <SelectItem value="1-first">1 Traveller, First Class</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">{travelers ? travelers.split('-')[1] : "Select class"}</p>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="w-full h-12 mt-5 bg-gradient-to-r from-[#0f172a] to-[#334155] hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-all duration-200 hover:scale-105"
      >
        <Search className="!w-5 !h-5" />

        SEARCH
      </Button>


    </div>
  );

  return (
    <div className="space-y-6">
      {/* Trip Mode Radio Buttons */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-lg w-fit">
        {tripModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setTripMode(mode)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              tripMode === mode
                ? "bg-white text-[hsl(var(--makemytrip-blue))] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Main Search Form */}
      {tripMode === "Multi-City" ? renderMultiCitySearch() : renderRegularFlightSearch()}

      {/* Special Options */}
      {tripMode !== "Multi-City" && (
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="student" />
            <label htmlFor="student" className="text-sm text-gray-600">Student Fare</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="senior" />
            <label htmlFor="senior" className="text-sm text-gray-600">Senior Citizen</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="armed" />
            <label htmlFor="armed" className="text-sm text-gray-600">Armed Forces</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;