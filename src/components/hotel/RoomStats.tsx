
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

interface Room {
  id: string;
  type: string;
  status: string;
  price: number;
  guest: string | null;
  floor: number;
}

interface RoomStatsProps {
  rooms: Room[];
  onFilterChange: (status: string) => void;
  currentHotelSlug?: string;
  dashboardData?: Record<string, number>;
}

export const RoomStats = ({ rooms, onFilterChange, dashboardData, currentHotelSlug }: RoomStatsProps) => {
  const normalizedRooms = rooms.map(room => ({
    ...room,
    status: room.status?.toLowerCase?.() ?? room.status,
  }));
   const user = JSON.parse(localStorage.getItem('user'));


  const roomStats = {
    available: normalizedRooms.filter(r => r.status === "available").length,
    occupied: normalizedRooms.filter(r => r.status === "occupied").length,
    reserved: normalizedRooms.filter(r => r.status === "reserved").length,
    maintenance: normalizedRooms.filter(r => r.status === "maintenance").length,
  };
  const availableCount = dashboardData?.available ?? roomStats.available;
  const occupiedCount = dashboardData?.occupied ?? roomStats.occupied;
  const reservedCount = dashboardData?.reserved ?? roomStats.reserved;
  const maintenanceCount = dashboardData?.maintenance ?? roomStats.maintenance;
  const totalRooms = dashboardData?.total_rooms ?? availableCount + occupiedCount + reservedCount + maintenanceCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("available")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-xl font-bold text-green-600">{totalRooms}</p>
            </div>
          </div>
        </CardContent>
      </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("available")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-xl font-bold text-green-600">{availableCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("occupied")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-xl font-bold text-blue-600">{occupiedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("reserved")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-xl font-bold text-yellow-600">{reservedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("maintenance")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-xl font-bold text-red-600">{maintenanceCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
