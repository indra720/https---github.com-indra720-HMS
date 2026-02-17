import { MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/RatingCard";

interface RestaurantCardProps {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  priceRange: string;
}

export default function RestaurantCard({ id, name, cuisine, location, rating, reviews, image, priceRange }: RestaurantCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden card-elevated group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
          {cuisine}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <RatingStars rating={rating} />
          <span className="text-xs text-muted-foreground">({reviews})</span>
          <span className="text-xs text-muted-foreground ml-auto">{priceRange}</span>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-1">{name}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5" /> {location}
        </p>
        <Button asChild size="sm" className="w-full gradient-primary text-primary-foreground border-0">
          <Link to={`/restaurants/${id}`}>Reserve Table</Link>
        </Button>
      </div>
    </div>
  );
}
