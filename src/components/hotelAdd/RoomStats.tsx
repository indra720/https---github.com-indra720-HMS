
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

interface RoomStatsProps {
  onFilterChange: (status: string) => void;
  dashboardData?: Record<string, number>;
}

export const RoomStats = ({  onFilterChange, dashboardData }: RoomStatsProps) => {
  // Normalize and safely handle missing fields

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("all")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hotels</p>
              <p className="text-xl font-bold text-green-600">{dashboardData?.total_hotels}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("active")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-yellow-600">{dashboardData?.available}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onFilterChange("in-active")}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Calendar className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In-Active</p>
              <p className="text-xl font-bold text-sky-600">{dashboardData?.closed}</p>
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
              <p className="text-xl font-bold text-red-600">{dashboardData?.maintenance}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
