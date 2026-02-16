'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import BookingCard from "./BookingCard";

interface GuestInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  document_url?: string;
}

interface Booking {
  id: string;
  booking_code: string;
  guests: GuestInfo[] | number | string | null;
  room: string;
  check_in: string;
  check_out: string;
  status: string;
  amount: number;
  adults: number;
  children: number;
  slug: string;
}

interface BookingsListProps {
  bookings: Booking[];
  list: any[]
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  getStatusColor: (status: string) => string;
}

export const BookingsList = ({
  bookings,
  list,
  onCheckIn,
  onCheckOut,
  getStatusColor,
}: BookingsListProps) => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken"));
    }
  }, []);

  const handleAction = async (
    bookingSlug: string,
    status: string,
    booking: Booking
  ) => {
    if (!accessToken) {
      console.warn("Access token missing; action skipped");
      return;
    }
    const updateObj = { ...booking, status };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingSlug}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateObj),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Server returned error:", response.status, text);
        throw new Error(`Failed to update booking: ${response.status}`);
      }

      const data = await response.json();
      console.log("Update success:", data);
    } catch (error) {
      console.error("handleAction error:", error);
    }
  };

  const renderGuestsCount = (guests: Booking["guests"]): number | string => {
    const count = getGuestsNumber(guests);
    return count === 0 ? "-" : count;
  };

  const getGuestsNumber = (guests: Booking["guests"]): number => {
    if (Array.isArray(guests)) {
      return guests.length;
    }

    if (typeof guests === "number") {
      return guests;
    }

    if (typeof guests === "string") {
      const parsed = Number(guests);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  };

  const getBookingUserDetails = (booking: Booking) => {
    if (Array.isArray(booking.guests) && booking.guests.length > 0) {
      const primaryGuest = booking.guests[0];
      return {
        name: primaryGuest.name ?? "Guest",
        email: primaryGuest.email ?? "Not provided",
        phone: primaryGuest.phone ?? "Not provided",
        address: primaryGuest.address ?? "Not provided",
        image:
          primaryGuest.document_url ??
          "https://via.placeholder.com/150?text=Guest+Image",
      };
    }

    return {
      name: "Guest",
      email: "Not provided",
      phone: "Not provided",
      address: "Not provided",
      image: "https://via.placeholder.com/150?text=Guest+Image",
    };
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200 text-sm w-full">  <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">Sr. No.</th>
            <th className="p-2 text-left border-b">Name</th>
            <th className="p-2 text-left border-b">Description</th>
          </tr>
        </thead>
          <tbody>
            {list.map((role, i) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{i + 1}</td>
                <td className="p-2 border-b">{role.name}</td>
                <td className="p-2 border-b">{role.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-4xl mx-4">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <BookingCard
              user={getBookingUserDetails(selectedBooking)}
              booking={{
                code: selectedBooking.booking_code,
                room: selectedBooking.room,
                check_in: selectedBooking.check_in,
                check_out: selectedBooking.check_out,
                guests: Number(renderGuestsCount(selectedBooking.guests)) || 0,
                status:
                  selectedBooking.status === "checked_in"
                    ? "Confirmed"
                    : selectedBooking.status === "cancel"
                      ? "Cancelled"
                      : selectedBooking.status === "pending"
                        ? "Pending"
                        : "Confirmed",
              }}
              onEdit={() => onCheckIn(selectedBooking.slug)}
              onDelete={() => onCheckOut(selectedBooking.slug)}
            />
          </div>
        </div>
      )}
    </div>
  );
};