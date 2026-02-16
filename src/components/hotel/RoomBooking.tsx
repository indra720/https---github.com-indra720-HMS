
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Users, Bed, Star, Wifi, Car, Coffee, Tv } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

 interface Room {
  id: string;
  slug: string;
  hotel: string;      // 🔥 ADD THIS (hotel slug from API)
  price_per_night: number;
  capacity: number;
  rating: number;
  description: string;
  status: string;
}


export const RoomBooking = (category) => {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [rooms, setRooms] = useState("1");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [submittedGuests, setSubmittedGuests] = useState([]);
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    idType: "",
    idNumber: "",
    specialRequests: "",
    image: null,           // selected file object
    imagePreview: "",
  });
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
    // Check if booking data is set on window object (from RoomCard's Book Now)
    if ((window as any).bookingData) {
      try {
        const { room, step, checkInDate, checkOutDate } = (window as any).bookingData;
        if (room) {
          setSelectedRoom(room);
          setBookingStep(step || 3);
          // Set dates if provided
          if (checkInDate) setCheckInDate(new Date(checkInDate));
          if (checkOutDate) setCheckOutDate(new Date(checkOutDate));
        }
        // Clean up window object
        delete (window as any).bookingData;
      } catch (e) {
        console.error("Error processing booking data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (availableRooms.length && category.category.length) {
      const matched = availableRooms.map((room) => {
        const cat = category.category.find(
          (cat) => cat.name === room.room_category
        );

        return {
          roomId: room.id,
          categoryName: cat?.name || "Unknown",
          price: cat?.price_per_night || "N/A",
        };
      });
      setMatchedCategories(matched);
    }
  }, [availableRooms, category]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'tv': return <Tv className="w-4 h-4" />; 
      case 'parking': return <Car className="w-4 h-4" />;
      case 'coffee': return <Coffee className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = selectedRoom ? selectedRoom.price_per_night : 0;
    const roomCount = parseInt(rooms);
    return nights * roomPrice * roomCount;
  };

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }
    setBookingStep(2);
  };

  const handleRoomSelect = (room: Room, matched: { price?: number; categoryName?: string }) => {
    const updatedRoom: Room = {
      ...room,
      price_per_night: room?.price_per_night || 0,
      type: matched?.categoryName || "Unknown",
    };
    console.log(updatedRoom);
    setSelectedRoom(updatedRoom);
    setBookingStep(3);
  };

const API = import.meta.env.VITE_API_BACKEND_URL;

  const handleBookingSubmit = async () => {
    if (!checkInDate || !checkOutDate) return (alert("blank"));

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/rooms/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    const availableRooms = data.filter(room => room.status === "available");
    setAvailableRooms(availableRooms);

    alert("All Room Fetched Successfully");

    setBookingStep(2);

  };


const handleAddBooking = async () => {
  const toYYYYMMDD = (d) => new Date(d).toISOString().split("T")[0];

  if (!selectedRoom || !checkInDate || !checkOutDate) {
    alert("Booking details missing");
    return;
  }
  const currentHotelSlug = selectedRoom.hotel_slug || localStorage.getItem("currentHotelSlug"); // 🔥 Use hotel slug from selectedRoom
 const payload = {
  hotel: currentHotelSlug,
  room: selectedRoom.slug,
  guests: [],              // abhi guest save nahi kar rahe
  booking_source: "walk_in",
  check_in: toYYYYMMDD(checkInDate),
  check_out: toYYYYMMDD(checkOutDate),
  guests_count: 0,         // 👈 MUST match guests.length
  total_amount: calculateTotal().toString(),
  status: "confirmed",
  payment_status: "unpaid"
};


console.log("Booking Payload:", payload);


  const res = await fetch(`${API}/api/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    console.log(err);
    alert("Booking failed");
    return;
  }

  alert("Booking created successfully");
  
window.dispatchEvent(new Event("booking-created"));

  setBookingStep(4);
};
 


  return (
    <div className="space-y-6">
      {/* Step 1: Search */}
      {bookingStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Available Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      disabled={(date) => date <= (checkInDate || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rooms</Label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Room{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleBookingSubmit} className="w-full" size="lg">
              Search Available Rooms
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Room Selection */}
      {bookingStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Available Rooms</h3>
            <Button variant="outline" onClick={() => setBookingStep(1)}>
              Modify Search
            </Button>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room, i) => {
              const matched = matchedCategories.find((item) => item.roomId === room.id);

              return (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* 🔽 Image Container */}
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      {room?.media && room.media.length > 0 ? (
                        <img
                          src={room?.media[0]?.file} // first image show kar rahe hain
                          alt={room.room_number || "Room image"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // agar image na ho to fallback gray box
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {room?.room_number || "Unknown"}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{room.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">{room.description}</p>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Up to {room.capacity} guests</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{room?.price_per_night || "N/A"}
                          </span>
                          <span className="text-sm text-gray-600">/night</span>
                        </div>
                        <Button onClick={() => handleRoomSelect(room, matched)}>
                          Select Room
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      )}

      {/* Step 3: Guest Information */}
      {bookingStep === 3 && selectedRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show submitted guests */}
              {submittedGuests.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-sm text-green-900 mb-3">Added Guests ({submittedGuests.length})</h4>
                  <div className="space-y-2">
                    {submittedGuests.map((guest, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-green-800">{guest.firstName} {guest.lastName}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Load guest info into form for editing
                              setGuestInfo(guest);
                              // Remove from submitted list
                              setSubmittedGuests(submittedGuests.filter((_, i) => i !== index));
                            }}
                            className="text-blue-500 hover:text-blue-700 h-6 px-2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSubmittedGuests(submittedGuests.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 h-6 px-2"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={guestInfo.firstName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label>Address</Label>
                <Textarea
                  value={guestInfo.address}
                  onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={guestInfo.gender}
                  onChange={(e) => setGuestInfo({ ...guestInfo, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>



              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Type</Label>
                  <Select value={guestInfo.idType} onValueChange={(value) => setGuestInfo({ ...guestInfo, idType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="license">Driver's License</SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ID Number</Label>
                  <Input
                    value={guestInfo.idNumber}
                    onChange={(e) => setGuestInfo({ ...guestInfo, idNumber: e.target.value })}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label>Upload Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setGuestInfo({ ...guestInfo, image: file, imagePreview: URL.createObjectURL(file) });
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />

                {guestInfo.imagePreview && (
                  <img
                    src={guestInfo.imagePreview}
                    alt="Selected"
                    className="mt-2 max-h-48 object-contain border border-gray-300 rounded-md"
                  />
                )}
              </div>


              <div>
                <Label>Special Requests</Label>
                <Textarea
                  value={guestInfo.specialRequests}
                  onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                  placeholder="Any special requests or preferences"
                />
              </div>

              {/* Add More Guest Button */}
              <Button
                variant="outline"
                onClick={() => {
                  if (!guestInfo.firstName || !guestInfo.lastName) {
                    alert("Please fill in at least first and last name");
                    return;
                  }
                  // Add current guest to submitted list
                  setSubmittedGuests([...submittedGuests, guestInfo]);
                  // Reset form
                  setGuestInfo({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    address: "",
                    gender: "",
                    idType: "",
                    idNumber: "",
                    specialRequests: "",
                    image: null,
                    imagePreview: "",
                  });
                }}
                className="w-full mb-2"
              >
                + Add More Guest
              </Button>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setBookingStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (!guestInfo.firstName || !guestInfo.lastName) {
                      alert("Please fill in at least first and last name for the current guest");
                      return;
                    }
                    handleAddBooking();
                  }}
                  className="flex-1"
                >
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Room Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">{selectedRoom.type}</h4>
                <p className="text-sm text-gray-600">{selectedRoom.description}</p>
              </div>

              {/* Dynamic Check-in / Check-out */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Check-in:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-auto px-2 py-1">
                        {checkInDate ? format(checkInDate, "PPP") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-between items-center">
                  <span>Check-out:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-auto px-2 py-1">
                        {checkOutDate ? format(checkOutDate, "PPP") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => date <= (checkInDate || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-between items-center">
                  <span>Guests:</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setGuests((prev) => String(Math.max(1, parseInt(prev) - 1)))}>-</Button>
                    <span>{guests}</span>
                    <Button size="sm" variant="outline" onClick={() => setGuests((prev) => String(Math.min(10, parseInt(prev) + 1)))}>+</Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>Rooms:</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setRooms((prev) => String(Math.max(1, parseInt(prev) - 1)))}>-</Button>
                    <span>{rooms}</span>
                    <Button size="sm" variant="outline" onClick={() => setRooms((prev) => String(Math.min(5, parseInt(prev) + 1)))}>+</Button>
                  </div>
                </div>

                {/* Nights */}
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Room Rate:</span>
                  <span>₹ {selectedRoom.price_per_night}/night</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹ {calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees:</span>
                  <span>₹ {(calculateTotal() * 0.12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">₹ {(calculateTotal() * 1.12).toFixed(2)}</span>
                </div>
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
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">Your reservation has been successfully created.</p>
            <Button onClick={() => setBookingStep(1)}>Make Another Booking</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
