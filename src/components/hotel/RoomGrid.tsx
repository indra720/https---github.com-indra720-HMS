

// import React, { useEffect, useState } from "react";
// import { MoreVertical, Pencil, Trash2, Eye, ChevronDown } from "lucide-react";
// import { Dialog } from "@/components/ui/dialog";
// import RoomCard from "./RoomCard";

// interface Room {
//   id?: string;
//   room_number?: string;
//   room_category?: string;
//   room_code?: string;
//   status?: string;
//   price_per_night?: number;
//   guest?: string | null;
//   floor?: number;
//   slug?: string;
//   media?: { file?: string }[]; // adjust according to your API response
// }

// interface RoomCategory {
//   name: string;
//   price_per_night?: number;
//   slug?: string;
// }

// interface RoomGridProps {
//   rooms: Room[];
//   filter: (value: string, slug: string) => void;
//   onStatusChange: (roomId: string, newStatus: string) => void;
//   getStatusColor?: (status: string) => string;
//   onDelete: (slug?: string) => void;
//   onEdit: (room: Room) => void;
//   onBookNow?: (room: Room) => void;
// }

// export const RoomGrid = ({
//   rooms,
//   onStatusChange,
//   getStatusColor,
//   filter,
//   onDelete,
//   onEdit,
//   onBookNow,
// }: RoomGridProps) => {
//   const [Roomcategories, setRoomcategories] = useState<RoomCategory[]>([]);
//   const [menuOpen, setMenuOpen] = useState<string | null>(null);
//   const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
//   const [open, setOpen] = useState(false);


//   // Fetch Room Categories
//   const handleGetRoomcategories = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BACKEND_URL}/api/room-categories/`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const data = await response.json();
//       if (response.ok) setRoomcategories(data);
//     } catch (error) {
//       console.error("Error fetching room categories:", error);
//     }
//   };

//   useEffect(() => {
//     handleGetRoomcategories();
//   }, []);

//   // Get Proper Room Type Name
//   const getRoomTypeName = (room: Room) => {
//     const matched = Roomcategories.find((cat) => {
//       const formatted = cat.name.replace(/\s+/g, "-").toLowerCase();
//       return formatted === room.room_category?.toLowerCase();
//     });
//     return matched?.name || room.room_category || "Standard";
//   };

//   // Status Badge Color (Exactly like your screenshot)
//   const getStatusStyle = (status?: string) => {
//     switch (status?.toLowerCase()) {
//       case "occupied":
//         return "bg-blue-100 text-blue-700";
//       case "available":
//         return "bg-green-100 text-green-700";
//       case "reserved":
//         return "bg-yellow-100 text-yellow-700";
//       case "maintenance":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // Fallback Image
//   const fallbackImage =
//     "https://images.unsplash.com/photo-1611892441792-ae6af465f35c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   return (
//     <>
//       {/* Fixed 3 Cards Per Row on All Devices */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
//         {rooms.map((room,i) => {
//           const roomImage = room.media?.[0]?.file;

//           const statusClass = getStatusStyle(room.status);

//           return (
//             <div
//               key={room.id || room.room_code}
//               className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
//               onClick={() => {
//                 setSelectedRoom(room);
//                 setOpen(true);
//               }}
//             >
//               {/* Room Image */}
//               <div className="aspect-video relative overflow-hidden bg-gray-100">
//                 <img
//                   src={roomImage || "https://imgs.search.brave.com/0wOeYv-7lUHuAjXxGagNkbGWm1L6XgQSvazYxEPMyTI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMjcx/NjE4L3BleGVscy1w/aG90by0yNzE2MTgu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw"}
//                   alt={room.room_number}
//                   className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = fallbackImage;
//                   }}
//                 />

//                 {/* Status Pill */}
//                 <div
//                   className={`absolute top-3 right-3 px-4 py-1.5 rounded-full text-xs font-bold ${statusClass} shadow-md`}
//                 >
//                   {room.status || "Available"}
//                 </div>
//               </div>

//               {/* Card Details */}
//               <div className="p-5 space-y-3">
//                 <h3 className="font-bold text-xl text-gray-900">
//                   {room.room_number}
//                 </h3>

//                 <p className="text-sm text-gray-600">
//                   Type: <span className="font-semibold">{getRoomTypeName(room)}</span>
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   Floor: <span className="font-medium">{room.floor || "-"}</span>
//                 </p>

//                 <p className="text-lg font-bold text-green-600">
//                   ₹{room.price_per_night || 0}/night
//                 </p>

//                 <p className="text-sm text-gray-700">
//                   Guest: <span className="font-medium">{room.guest || "No Guest"}</span>
//                 </p>
//               </div>

//               {/* Bottom Action Bar */}
//               <div className="flex border-t border-gray-200 bg-gray-50">
//                 <button  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-gray-700 hover:bg-gray-100 transition font-medium">
//                   <Eye className="w-4 h-4" />
//                   View
//                 </button>
                

//                 <div className="relative">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setMenuOpen(menuOpen === room.id ? null : room.id);
//                     }}
//                     className="p-3.5 hover:bg-gray-100 transition"
//                   >
//                     <ChevronDown className="w-5 h-5 text-gray-600" />
//                   </button>

//                   {/* Dropdown Menu */}
//                   {menuOpen === room.id && (
//                     <div
//                       className="absolute bottom-full right-0 mb-2 w-44 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <button
//                         onClick={() => {
//                           onEdit(room);
//                           setMenuOpen(null);
//                         }}
//                         className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left text-sm font-medium"
//                       >
//                         <Pencil className="w-4 h-4" />
//                         Edit Room
//                       </button>
//                       <button
//                         onClick={() => {
//                           onDelete(room.slug);
//                           setMenuOpen(null);
//                         }}
//                         className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left text-sm font-medium text-red-600"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                         Delete Room
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

              
//             </div>
//           );
//         })}
//       </div>

//       {/* Detail Dialog */}
//       <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedRoom(null); }}>
//         <RoomCard
//           room={selectedRoom}
//           onClose={() => setOpen(false)}
//           onStatusChange={onStatusChange}
//           filter={filter}
//           onBookNow={onBookNow}
//         />
//       </Dialog>
//     </>
//   );
// };


























import React, { useEffect, useState } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import RoomCard from "./RoomCard";

interface Room {
  id?: string;
  room_number?: string;
  room_category?: string;
  room_code?: string;
  status?: string;
  price_per_night?: number;
  floor?: number;
  slug?: string;
  media?: { file?: string }[];
}

interface RoomCategory {
  name: string;
  price_per_night?: number;
  slug?: string;
}

interface RoomGridProps {
  rooms: Room[];
  filter: (value: string, slug: string) => void;
  onStatusChange: (roomId: string, newStatus: string) => void;
  onDelete: (slug?: string) => void;
  onEdit: (room: Room) => void;
  onBookNow?: (room: Room) => void;
}

export const RoomGrid = ({
  rooms,
  onStatusChange,
  filter,
  onDelete,
  onEdit,
  onBookNow,
}: RoomGridProps) => {
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch room categories
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/room-categories/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) setRoomCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const getRoomTypeName = (room: Room) => {
    const matched = roomCategories.find(
      (cat) =>
        cat.name.replace(/\s+/g, "-").toLowerCase() ===
        room.room_category?.toLowerCase()
    );
    return matched?.name || room.room_category || "Standard";
  };

  const getStatusStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "occupied":
        return "bg-blue-100 text-blue-700";
      case "available":
        return "bg-green-100 text-green-700";
      case "reserved":
        return "bg-yellow-100 text-yellow-700";
      case "maintenance":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fallbackImage = "https://imgs.search.brave.com/0wOeYv-7lUHuAjXxGagNkbGWm1L6XgQSvazYxEPMyTI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMjcx/NjE4L3BleGVscy1w/aG90by0yNzE2MTgu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
        {rooms.map((room) => {
          const roomImage = room.media?.[0]?.file;

          return (
            <div
              key={room.id || room.room_code}
              className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
              onClick={() => {
                setSelectedRoom(room);
                setOpen(true);
              }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                   src={roomImage || "https://imgs.search.brave.com/0wOeYv-7lUHuAjXxGagNkbGWm1L6XgQSvazYxEPMyTI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMjcx/NjE4L3BleGVscy1w/aG90by0yNzE2MTgu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw"}
                  alt={room.room_number}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />

                {/* Status */}
                <div
                  className={`absolute top-3 right-3 px-4 py-1.5 rounded-full text-xs font-bold shadow ${getStatusStyle(
                    room.status
                  )}`}
                >
                  {room.status || "Available"}
                </div>

                {/* Arrow Dropdown */}
                <div
                  className="absolute top-3 left-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {
                    user?.role === null && (
                      <button
                    onClick={() =>
                      setMenuOpen(menuOpen === room.id ? null : room.id!)
                    }
                    className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-gray-100 transition"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-700" />
                  </button>
                    )
                  }
                 

                  {menuOpen === room.id && (
                    <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          onEdit(room);
                          setMenuOpen(null);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm hover:bg-gray-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Room
                      </button>

                      <button
                        onClick={() => {
                          onDelete(room.slug);
                          setMenuOpen(null);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Room
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details + Price + Book Now */}
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {room.room_number}
                </h3>

                <p className="text-sm text-gray-600">
                  Type:{" "}
                  <span className="font-semibold">{getRoomTypeName(room)}</span>
                </p>

                <p className="text-sm text-gray-600">
                  Floor: <span className="font-medium">{room.floor || "-"}</span>
                </p>

                {/* Price + Book Now same row */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-bold text-green-600">
                    ₹{room.price_per_night || 0}/night
                  </p>

                    <button
                    onClick={() => {
                      if (room) {
                        console.log("Booking room:", room);
                        // Set default dates: check-in today, check-out tomorrow
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        
                        // Store room data on window object for RoomBooking
                        (window as any).bookingData = { 
                          room, 
                          step: 3,
                          checkInDate: today,
                          checkOutDate: tomorrow
                        };
                        // Switch to booking tab
                        const event = new CustomEvent("switchToBooking");
                        window.dispatchEvent(event);
                      }
                      // onClose();
                    }}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition whitespace-nowrap"
                    >
                      Book Now
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail Dialog */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedRoom(null);
        }}
      >
        <RoomCard
          room={selectedRoom}
          onClose={() => setOpen(false)}
          onStatusChange={onStatusChange}
          filter={filter}
          onBookNow={onBookNow}
        />
      </Dialog>
    </>
  );
};
