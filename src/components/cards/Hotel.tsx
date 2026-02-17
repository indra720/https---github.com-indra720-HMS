import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HotelProps {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  price: string;
}

export default function Hotel({
  id,
  name,
  location,
  rating,
  reviews,
  image,
  price,
}: HotelProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">

      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute top-3 right-3 bg-white/90 text-black text-xs px-3 py-1 rounded-full font-semibold">
          {price}/night
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* RATING */}
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{rating}</span>
          <span className="text-sm text-muted-foreground">
            ({reviews} reviews)
          </span>
        </div>

        {/* NAME */}
        <h3 className="text-lg font-semibold mb-1">{name}</h3>

        {/* LOCATION */}
        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          {location}
        </p>

        {/* BUTTON */}
        <Button asChild className="w-full">
          <Link to={`/hotels/${id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}














// components/HotelCard.tsx
// import { MapPin, Star } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// export interface HotelCardProps {
//   id: number;
//   name: string;
//   location: string;
//   price: number;
//   rating: number;
//   reviews: number;
//   image: string;
//   type: string;
// }

// export default function HotelCard({
//   id,
//   name,
//   location,
//   price,
//   rating,
//   reviews,
//   image,
//   type,
// }: HotelCardProps) {
//   return (
//     <div className="bg-card rounded-2xl overflow-hidden shadow-lg flex flex-col sm:flex-row group h-full">
//       {/* Image */}
//       <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden">
//         <img
//           src={image}
//           alt={name}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//         <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full">
//           {type}
//         </span>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-5 flex flex-col justify-between">
//         <div>
//           <h3 className="font-heading font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
//           <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
//             <MapPin className="h-3.5 w-3.5" /> {location}
//           </p>
//           <div className="flex items-center gap-1.5 mb-3">
//             <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md">
//               <Star className="h-3 w-3 fill-primary" /> {rating}
//             </span>
//             <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between mt-3">
//           <div>
//             <span className="font-heading font-bold text-xl">₹{price.toLocaleString()}</span>
//             <span className="text-sm text-muted-foreground"> / night</span>
//           </div>
//           <Button asChild size="sm" className="gradient-primary text-primary-foreground border-0">
//             <Link to={`/hotels/${id}`}>Book</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
