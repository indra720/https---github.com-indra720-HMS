




'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge, Eye, X } from "lucide-react";
import BookingCard from "./BookingCard";

interface GuestInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  id_proof_type?: string;
  id_proof_file?: string;
  id_proof_number?: string;
  document_url?: string;
}

interface Booking {
  id: string;
  booking_code: string;
  room_number: string;
  guests: GuestInfo[] | number | string | null;
  room: string;
  check_in: string;
  check_out: string;
  status: string;
  amount: number;
  adults: number;
  children: number;
  slug: string;
  hotel?: string;
  payment_status?: string;
  check_in_time?: string;
  check_out_time?: string;
  guests_data?: GuestInfo[];
}

interface BookingsListProps {
  bookings: Booking[];
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  onStatusUpdate?: (bookingSlug: string, newStatus: string) => void;
  getStatusColor: (status: string) => string;
}

export const BookingsList = ({
  bookings,
  onCheckIn,
  onCheckOut,
  onStatusUpdate,
  getStatusColor,
}: BookingsListProps) => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken"));
    }
  }, []);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

    const handleAction = async (bookingSlug: string, status: string) => {
  if (!accessToken) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingSlug}/`,
      {
        method: "PUT", // 🔥 PATCH ❌  PUT ✅
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Status update error:", data);
      return;
    }

    setLocalBookings(prev =>
      prev.map(b => b.slug === bookingSlug ? { ...b, status } : b)
    );

  } catch (err) {
    console.error("handleAction error:", err);
  }
};



   const handleCheckInOut = async (bookingSlug: string, newStatus: string) => {
  if (!accessToken) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${bookingSlug}/`,
      {
        method: "PUT", // 🔥 MUST BE PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Check-in/out error:", data);
      return;
    }

    setLocalBookings(prev =>
      prev.map(b => b.slug === bookingSlug ? { ...b, status: newStatus } : b)
    );

  } catch (err) {
    console.error("handleCheckInOut error:", err);
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
      console.log(primaryGuest);
      return {
        name: primaryGuest.name ?? "Guest",
        email: primaryGuest.email ?? "Not provided",
        phone: primaryGuest.phone ?? "Not provided",
        address: primaryGuest.address ?? "Not provided",
        image:
          primaryGuest.document_url ??
          "https://via.placeholder.com/150?text=Guest+Image",
        gender: primaryGuest.gender ?? 'Male',
        id_proof_type: primaryGuest.id_proof_type ?? 'Aadhar Card',
        id_proof_number: primaryGuest.id_proof_number ?? '1234567890',
      };
    }

    return {
      name: "Guest",
      email: "Not provided",
      phone: "Not provided",
      address: "Not provided",
      image: "https://via.placeholder.com/150?text=Guest+Image",
      gender: "Male",
      id_proof_type: "Aadhar Card",
      id_proof_number: "1234567890",
    };
  };

  const renderStatusDropdown = (booking: Booking) => (
    <div className="flex items-center space-x-2 relative">
      <div className="relative inline-block">
        <button
          onClick={() =>
            setDropdownOpenId(
              dropdownOpenId === booking.id ? null : booking.id
            )
          }
          disabled={booking.status === "checked_out"}
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-white text-black capitalize border ${getStatusColor(
            booking.status
          )} 
    ${booking.status === "checked_out" ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600 hover:text-white"}`}
        >
          {booking.status === "pending"
            ? "Pending"
            : booking.status === "confirmed"
              ? "Confirmed"
              : booking.status === "checked_in"
                ? "Checked In"
                : booking.status === "checked_out"
                  ? "Completed"
                  : booking.status === "cancel"
                    ? "Cancelled"
                    : booking.status}
        </button>

        {dropdownOpenId === booking.id && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-50">
            <button
              className="block w-full text-left text-xs px-3 py-1 hover:bg-orange-600 hover:text-white"
               onClick={() => handleAction(booking.slug, "pending")}

            >
              Pending
            </button>

            <button
              className="block w-full text-left text-xs px-3 py-1 hover:bg-orange-600 hover:text-white"
              onClick={() => handleAction(booking.slug, "confirmed")}
            >
              Confirmed
            </button>

            <button
              className="block w-full text-left text-xs px-3 py-1 hover:bg-orange-600 hover:text-white"
              onClick={() => handleAction(booking.slug, "cancel")}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {booking.status === "confirmed" && (
        <Button size="sm" onClick={() => handleCheckInOut(booking.slug, "checked_in")}>
          Check In
        </Button>
      )}
      {booking.status === "checked_in" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleCheckInOut(booking.slug, "checked_out")}
        >
          Check Out
        </Button>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border-b">Sr. No.</th>
              <th className="p-2 text-left border-b">Booking Code</th>
              <th className="p-2 text-left border-b">Room</th>
              <th className="p-2 text-left border-b">Check-In</th>
              <th className="p-2 text-left border-b">Check-Out</th>
              <th className="p-2 text-left border-b">Guests</th>
              <th className="p-2 text-left border-b">Status</th>
              <th className="p-2 text-left border-b">Actions</th>
            </tr>
          </thead>
           <tbody>
   {localBookings.map((b, i) => (
    <tr key={b.id}>
      <td>{i + 1}</td>
      <td>{b.booking_code}</td>
      <td>{b.room_number}</td>
      <td>{b.check_in}</td>
      <td>{b.check_out}</td>
       <td>{renderGuestsCount(b.guests)}</td>
      
         <td className="p-2">
  {renderStatusDropdown(b)}
</td>

       
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {localBookings.map((booking, i) => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 mb-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Sr. No.:</span>
                <span>{i + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Booking Code:</span>
                <span className="font-semibold">{booking.booking_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Room:</span>
                <span>{booking.room_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-In:</span>
                <span>{booking.check_in}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-Out:</span>
                <span>{booking.check_out}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Guests:</span>
                <span>{renderGuestsCount(booking.guests)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                {renderStatusDropdown(booking)}
              </div>
              <div className="ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-4xl mx-4">

            {(() => {
              const updatedBooking = localBookings.find(b => b.slug === selectedBooking.slug) || selectedBooking;
              console.log("Updated Booking for Modal:", updatedBooking);
              return (
                <BookingCard
                  user={getBookingUserDetails(updatedBooking)}
                  booking={{
                    code: updatedBooking.booking_code,
                    slug: updatedBooking.slug,
                    room: updatedBooking.room,
                    check_in: updatedBooking.check_in,
                    check_out: updatedBooking.check_out,
                    hotel : updatedBooking?.hotel,
                    payment_status : updatedBooking?.payment_status,
                    check_in_time : updatedBooking?.check_in_time,
                    check_out_time : updatedBooking?.check_out_time,
                    room_number : updatedBooking?.room_number,
                  image: Array.isArray(updatedBooking.guests_data)? updatedBooking.guests_data?.[0]?.id_proof_file || null: null,
                    guests: Number(renderGuestsCount(updatedBooking.guests)) || 0,
                    status:
                      updatedBooking.status === "checked_in"
                        ? "Confirmed"
                        : updatedBooking.status === "cancelled"
                          ? "Cancelled"
                          : updatedBooking.status === "pending"
                            ? "Pending"
                            : "Confirmed",
                  }}
                  onEdit={() => handleCheckInOut(updatedBooking.slug, "checked_in")}
                  onDelete={() => handleCheckInOut(updatedBooking.slug, "checked_out")}
                  onClose={() => setSelectedBooking(null)}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};