
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; 
import {
  Phone,
  MapPin,
  CalendarDays,
  Users,
  Building2,
  X,
  Edit3,
  IdCard,
  FileText,
  UserCircle,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 

// Interface Definitions (Kept the same)
interface BookingCardProps {
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
    gender?: string;
    id_proof_type?: string;
    id_proof_number?: string;
  };
  booking: {
    code: string;
    room: string;
    check_in: string;
    check_out: string;
    guests: number;
    status: "Confirmed" | "Pending" | "Cancelled";
    special_request?: string;
    image?: null | string;
    slug: string;
    hotel?: string;
    payment_status?: string;
    check_in_time?: string;
    check_out_time?: string;
    room_number?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ user, booking, onEdit, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [editedBooking, setEditedBooking] = useState(booking);

  const navigate = useNavigate();

  const handleChangeBooking = (field: keyof typeof editedBooking, value: any) => {
    setEditedBooking({ ...editedBooking, [field]: value });
  };

  const handleChangeUser = (field: keyof typeof editedUser, value: any) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  // const handleUpdate = async() => {
  //   const token = localStorage.getItem('accessToken');
  //   if (!token) {
  //     console.error("No access token found. Please log in.");
  //     return;
  //   }
  //   const ob = {
  //     hotel: editedBooking.hotel || "",
  //     room: editedBooking.room || "",
  //     guests: [
  //       {
  //         age: null,
  //         slug: editedBooking.slug || "",
  //         first_name: editedUser.name?.split(" ")[0] || "",
  //         last_name: editedUser.name?.split(" ")[1] || "",
  //         email: editedUser.email || "",
  //         phone: editedUser.phone || "",
  //         address: editedUser.address || "",
  //         gender: editedUser.gender || "",
  //         id_proof_type: editedUser.id_proof_type || "",
  //         id_proof_number: editedUser.id_proof_number || "",
  //         special_request: editedBooking.special_request || "",
  //       }
  //     ],
  //     room_number: editedBooking.room_number || "",
  //     booking_code: editedBooking.code || "",
  //     slug: editedBooking.slug || "",
  //     check_in: editedBooking.check_in || "",
  //     check_out: editedBooking.check_out || "",
  //     guests_count: editedBooking.guests || null,
  //     status: editedBooking.status || "",
  //     payment_status: editedBooking.payment_status || "",
  //     check_in_time: editedBooking.check_in_time || "",
  //     check_out_time: editedBooking.check_out_time || "",
  //   };

  //   console.log("Prepared Booking Update Object:", ob);
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${editedBooking?.slug}/`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(ob),
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }
      
  //     const data = await response.json();
  //     console.log("Booking updated successfully:", data);
  //     setIsEditing(false);
  //     if (onEdit) onEdit();
  //   } catch(err) {
  //     console.error("Error updating booking:", err);
  //     setIsEditing(false);
  //   }
  // };

  console.log("Sending:", editedBooking);

  const handleUpdate = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return console.error("No access token found.");

const ob = {
  hotel: editedBooking.hotel,
  room: editedBooking.room,

  guests: [
    {
      age: null,
      first_name: editedUser.name?.split(" ")[0] || "",   // split name
      last_name: editedUser.name?.split(" ")[1] || "",    // safe split
      email: editedUser.email,
      phone: editedUser.phone,
      address: editedUser.address,
      gender: editedUser.gender,
      id_proof_type: editedUser.id_proof_type,
      id_proof_number: editedUser.id_proof_number,
      special_request: editedBooking.special_request,
    }
  ],

  room_number: editedBooking.room_number,

  // booking_code comes from editedBooking.code (correct)
  booking_code: editedBooking.code,

  // slug removed as you said (not sending slug)

  check_in: editedBooking.check_in,
  check_out: editedBooking.check_out,

  // guests_count comes from editedBooking.guests (value provided by you)
  guests_count: editedBooking.guests,

  status: "checked_in", // editedBooking.status,
  payment_status: editedBooking.payment_status,
  check_in_time: editedBooking.check_in_time,
  check_out_time: editedBooking.check_out_time,
};



  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/bookings/${editedBooking.slug}/`,
      {
        method: "PATCH", // FIXED
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ob),
      }
    );

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    console.log("Booking updated:", data);
    setIsEditing(false);
    onEdit?.();
  } catch (err) {
    console.error("Error updating booking:", err);
    setIsEditing(false);
  }
};


  const handleCancelEdit = () => {
    setEditedUser(user);
    setEditedBooking(booking);
    setIsEditing(false);
  };
  
  const getStatusClasses = (status: BookingCardProps['booking']['status']) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-gray-800";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };
  // --- RENDERING FUNCTION ---
  return (
    // Mobile: Fixed full-screen overlay (fixed inset-0 h-screen) to ensure no overflow outside viewport.
    // Desktop: Inline centered card (relative, max-w-4xl, auto height).
    // Scrollable content uses flex-1 overflow-y-auto with pt-12 pb-24 on mobile for top clearance (image fix) and bottom button clearance.
    // Added break-words to booking value display for long text prevention of horizontal overflow.
    <div className="fixed inset-0 z-50 w-full h-screen mx-0 bg-white shadow-2xl rounded-none flex flex-col overflow-hidden md:relative md:inset-auto md:h-auto md:min-h-fit md:max-w-4xl md:mx-auto md:mt-10 md:mb-10 md:rounded-2xl transform transition duration-300">
      
      {/* Close Button (Absolute position) */}
      <button
        className="cursor-pointer absolute top-4 right-4 z-50 text-gray-500 hover:text-red-500 transition duration-200"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Scrollable Content Container */}
      {/* Mobile: flex-1 h-full pt-12 pb-24 for top image clearance and button clearance, overflow-y-auto */}
      {/* Desktop: flex-1 pt-0 pb-0, normal flow */}
      <div className="flex flex-col md:flex-row flex-1 h-full overflow-y-auto pt-12 md:pt-0 pb-24 md:pb-0">
        
        {/* Left Section - Guest Info */}
        <div className="w-full md:w-1/3 p-4 md:p-8 bg-blue-50 border-b md:border-b-0 md:border-r-2 border-dashed border-blue-200 flex flex-col items-center justify-start flex-shrink-0">
          <div className="relative p-1 bg-white ring-4 ring-blue-200 mb-4 rounded-full">
            <img
            src={editedUser?.image}
              alt="Guest ID"
              className="w-24 h-24 object-cover rounded-full"
            />
            {isEditing && (
              <button
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full shadow hover:bg-blue-700 transition"
                onClick={() => alert("Image change feature here")}
                title="Change Image"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>

          <h2 className="text-xl font-bold text-blue-800 text-center mb-4">Guest Details</h2>

          {/* Guest Details List */}
          <div className="w-full space-y-2 text-gray-700 text-sm max-w-md">
            
            {/* Name */}
            <DetailItem 
              icon={<UserCircle size={16} className="text-blue-500" />}
              label="Name"
              value={editedUser.name}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("name", v)}
            />

            {/* Email */}
            <DetailItem 
              icon={<Mail size={16} className="text-blue-500" />}
              label="Email"
              value={editedUser.email}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("email", v)}
              type="email"
            />

            {/* Phone */}
            <DetailItem 
              icon={<Phone size={16} className="text-blue-500" />}
              label="Phone"
              value={editedUser.phone}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("phone", v)}
              type="tel"
            />
            
            {/* Gender */}
            <DetailItem 
              icon={<UserCircle size={16} className="text-blue-500" />}
              label="Gender"
              value={editedUser.gender || "N/A"}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("gender", v)}
              isSelect={true}
              options={["Male", "Female", "Other"]}
            />

            {/* Address (Multi-line) */}
            <DetailItem 
              icon={<MapPin size={16} className="text-blue-500" />}
              label="Address"
              value={editedUser.address}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("address", v)}
              isTextArea={true}
            />

            {/* ID Proof Type */}
            <DetailItem 
              icon={<IdCard size={16} className="text-blue-500" />}
              label="ID Type"
              value={editedUser.id_proof_type || "N/A"}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("id_proof_type", v)}
              placeholder="e.g., Passport, Aadhar"
            />

            {/* ID Proof Number */}
            <DetailItem 
              icon={<FileText size={16} className="text-blue-500" />}
              label="ID Number"
              value={editedUser.id_proof_number || "N/A"}
              isEditing={isEditing}
              onChange={(v) => handleChangeUser("id_proof_number", v)}
              placeholder="ID Number"
            />
          </div>
        </div>

        {/* Right Section - Booking Info */}
        <div className="w-full md:w-2/3 p-4 md:p-8 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-3">
            <h3 className="text-lg md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Booking Details
            </h3>

            <div className="flex flex-col items-start md:items-end mt-3 md:mt-0">
              <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
              {isEditing ? (
                <select
                  value={editedBooking.status}
                  onChange={(e) => handleChangeBooking("status", e.target.value as "Confirmed" | "Pending" | "Cancelled")}
                  className="px-3 py-1 text-xs font-semibold rounded-full shadow-md border focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              ) : (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getStatusClasses(editedBooking.status)}`}>
                  {editedBooking.status}
                </span>
              )}
            </div>
          </div>

          {/* Booking Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800 text-sm flex-1">
            
            {/* Booking Code */}
            <BookingDetailItem
              icon={<Building2 size={16} className="text-blue-600" />}
              label="Code"
              value={editedBooking.code}
              isEditing={isEditing}
              onChange={(v) => handleChangeBooking("code", v)}
            />

            {/* Room Type */}
            <BookingDetailItem
              icon={<Building2 size={16} className="text-blue-600" />}
              label="Room"
              value={editedBooking.room}
              isEditing={isEditing}
              onChange={(v) => handleChangeBooking("room", v)}
            />

            {/* Check-in */}
            <BookingDetailItem
              icon={<CalendarDays size={16} className="text-cyan-600" />}
              label="Check-in"
              value={editedBooking.check_in}
              isEditing={isEditing}
              onChange={(v) => handleChangeBooking("check_in", v)}
              type="date"
              color="border-cyan-400"
            />

            {/* Check-out */}
            <BookingDetailItem
              icon={<CalendarDays size={16} className="text-cyan-600" />}
              label="Check-out"
              value={editedBooking.check_out}
              isEditing={isEditing}
              onChange={(v) => handleChangeBooking("check_out", v)}
              type="date"
              color="border-cyan-400"
            />

            {/* Guests */}
            <BookingDetailItem
              icon={<Users size={16} className="text-blue-600" />}
              label="Guests"
              value={editedBooking.guests.toString()}
              isEditing={isEditing}
              onChange={(v) => handleChangeBooking("guests", Number(v))}
              type="number"
            />
            
            {/* Special Request (Full width) */}
            <div className="sm:col-span-2">
              <BookingDetailItem
                icon={<FileText size={16} className="text-green-600" />}
                label="Special Request"
                value={editedBooking.special_request || "No special requests"}
                isEditing={isEditing}
                onChange={(v) => handleChangeBooking("special_request", v)}
                isTextArea={true}
                color="border-green-400"
              />
            </div>

          </div>

          {/* Desktop Buttons - Inside Right Section */}
          <div className="hidden md:flex md:justify-end md:gap-4 md:mt-6">
            {isEditing ? (
              <>
                <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md text-sm">
                  Update
                </Button>
                <Button onClick={handleCancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg shadow-md text-sm">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md text-sm">
                  <Edit3 size={16} className="mr-2" /> Edit Booking
                </Button>
                <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md text-sm">
                  Cancel 
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Action Buttons - Outside Scroll Container */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-50 shadow-2xl">
        {isEditing ? (
          <>
            <Button onClick={handleUpdate} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm">
              Update
            </Button>
            <Button onClick={handleCancelEdit} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-lg text-sm">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
              <Edit3 size={16} className="mr-2" /> Edit
            </Button>
            <Button onClick={onClose} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg text-sm">
              Cancel 
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

// --- Helper Components (Kept the same for functionality) ---

// Helper Component for Guest Details
interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (value: string) => void;
    type?: string;
    isTextArea?: boolean;
    isSelect?: boolean;
    options?: string[];
    placeholder?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, isEditing, onChange, type = "text", isTextArea = false, isSelect = false, options = [], placeholder = "" }) => (
    <div className="flex items-start gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-xs">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 w-full">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            {isEditing ? (
                isSelect ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full border rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                        <option value="">Select</option>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : isTextArea ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full border rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                        rows={2}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full border rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder={placeholder}
                    />
                )
            ) : (
                <span className="text-left text-xs leading-tight font-semibold text-gray-800 break-words">{value}</span>
            )}
        </div>
    </div>
);

// Helper Component for Booking Details
interface BookingDetailItemProps extends DetailItemProps {
    color?: string; // e.g., 'border-cyan-400'
}

const BookingDetailItem: React.FC<BookingDetailItemProps> = ({ icon, label, value, isEditing, onChange, type = "text", isTextArea = false, color = "border-blue-400" }) => (
    <div className={`flex items-start gap-2 bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 ${color} text-xs`}>
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="w-full min-w-0"> {/* Added min-w-0 to allow flex shrinking and prevent horizontal overflow */}
            <p className="text-xs font-medium text-gray-500">{label}</p>
            {isEditing ? (
                isTextArea ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full border rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400`}
                        rows={2}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full border rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400`}
                    />
                )
            ) : (
                <p className="font-bold text-gray-800 break-words whitespace-pre-wrap">{value}</p> 
            )}
        </div>
    </div>
);