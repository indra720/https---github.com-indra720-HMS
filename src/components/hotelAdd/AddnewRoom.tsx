import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type Room = {
  id: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
  rating: number;
  description: string;
};

const defaultAmenities = ["Wifi", "TV", "AC", "Room Service"];

export default function AddRoomSection() {
  const [showForm, setShowForm] = useState(false);
  const [room, setRoom] = useState<Room>({
    id: "",
    type: "",
    price: 0,
    capacity: 1,
    amenities: [],
    images: ["/placeholder.svg"],
    available: true,
    rating: 0,
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: name === "price" || name === "capacity" || name === "rating" ? Number(value) : value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setRoom((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Room Added:", room);
    setShowForm(false); // hide form after submit
  };

  return (
    <div className="space-y-6 p-4">
      {/* Add New Room Button */}
      <Button
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Room
      </Button>

      {/* Conditional Form */}
      {showForm && (
        <Card className="max-w-3xl">
          <CardContent className="space-y-6 py-6">
            <h2 className="text-xl font-bold">Add New Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="id">Room ID</Label>
                <Input name="id" value={room.id} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="type">Room Type</Label>
                <Input name="type" value={room.type} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input name="price" type="number" value={room.price} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input name="capacity" type="number" value={room.capacity} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {defaultAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        checked={room.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input name="rating" type="number" step="0.1" value={room.rating} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" value={room.description} onChange={handleChange} />
              </div>

              <div className="flex gap-3">
                <Button type="submit">Save Room</Button>
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
