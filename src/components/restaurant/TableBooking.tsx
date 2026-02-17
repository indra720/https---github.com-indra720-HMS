
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Users, Clock, MapPin, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Table {
  id: string;
  capacity: number;
  location: string;
  type: string;
  available: boolean;
  x: number;
  y: number;
  slug: string;
  table_code: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  tables: number;
}

export const TableBooking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const accessToken = localStorage.getItem('accessToken'); // get token from localStorage

  // console.log(selectedTable)
  const [reservationInfo, setReservationInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    occasion: ""
  });
  const [tables, setTables] = useState<Table[]>([]);

  // const tables: Table[] = [
  //   { id: "T01", capacity: 2, location: "Window", type: "Standard", available: true, x: 50, y: 50 },
  //   { id: "T02", capacity: 4, location: "Center", type: "Standard", available: true, x: 150, y: 50 },
  //   { id: "T03", capacity: 6, location: "Private", type: "VIP", available: true, x: 250, y: 50 },
  //   { id: "T04", capacity: 2, location: "Patio", type: "Outdoor", available: true, x: 50, y: 150 },
  //   { id: "T05", capacity: 8, location: "Center", type: "Family", available: true, x: 150, y: 150 },
  //   { id: "T06", capacity: 4, location: "Bar", type: "Counter", available: false, x: 250, y: 150 },
  //   { id: "T07", capacity: 3, location: "Corner", type: "Booth", available: true, x: 350, y: 50 },
  //   { id: "T08", capacity: 5, location: "Garden", type: "Outdoor", available: true, x: 350, y: 150 },
  // ];

  const timeSlots: TimeSlot[] = [
    { time: "11:00 AM", available: true, tables: 6 },
    { time: "11:30 AM", available: true, tables: 4 },
    { time: "12:00 PM", available: true, tables: 8 },
    { time: "12:30 PM", available: true, tables: 5 },
    { time: "1:00 PM", available: true, tables: 3 },
    { time: "1:30 PM", available: false, tables: 0 },
    { time: "2:00 PM", available: true, tables: 7 },
    { time: "6:00 PM", available: true, tables: 6 },
    { time: "6:30 PM", available: true, tables: 4 },
    { time: "7:00 PM", available: true, tables: 2 },
    { time: "7:30 PM", available: false, tables: 0 },
    { time: "8:00 PM", available: true, tables: 5 },
    { time: "8:30 PM", available: true, tables: 3 },
    { time: "9:00 PM", available: true, tables: 8 },
  ];

  const getTableTypeColor = (type: string) => {
    switch (type) {
      case "VIP": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Outdoor": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Family": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Booth": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getAvailableTables = () => {
    const partyNumber = parseInt(partySize);
    return tables.filter(table =>
      table.available &&
      table.capacity >= partyNumber &&
      table.capacity <= partyNumber + 2
    );
  };


  const handleSearch = async () => {
    if (!selectedDate || !selectedTime) {
      // alert("Please select both date and time before proceeding.");
      toast({
        title: "Missing Information",
        description: "Please select both date and time before proceeding.",
        className: "bg-amber-500 text-white border-none shadow-md"
      });

      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/tables/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
      });
      const data = await response.json();
      if (response.ok) {
        const availableTables = data
          .filter((table: any) => table.status === "available")
          .map((table: any, index: number) => ({
            id: table.id ?? table.code ?? `T-${index + 1}`,
            capacity: table.capacity ?? table.seats,
            location: table.location ?? "Unknown",
            type: table.type ?? "Standard",
            available: true,            // ✅ component ke filter ke liye
            x: table.x ?? (index % 5) * 80 + 50,  // fallback positioning
            y: table.y ?? Math.floor(index / 5) * 80 + 50,
            slug: table?.slug,
            table_code: table?.table_code,
          }));
        console.log(data, availableTables);
        setTables(availableTables);
        setBookingStep(2);
      }

      else {
        throw new Error(`Failed to get tables: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error getting tables:", error);
    }
    setBookingStep(2);
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);

    setBookingStep(3);
  };

  const handleReservationSubmit = async () => {
    if (!selectedTable?.slug || !selectedDate || !selectedTime) return;

    const time = selectedTime;
    const cleanTime = time.replace(/ AM| PM/, "");

    const reservation = {
      table: selectedTable?.slug,
      reservation_date: selectedDate?.toISOString().split("T")[0],
      reservation_time: cleanTime,
      full_name: reservationInfo?.name,
      email: reservationInfo?.email,
      phone: reservationInfo?.phone,
      special_requests: reservationInfo?.specialRequests,
      occasion: reservationInfo?.occasion,
    };
    console.log(reservation);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/table-reservations/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // ✅ yeh zaroori hai
          Authorization: `Bearer ${accessToken}`, // ✅ token agar protected API hai
        },
        body: JSON.stringify(reservation),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // alert("Table reserved successfully! Confirmation details will be sent to your email.");
        toast({
          title: "Reservation Confirmed",
          description: "We've emailed your confirmation details.",
          className: "bg-emerald-700 text-white border-none shadow-lg"
        });

        setBookingStep(4);
      }
      else { throw new Error(`Failed to submit reservation: ${await response.text()}`); }
    }
    catch (error) {
      console.error("Error submitting reservation:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Search */}
      {bookingStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Reserve a Table</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem
                        key={slot.time}
                        value={slot.time}
                        disabled={!slot.available}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{slot.time}</span>
                          {slot.available ? (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {slot.tables} tables
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Full
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Party Size</Label>
                <Select value={partySize} onValueChange={setPartySize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full" size="lg">
              <Clock className="mr-2 w-4 h-4" />
              Check Availability
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Table Selection */}
      {bookingStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Available Tables</h3>
            <Button variant="outline" onClick={() => setBookingStep(1)}>
              Modify Search
            </Button>
          </div>

          {/* Visual Floor Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Floor Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-50 rounded-lg p-4 h-80 mb-6 overflow-auto">
                <div className="text-xs text-gray-500 mb-2">Click on available tables to select</div>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                  {getAvailableTables().map((table, i) => (
                    <div
                      key={table.id}
                      className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${table.available
                        ? `${getTableTypeColor(table.type)} border-gray-300 hover:shadow-md`
                        : 'bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed'
                        }`}
                      onClick={() => table.available && handleTableSelect(table)}
                    >
                      <span className="text-xs font-bold">{table.table_code}</span>
                      <span className="text-xs">{table.capacity}p</span>
                    </div>
                  ))}
                </div>


                {/* Legend */}
                <div className="absolute bottom-2 right-2 bg-white p-3 rounded border text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-200 rounded"></div>
                      <span>VIP</span>
                      <div className="w-3 h-3 bg-green-200 rounded ml-2"></div>
                      <span>Outdoor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-200 rounded"></div>
                      <span>Family</span>
                      <div className="w-3 h-3 bg-orange-200 rounded ml-2"></div>
                      <span>Booth</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Table List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAvailableTables().map((table, i) => (
              <Card key={table.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTableSelect(table)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Table {table.table_code}</h4>
                    <Badge className={getTableTypeColor(table.type)}>{table.type}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Seats {table.capacity} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{table.location} location</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    Select Table
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Reservation Details */}
      {bookingStep === 3 && selectedTable && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={reservationInfo.name}
                  onChange={(e) => setReservationInfo({ ...reservationInfo, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={reservationInfo.email}
                  onChange={(e) => setReservationInfo({ ...reservationInfo, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={reservationInfo.phone}
                  onChange={(e) => setReservationInfo({ ...reservationInfo, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label>Special Occasion (Optional)</Label>
                <Select value={reservationInfo.occasion} onValueChange={(value) => setReservationInfo({ ...reservationInfo, occasion: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="business">Business Meeting</SelectItem>
                    <SelectItem value="date">Date Night</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Special Requests</Label>
                <Textarea
                  value={reservationInfo.specialRequests}
                  onChange={(e) => setReservationInfo({ ...reservationInfo, specialRequests: e.target.value })}
                  placeholder="Any dietary restrictions, preferences, or special requests"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setBookingStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleReservationSubmit} className="flex-1">
                  Confirm Reservation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Reservation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span>{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedTime}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{partySize} {parseInt(partySize) === 1 ? 'Person' : 'People'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Table {selectedTable.table_code} </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Table Details</h4>
                <div className="space-y-1 text-sm">
                  <p>Type: <span className="font-medium">{selectedTable.type}</span></p>
                  <p>Capacity: <span className="font-medium">{selectedTable.capacity} people</span></p>
                  {/* <p>Location: <span className="font-medium">{selectedTable.location}</span></p> */}
                </div>
              </div>

              {reservationInfo.occasion && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-1">Special Occasion</h4>
                  <p className="text-sm capitalize">{reservationInfo.occasion}</p>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Confirmation</h4>
                <p className="text-sm">Your table will be held for 15 minutes past your reservation time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {bookingStep === 4 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Table Reserved!</h3>
            <p className="text-gray-600 mb-6">Your reservation has been confirmed. We look forward to serving you!</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left max-w-md mx-auto">
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>reservations@restaurant.com</span>
                </div>
              </div>
            </div>

            <Button onClick={() => setBookingStep(1)}>Make Another Reservation</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};