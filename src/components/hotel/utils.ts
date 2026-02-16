
export const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800";
    case "occupied":
      return "bg-blue-100 text-blue-800";
    case "reserved":
      return "bg-yellow-100 text-yellow-800";
    case "maintenance":
      return "bg-red-100 text-red-800";
    case "in-active":
      return "bg-red-100 text-red-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const filterRooms = (rooms: any[], searchTerm: string, filterStatus: string) => {
  return rooms.filter(room => {
    const matchesSearch = (room.id && room.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (room.room_number && room.room_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (room.room_code && room.room_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (room.type && room.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === "all" || room.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });
};
