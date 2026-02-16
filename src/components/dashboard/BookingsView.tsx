import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsList } from "../hotel/BookingsList";
import { getStatusColor } from "../hotel/utils";

interface Booking {
  id: string;
  booking_code: string;
  guests: any;
  room: string;
  check_in: string;
  check_out: string;
  status: string;
  amount: number;
  adults: number;
  children: number;
  slug: string;
}

export const BookingsView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken"));
    }
  }, []);

  const handleGetBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setBookings(data);
      if (!response.ok) {
        console.error("Error fetching bookings:", response.status);
        return;
      }
    } catch (error) {
      console.error("Error in fetching bookings:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      handleGetBookings();
    }
  }, [accessToken]);

  const handleCheckIn = async (bookingId: string) => {
    const status = { status: "checked_in" };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingId}/check-in/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(status),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: "Active" } : booking
        ));
      }
      return;
    }
    catch (error) {
      console.error("Error in checking in booking:", error);
      return;
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    const status = { status: "checked_out" };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingId}/check-out/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(status),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: "Completed" } : booking
        ));
      }
      return;
    }
    catch (error) {
      console.error("Error in checking out booking:", error);
      return;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bookings Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <BookingsList
            bookings={bookings}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            getStatusColor={getStatusColor}
          /> */}
        </CardContent>
      </Card>
    </div>
  );
};