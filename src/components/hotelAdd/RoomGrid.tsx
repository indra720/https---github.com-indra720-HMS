// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Eye, Pencil, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// interface RoomCategory {
//   name: string;
//   price_per_night: number;
// }

// interface Hotel {
//   id: string;
//   name: string;
//   owner_name: string;
//   email: string;
//   contact_number: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   pincode: string;
//   slug: string;
//   status: string;
//   cover_image: string | null;
//   logo: string | null;
//   description: string;
// }

// interface HotelGridProps {
//   rooms: Hotel[];
//   filter: (value: string, slug: string) => void;
//   onStatusChange: (roomId: string, newStatus: string) => void;
//   getStatusColor: (status: string) => string;
//   onDelete: (slug: string) => void;
//   onEdit: (hotel: Hotel) => void;
//   onView?: (hotel: Hotel) => void;
// }

// export const RoomGrid = ({
//   rooms,
//   onStatusChange,
//   getStatusColor,
//   filter,
//   onDelete,
//   onEdit,
//   onView,
// }: HotelGridProps) => {
//   const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);

//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const role = user?.role; // null | "Customer"

//   const handleGetRoomcategories = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BACKEND_URL}/api/room-categories/`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setRoomCategories(data);
//       }
//     } catch (error) {
//       console.error("Error fetching room categories", error);
//     }
//   };

//   useEffect(() => {
//     handleGetRoomcategories();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {rooms.map((hotel) =>
//         role === null ? (
//           /* ===================== ADMIN / SUPER ADMIN CARD ===================== */
//           <div
//             key={hotel.id}
//             className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
//           >
//             {/* Image */}
//             <div className="mb-3 w-full h-40 rounded-md overflow-hidden">
//               <img
//                 src={
//                   hotel.cover_image ||
//                   "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
//                 }
//                 alt={hotel.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Title + Status */}
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold text-lg">{hotel.name}</h3>
//               <Badge className={getStatusColor(hotel.status)}>
//                 {hotel.status}
//               </Badge>
//             </div>

//             {/* Details */}
//             <div className="space-y-2 text-sm text-gray-600">
//               <p>
//                 Owner:{" "}
//                 <span className="font-medium">{hotel.owner_name}</span>
//               </p>
//               <p>
//                 Contact:{" "}
//                 <span className="font-medium">
//                   {hotel.contact_number}
//                 </span>
//               </p>
//               <p>
//                 Email: <span className="font-medium">{hotel.email}</span>
//               </p>
//               <p>
//                 Address:{" "}
//                 <span className="font-medium">
//                   {hotel.address}, {hotel.city}, {hotel.state}
//                 </span>
//               </p>
//             </div>

//             {/* Actions */}
//             <div className="mt-3 pt-3 border-t flex gap-2">
//               <Button
//                 variant="outline"
//                 className="w-9 h-9 bg-green-100 hover:bg-green-300"
//                 onClick={() => onView?.(hotel)}
//               >
//                 <Eye className="w-4 h-4" />
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-9 h-9 bg-blue-100 hover:bg-blue-300"
//                 onClick={() => onEdit(hotel)}
//               >
//                 <Pencil className="w-4 h-4" />
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-9 h-9 bg-red-100 hover:bg-red-300"
//                 onClick={() => onDelete(hotel.slug)}
//               >
//                 <Trash2 className="w-4 h-4" />
//               </Button>

//               <Select
//                 onValueChange={(value) => {
//                   onStatusChange(hotel.id, value);
//                   filter(value, hotel.slug);
//                 }}
//               >
//                 <SelectTrigger className="flex-1">
//                   <SelectValue placeholder="Change Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="available">Available</SelectItem>
//                   <SelectItem value="maintenance">Active</SelectItem>
//                   <SelectItem value="closed">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         ) : (
//           /* ===================== CUSTOMER CARD (NEW UI) ===================== */
//           <div
//             key={hotel.id}
//             className="p-4 border rounded-lg bg-white hover:shadow-sm transition"
//           >
//             <img
//               src={
//                 hotel.cover_image ||
//                 "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
//               }
//               alt={hotel.name}
//               className="w-full h-40 object-cover rounded-md mb-3"
//             />

//             <h3 className="text-lg font-semibold">{hotel.name}</h3>

//             <p className="text-sm text-gray-600 mt-1">
//               {hotel.city}, {hotel.state}
//             </p>

//             {hotel.description && (
//               <p className="text-sm text-gray-500 mt-2 line-clamp-2">
//                 {hotel.description}
//               </p>
//             )}

//             <Button
//               className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
//               onClick={() => onView?.(hotel)}
//             >
//               View Hotel
//             </Button>
//           </div>
//         )
//       )}
//     </div>
//   );
// };
















import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2, MapPin, Star, Heart, BedDouble } from "lucide-react";
import { useEffect, useState } from "react";

interface RoomCategory {
  name: string;
  price_per_night: number;
}

interface Hotel {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  slug: string;
  status: string;
  cover_image: string | null;
  logo: string | null;
  description: string;
}

interface HotelGridProps {
  rooms: Hotel[];
  filter: (value: string, slug: string) => void;
  onStatusChange: (roomId: string, newStatus: string) => void;
  getStatusColor: (status: string) => string;
  onDelete: (slug: string) => void;
  onEdit: (hotel: Hotel) => void;
  onView?: (hotel: Hotel) => void;
}

export const RoomGrid = ({
  rooms,
  onStatusChange,
  getStatusColor,
  filter,
  onDelete,
  onEdit,
  onView,
}: HotelGridProps) => {
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  const handleGetRoomcategories = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/room-categories/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setRoomCategories(data);
      }
    } catch (error) {
      console.error("Error fetching room categories", error);
    }
  };

  useEffect(() => {
    handleGetRoomcategories();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50/50">
      {rooms.map((hotel) =>
        role === null ? (
          /* ===================== ADMIN CARD (NO CHANGES) ===================== */
          <div key={hotel.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="mb-3 w-full h-40 rounded-md overflow-hidden">
              <img src={hotel.cover_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{hotel.name}</h3>
              <Badge className={getStatusColor(hotel.status)}>{hotel.status}</Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Owner: <span className="font-medium">{hotel.owner_name}</span></p>
              <p>Email: <span className="font-medium">{hotel.email}</span></p>
              <p>Contact: <span className="font-medium">{hotel.contact_number}</span></p>
              <p>Address: <span className="font-medium">{hotel.city}, {hotel.state}</span></p>
              <p>Description: <span className="font-medium">{hotel.description}</span></p>
              <p>Address: <span className="font-medium">{hotel.city}, {hotel.state}</span></p>
            </div>
            <div className="mt-3 pt-3 border-t flex gap-2">
              <Button variant="outline" size="icon" className="bg-green-50 text-green-600 border-green-200" onClick={() => onView?.(hotel)}><Eye className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="bg-blue-50 text-blue-600 border-blue-200" onClick={() => onEdit(hotel)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="bg-red-50 text-red-600 border-red-200" onClick={() => onDelete(hotel.slug)}><Trash2 className="w-4 h-4" /></Button>
              <Select onValueChange={(v) => { onStatusChange(hotel.id, v); filter(v, hotel.slug); }}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          /* ===================== NEW LUXURY CUSTOMER UI ===================== */
          <div
            key={hotel.id}
            className="group relative flex flex-col rounded-3xl bg-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100"
          >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={hotel.cover_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"}
                alt={hotel.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Top Action Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-none py-1.5 px-3">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                  4.8
                </Badge>
                <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Glass Overlay (Location) */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20">
                <div className="flex items-center text-white">
                  <MapPin className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-xs font-medium tracking-wide truncate">
                    {hotel.city}, {hotel.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col p-6 space-y-4">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-green-600 transition-colors">
                    {hotel.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-10">
                  {hotel.description || "Experience luxury and comfort in the heart of the city with world-class amenities."}
                </p>
              </div>

              {/* Key Amenities Snippet */}
              <div className="flex gap-4 py-2 border-y border-gray-50">
                <div className="flex items-center text-slate-500">
                  <BedDouble className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Premium Rooms</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price / Night</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">₹{roomCategories[0]?.price_per_night || "2,499"}</span>
                    <span className="text-xs font-medium text-slate-500"> + tax</span>
                  </div>
                </div>

                <Button
                  onClick={() => onView?.(hotel)}
                  className="rounded-2xl bg-green-600 hover:bg-slate-900 px-6 py-6 text-white font-bold transition-all shadow-lg shadow-green-200 hover:shadow-slate-200 active:scale-95"
                >
                  Explore Now
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};