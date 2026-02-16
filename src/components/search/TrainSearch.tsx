import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Train, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TrainSearch = () => {
  const { toast } = useToast();
  const [searchType, setSearchType] = useState("bookTickets");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [travelDate, setTravelDate] = useState<Date>();
  const [classPassengers, setClassPassengers] = useState("");
  const [pnrNumber, setPnrNumber] = useState("");
  const [trainNumber, setTrainNumber] = useState("");

  const stations = [
    { code: "NDLS", name: "New Delhi", fullName: "New Delhi Railway Station" },
    { code: "CSTM", name: "Mumbai Central", fullName: "Mumbai Central Railway Station" },
    { code: "SBC", name: "Bengaluru City", fullName: "Bengaluru City Railway Station" },
    { code: "HWH", name: "Howrah", fullName: "Howrah Railway Station" },
    { code: "MAS", name: "Chennai Central", fullName: "Chennai Central Railway Station" },
    { code: "PUNE", name: "Pune Junction", fullName: "Pune Junction Railway Station" }
  ];

  const validateTrainSearch = () => {
    if (searchType === "bookTickets") {
      if (!fromStation || !toStation) {
        toast({ title: "Error", description: "Please select both departure and destination stations", variant: "destructive" });
        return false;
      }
      if (fromStation === toStation) {
        toast({ title: "Error", description: "Departure and destination cannot be same", variant: "destructive" });
        return false;
      }
      if (!travelDate) {
        toast({ title: "Error", description: "Please select travel date", variant: "destructive" });
        return false;
      }
    } else if (searchType === "checkPNR") {
      if (!pnrNumber || pnrNumber.length !== 10) {
        toast({ title: "Error", description: "Please enter a valid 10-digit PNR number", variant: "destructive" });
        return false;
      }
    } else if (searchType === "liveStatus") {
      if (!trainNumber || trainNumber.length < 4) {
        toast({ title: "Error", description: "Please enter a valid train number", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleSearch = () => {
    if (validateTrainSearch()) {
      if (searchType === "bookTickets") {
        toast({ title: "Searching Trains", description: "Finding available trains..." });
      } else if (searchType === "checkPNR") {
        toast({ title: "Checking PNR", description: `Fetching status for PNR: ${pnrNumber}` });
      } else {
        toast({ title: "Live Status", description: `Fetching live status for train: ${trainNumber}` });
      }
    }
  };

  const renderBookingForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* From Station */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">FROM</label>
        <div className="relative">
          <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Select value={fromStation} onValueChange={setFromStation}>
            <SelectTrigger className="pl-10 h-12 border-gray-200">
              <SelectValue placeholder="New Delhi (NDLS)" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.code} value={station.code}>
                  {station.name} ({station.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {fromStation ? stations.find(s => s.code === fromStation)?.fullName : "Select departure station"}
        </p>
      </div>

      {/* To Station */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">TO</label>
        <div className="relative">
          <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Select value={toStation} onValueChange={setToStation}>
            <SelectTrigger className="pl-10 h-12 border-gray-200">
              <SelectValue placeholder="Mumbai Central (CSTM)" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.code} value={station.code}>
                  {station.name} ({station.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {toStation ? stations.find(s => s.code === toStation)?.fullName : "Select destination station"}
        </p>
      </div>

      {/* Travel Date */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">TRAVEL DATE</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal border-gray-200",
                !travelDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {travelDate ? format(travelDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={travelDate}
              onSelect={setTravelDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-gray-500 mt-1">{travelDate ? format(travelDate, "EEEE") : "Select travel date"}</p>
      </div>

      {/* Class & Passengers */}
      <div className="lg:col-span-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">CLASS & PASSENGERS</label>
        <Select value={classPassengers} onValueChange={setClassPassengers}>
          <SelectTrigger className="h-12 border-gray-200">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="All Classes, 1 Adult" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-1">All Classes, 1 Adult</SelectItem>
            <SelectItem value="3a-1">3A, 1 Adult</SelectItem>
            <SelectItem value="2a-1">2A, 1 Adult</SelectItem>
            <SelectItem value="1a-1">1A, 1 Adult</SelectItem>
            <SelectItem value="sl-1">Sleeper, 1 Adult</SelectItem>
            <SelectItem value="all-2">All Classes, 2 Adults</SelectItem>
            <SelectItem value="all-4">All Classes, 4 Adults</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">{classPassengers ? classPassengers.split('-')[0] : "Select class"}</p>
      </div>

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
  );

  const renderPNRForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">PNR NUMBER</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Enter 10-digit PNR number"
            value={pnrNumber}
            onChange={(e) => setPnrNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="pl-10 h-12 border-gray-200"
            maxLength={10}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Enter your 10-digit PNR number</p>
      </div>
      <div className="flex items-end">
        <Button 
          onClick={handleSearch}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-all duration-200 hover:scale-105"
        >
          CHECK STATUS
        </Button>
      </div>
    </div>
  );

  const renderLiveStatusForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">TRAIN NUMBER</label>
        <div className="relative">
          <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Enter train number (e.g., 12003)"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="pl-10 h-12 border-gray-200"
            maxLength={6}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Enter train number to check live status</p>
      </div>
      <div className="flex items-end">
        <Button 
          onClick={handleSearch}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-lg transition-all duration-200 hover:scale-105"
        >
          LIVE STATUS
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Train Options */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="trainOption" 
            value="bookTickets" 
            checked={searchType === "bookTickets"} 
            onChange={(e) => setSearchType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Book Train Tickets</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="trainOption" 
            value="checkPNR" 
            checked={searchType === "checkPNR"} 
            onChange={(e) => setSearchType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Check PNR Status</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="trainOption" 
            value="liveStatus" 
            checked={searchType === "liveStatus"} 
            onChange={(e) => setSearchType(e.target.value)}
            className="text-blue-600" 
          />
          <span className="text-sm font-medium">Live Train Status</span>
        </label>
      </div>
      
      {/* Dynamic Form Based on Selection */}
      {searchType === "bookTickets" && renderBookingForm()}
      {searchType === "checkPNR" && renderPNRForm()}
      {searchType === "liveStatus" && renderLiveStatusForm()}
    </div>
  );
};

export default TrainSearch;