import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Home, Search, Users } from "lucide-react";

const HomestaySearch = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">DESTINATION</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Manali, Himachal Pradesh"
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

        {/* Check-out */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">CHECK-OUT</label>
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

        {/* Guests */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">GUESTS</label>
          <Select>
            <SelectTrigger className="h-12 border-gray-200">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="2 Adults" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Adult</SelectItem>
              <SelectItem value="2">2 Adults</SelectItem>
              <SelectItem value="3">3 Adults</SelectItem>
              <SelectItem value="4">4 Adults</SelectItem>
              <SelectItem value="5">5 Adults</SelectItem>
              <SelectItem value="6">6+ Adults</SelectItem>
            </SelectContent>
          </Select>
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

export default HomestaySearch;