
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

export const filterRooms = (hotels: any[], searchTerm: string, filterStatus: string) => {
  const normalizedSearch = (searchTerm || "").toLowerCase();
  const normalizeStatus = (s: any) => (s || "").toString().toLowerCase();

  return hotels.filter(hotel => {
    const name = (hotel.name || "").toString().toLowerCase();
    const email = (hotel.email || "").toString().toLowerCase();
    const city = (hotel.city || "").toString().toLowerCase();
    const state = (hotel.state || "").toString().toLowerCase();

    const matchesSearch =
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch) ||
      city.includes(normalizedSearch) ||
      state.includes(normalizedSearch);

    // Flexible filter matching to accept common status synonyms from backend
    const hotelStatus = normalizeStatus(hotel.status);
    let matchesFilter = true;
    if (filterStatus && filterStatus !== "all") {
      const fs = filterStatus.toLowerCase();
      if (fs === "active") {
        matchesFilter = ["active", "available", "open"].includes(hotelStatus);
      } else if (fs === "in-active" || fs === "inactive") {
        matchesFilter = ["in-active", "inactive", "closed", "archived", "disabled"].includes(hotelStatus);
      } else {
        matchesFilter = hotelStatus === fs;
      }
    }

    return matchesSearch && matchesFilter;
  });
};
