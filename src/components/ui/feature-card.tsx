import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart, Share2, Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeaturedItem {
  id: string;
  type: string;
  name: string;
  address: string;
  description: string;
  cover_photo: string;
  category?: string;
  amenities?: string;
  review?: {
    rating?: number;
    count?: number;
  };
}

export const FeatureCard = ({
  item,
  className,
}: {
  item: FeaturedItem;
  className?: string;
}) => {
  const isHotel = item.type === "hotel";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-white border-0 rounded-xl shadow-xl transition-all duration-500",
        className
      )}
    >
      <div className="relative h-64 overflow-hidden rounded-t-xl">
        <img
          src={item.cover_photo}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {item.review?.rating ?? 0} ({item.review?.count ?? 0})
          </div>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
          <Button size="icon" variant="secondary">
            <Heart />
          </Button>
          <Button size="icon" variant="secondary">
            <Share2 />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold">{item.name}</h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          {item.address}
        </div>

        {item.category && (
          <Badge variant="outline" className="mb-2">
            {item.category}
          </Badge>
        )}

        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

        {item.amenities && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.amenities
              .split(",")
              .slice(0, 5)
              .map((a, i) => (
                <Badge key={i}>{a}</Badge>
              ))}
          </div>
        )}

        <Button className="w-full">
          <Armchair className="mr-2" />
          {isHotel ? "Book Now" : "Reserve"}
        </Button>
      </CardContent>
    </Card>
  );
};
