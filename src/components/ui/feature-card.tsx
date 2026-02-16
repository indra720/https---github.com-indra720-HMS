import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Users, Heart, Share2, Armchair } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  item: {
    id: string;
    type: string;
    name: string;
    address: string;
    category: string;
    description: string;
    amenities: string;
    cover_photo: string;
    review: {
      rating: number;
      count: number;
    };
  };
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ item, className }) => {
  const isHotel = item.type === 'hotel';


  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-white",
        "border-0 rounded-xl",
        "shadow-xl hover:shadow-[0_85px_80px_-12px_rgba(0,0,0,0.32)]",
        "transition-all duration-500 ease-out",
        className
      )}
    >
      {/* Featured & Save Badge */}
      {/* {item.featured && (
      <div className="absolute top-4 left-4 z-20">
        <Badge className="bg-orange-500 text-white px-3 py-1 text-sm font-semibold">
          Featured
        </Badge>
      </div>
    )} */}
      {/* {savings > 0 && (
      <div className="absolute top-4 right-4 z-20">
        <Badge variant="destructive" className="px-3 py-1 text-sm font-semibold">
          Save ${savings}
        </Badge>
      </div>
    )} */}

      {/* Image Container – Fixed Height + Perfect Crop */}
      <div className="relative h-64 overflow-hidden rounded-t-xl">
        <img
          src={item.cover_photo}
          alt={item.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />

        {/* Subtle grey fade from bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10" />

        {/* Light dark overlay for rating text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <Button size="icon" variant="secondary" className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{item.review?.rating}</span>
            <span className="text-xs opacity-90">({item.review?.count})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <div className="mb-4 ">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900  transition-colors">
              {item.name}
            </h3>
            {/* <div className="text-right">
            {item.price && (
              <>
                <div className="text-lg font-bold text-gray-900">{item.price}</div>
                {item.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">{item.originalPrice}</div>
                )}
              </>
            )}
            {item.priceRange && (
              <div className="text-lg font-bold text-orange-600">{item.priceRange}</div>
            )}
          </div> */}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{item.address}</span>
            </div>
            {/* {item.openHours && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{item.openHours}</span>
            </div>
          )} */}
          </div>

          {item.category && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {item.category}
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        {item.amenities && (
          <div className="flex flex-wrap gap-1.5 mb-4">

            {/* Convert string to array */}
            {item.amenities
              .split(',')
              .slice(0, 10)    // first 10 amenities only
              .map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature.trim()}
                </Badge>
              ))}

            {/* Show "+X more" */}
            {item.amenities.split(',').length > 10 && (
              <Badge variant="secondary" className="text-xs">
                +{item.amenities.split(',').length - 10} more
              </Badge>
            )}

          </div>
        )}


        <div className="flex justify-center">
          <Button className="w-80 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-[#00204a] via-[#005792] to-[#00bbf0] hover:bg-orange-600 text-white font-semibold py-3 rounded-sm transition-all group-hover:scale-105 flex items-center justify-center gap-2">
            <Armchair className="!w-5 !h-6" />
            {isHotel ? 'Book Now' : 'Reserve Table'}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};