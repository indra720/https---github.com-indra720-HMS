import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Calendar as CalendarIcon, Users, Phone, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const RestaurantSearch = () => {
  const [date, setDate] = useState<Date>();
  const [bookingType, setBookingType] = useState("table");
  const [people, setPeople] = useState("2");
  const [time, setTime] = useState("7:00 PM");

  return (
    <div className="space-y-6">
      {/* Booking Type Selection */}
      <div className="relative flex bg-gray-200 p-1 rounded-xl">
        {/* Sliding active indicator */}
        <div
          className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-orange-500 transition-[left] duration-[1500ms] ease-in-out`}
          style={{
            left: bookingType === "table" ? "0%" : "50%",
          }}
        />

        {/* Buttons */}
        <button
          onClick={() => setBookingType("table")}
          className={`flex-1 z-10 text-center font-medium px-3 py-2 transition-colors duration-200 ${bookingType === "table" ? "text-white" : "text-gray-700"
            }`}
        >
          Table Booking
        </button>

        <button
          onClick={() => setBookingType("call")}
          className={`flex-1 z-10 text-center font-medium px-3 py-2 transition-colors duration-200 ${bookingType === "call" ? "text-white" : "text-gray-700"
            }`}
        >
          Call for Booking
        </button>
      </div>

      {bookingType === "table" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* City/Restaurant Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">City / Restaurant</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Enter city or restaurant name"
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Time</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                <SelectItem value="1:30 PM">1:30 PM</SelectItem>
                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                <SelectItem value="7:30 PM">7:30 PM</SelectItem>
                <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                <SelectItem value="8:30 PM">8:30 PM</SelectItem>
                <SelectItem value="9:00 PM">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* People Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">People</label>
            <Select value={people} onValueChange={setPeople}>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 People</SelectItem>
                <SelectItem value="3">3 People</SelectItem>
                <SelectItem value="4">4 People</SelectItem>
                <SelectItem value="5">5 People</SelectItem>
                <SelectItem value="6">6 People</SelectItem>
                <SelectItem value="7">7 People</SelectItem>
                <SelectItem value="8">8 People</SelectItem>
                <SelectItem value="9">9+ People</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Restaurant Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Restaurant</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Enter restaurant name"
                className="pl-10"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Enter your phone number"
                className="pl-10"
                type="tel"
              />
            </div>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Preferred Call Time</label>
            <Select defaultValue="now">
              <SelectTrigger>
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Call Now</SelectItem>
                <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="special-occasion" className="rounded" />
          <label htmlFor="special-occasion" className="text-sm text-gray-600">
            Special occasion (Birthday, Anniversary, etc.)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="dietary-requirements" className="rounded" />
          <label htmlFor="dietary-requirements" className="text-sm text-gray-600">
            Special dietary requirements
          </label>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <Button
          className="bg-gradient-to-r from-[#0f172a]  to-[#334155] hover:bg-blue-600 text-white px-12 py-3 text-lg font-semibold rounded-l shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {bookingType === "table" ? "FIND RESTAURANTS" : "REQUEST CALLBACK"}
        </Button>
      </div>
    </div>
  );
};

export default RestaurantSearch;