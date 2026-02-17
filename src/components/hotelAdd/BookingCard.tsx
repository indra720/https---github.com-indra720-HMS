import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, CalendarDays, Users, Building2 } from "lucide-react";

interface BookingCardProps {
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string; // ID or passport image
  };
  booking: {
    code: string;
    room: string;
    check_in: string;
    check_out: string;
    guests: number;
    status: "Confirmed" | "Pending" | "Cancelled";
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ user, booking, onEdit, onDelete }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden transform hover:shadow-2xl transition duration-300">
    {/* Left Section - Guest Info (Enhanced) */}
    <div className="md:w-1/3 p-8 bg-blue-50 border-r-2 border-dashed border-blue-200 flex flex-col items-center justify-center">
        <div className="p-1  bg-white ring-4 ring-blue-200 mb-4">
            <img
                src={"https://imgs.search.brave.com/6nAsseK3W7L4Fvv7QT0eZKvFjR2uEVS4jv64Q1D9_9k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/amFncmFuaW1hZ2Vz/LmNvbS9pbWFnZXMv/bmV3aW1nLzEzMDgy/MDI1LzEzXzA4XzIw/MjUtYWFkaGFhcl9z/aW1wbGVfaW1hZ2Vf/MjQwMTE4NTIuanBn"}
                alt="Guest ID"
                className="w-28 h-28 object-cover "
            />
        </div>
        <h2 className="text-2xl font-bold text-blue-800">{user.name}</h2>
        <p className="text-md text-gray-600 font-medium">{user.email}</p>

        <div className="mt-6 w-full space-y-3 text-gray-700 text-sm">
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <Phone size={16} className="text-blue-500 flex-shrink-0" /> <span className="truncate">{user.phone}</span>
            </div>
            <div className="flex items-start gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-1" /> <span className="text-left">{user.address}</span>
            </div>
        </div>
    </div>

    {/* Right Section - Booking Info (Enhanced) */}
    <div className="md:w-2/3 p-8 relative">
        <div className="flex justify-between items-start mb-6 border-b pb-3">
            <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                Booking Details
            </h3>
            <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                <span
                    className={`px-4 py-1 text-sm font-semibold rounded-full shadow-md ${
                        booking.status === "Confirmed"
                            ? "bg-green-500 text-white"
                            : booking.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                    }`}
                >
                    {booking.status}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
            {/* Booking Code */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-blue-400">
                <Building2 size={20} className="text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-xs font-medium text-gray-500">Booking Code</p>
                    <p className="text-lg font-bold">{booking.code}</p>
                </div>
            </div>

            {/* Room Type */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-blue-400">
                <Building2 size={20} className="text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-xs font-medium text-gray-500">Room Type</p>
                    <p className="text-lg font-bold">{booking.room}</p>
                </div>
            </div>

            {/* Check-in */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-cyan-400">
                <CalendarDays size={20} className="text-cyan-600 flex-shrink-0" />
                <div>
                    <p className="text-xs font-medium text-gray-500">Check-in Date</p>
                    <p className="text-lg font-bold">{booking.check_in}</p>
                </div>
            </div>

            {/* Check-out */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-cyan-400">
                <CalendarDays size={20} className="text-cyan-600 flex-shrink-0" />
                <div>
                    <p className="text-xs font-medium text-gray-500">Check-out Date</p>
                    <p className="text-lg font-bold">{booking.check_out}</p>
                </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-blue-400">
                <Users size={20} className="text-blue-600 flex-shrink-0" />
                <div>
                    <p className="text-xs font-medium text-gray-500">Total Guests</p>
                    <p className="text-lg font-bold">{booking.guests}</p>
                </div>
            </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end pt-4 border-t">
            <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
                Edit Booking
            </Button>
            <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
                Cancel Booking
            </Button>
        </div>
    </div>
</div>
  );
};

export default BookingCard;
