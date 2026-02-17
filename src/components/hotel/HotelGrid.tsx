import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Hotel, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Hotel {
  name: string;
  id: string;
  status: string;
  description: string;
  address: string;
  state: string;
  country: string;
  pincode: number;
  contact_number: number;
  email: string;
  logo: null;
  cover_image: null;
  slug: string;
  city: string;
}

interface HotelGridProps {
  hotels: Hotel[];
  filter: (value: string, slug: string) => void;
  onStatusChange: (hotelId: string, newStatus: string) => void;
  getStatusColor: (status: string) => string;
  onDelete: (slug: string) => void;
  onEdit: (hotel: Hotel) => void;
}

export const HotelGrid = ({
  hotels,
  onStatusChange,
  getStatusColor,
  filter,
  onDelete,
  onEdit,
}: HotelGridProps) => {
  const [localHotels, setLocalHotels] = useState<Hotel[]>(hotels);

  useEffect(() => {
    // handleGetHotelstatus();
    setLocalHotels(hotels);
  }, [hotels]);

  const handleStatusChange = (hotelId: string, newStatus: string) => {
    const updatedHotels = localHotels.map((hotel) => {
      if (hotel.id === hotelId) {
        return { ...hotel, status: newStatus };
      }
      return hotel;
    });
    setLocalHotels(updatedHotels);
    onStatusChange(hotelId, newStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localHotels.map((hotel) => {
        return (
          <div
            key={hotel.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div
              className="relative h-48 w-full rounded-lg mb-1 bg-cover bg-center"
              style={{ backgroundImage: `url(${hotel.cover_image})` }}
            >
              <img
                src={hotel.logo}
                alt="Hotel Logo"
                className="absolute top-2 right-2  h-6  object-cover   shadow-md"
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{hotel.name}</h3>
              <Badge
                className={`${getStatusColor(hotel.status)} hover:text-white`}
              >
                {hotel.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Address:
                <span className="font-medium ">{hotel.city}</span>,{" "}
                <span className="font-medium ">{hotel.state}</span>
              </p>
              <p className="text-sm text-gray-600">
                Pincode: <span className="font-medium">{hotel.pincode}</span>
              </p>

              <p className="text-sm text-gray-600">
                Country: <span className="font-medium">{hotel.country}</span>
              </p>
              <p className="text-sm text-gray-600">
                Contact Number:{" "}
                <span className="font-medium">{hotel.contact_number}</span>
              </p>
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">{hotel.email}</span>
              </p>
              {hotel.description && (
                <p className="text-sm text-gray-600">
                  Description:{" "}
                  <span className="font-medium">{hotel.description}</span>
                </p>
              )}
            </div>

            <div className="mt-3 pt-3 border-t flex space-x-2">
              <Button
                variant="outline"
                className="flex items-center justify-center w-9 h-9 hover:-translate-y-1 bg-blue-100 hover:bg-blue-300 rounded-lg"
                onClick={() => onEdit(hotel)}
              >
                <Pencil className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center w-9 h-9 hover:-translate-y-1 bg-red-100 hover:bg-red-300 rounded-lg"
                onClick={() => onDelete(hotel.slug)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <Select
                onValueChange={(value) => {
                  handleStatusChange(hotel.slug, value);
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}
    </div>
  );
};
