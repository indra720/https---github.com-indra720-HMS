import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Bus, Users, Search } from "lucide-react";

const BusSearch = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* From City */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">FROM</label>
          <div className="relative">
            <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select>
              <SelectTrigger className="pl-10 h-12 border-gray-200">
                <SelectValue placeholder="Delhi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="del">Delhi</SelectItem>
                <SelectItem value="bom">Mumbai</SelectItem>
                <SelectItem value="blr">Bangalore</SelectItem>
                <SelectItem value="pun">Pune</SelectItem>
                <SelectItem value="hyd">Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500 mt-1">Delhi</p>
        </div>

        {/* To City */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">TO</label>
          <div className="relative">
            <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select>
              <SelectTrigger className="pl-10 h-12 border-gray-200">
                <SelectValue placeholder="Manali" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manali">Manali</SelectItem>
                <SelectItem value="shimla">Shimla</SelectItem>
                <SelectItem value="goa">Goa</SelectItem>
                <SelectItem value="agra">Agra</SelectItem>
                <SelectItem value="jaipur">Jaipur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manali</p>
        </div>

        {/* Travel Date */}
        <div className="lg:col-span-1">
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
          <p className="text-xs text-gray-500 mt-1">Friday</p>
        </div>

        {/* Passengers */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">PASSENGERS</label>
          <Select>
            <SelectTrigger className="h-12 border-gray-200">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="1 Passenger" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5 Passengers</SelectItem>
              <SelectItem value="6">6 Passengers</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">1 Passenger</p>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1 flex items-end">
          <Button 
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

export default BusSearch;