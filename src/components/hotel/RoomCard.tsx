
import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { X, RefreshCw } from "lucide-react";
import { getStatusColor } from "@/components/hotel/utils";

interface Room {
  room_number?: string;
  id?: string;
  room_category?: string;
  room_code?: string;
  status?: string;
  price_per_night?: number;
  guest?: string | null;
  floor?: number;
  slug?: string;
  media?: any[];
  image?: any[];
}

interface RoomCardProps {
  room: Room | null;
  onClose: () => void;
  onStatusChange?: (roomId: string, newStatus: string) => void;
  filter?: (value: string, slug: string) => void;
  onBookNow?: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClose, onStatusChange, filter, onBookNow }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(room?.status || "-");

  useEffect(() => {
    setCurrentStatus(room?.status || "-");
  }, [room?.status]);

  if (!room) return null;

  const imgs = room.media || [];
  const hasImages = imgs.length >= 0;

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < imgs.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    if (onStatusChange && room?.id) {
      onStatusChange(room.id, newStatus);
    }
    if (filter && room?.slug) {
      filter(newStatus, room.slug);
    }
    setStatusDropdownOpen(false);
  };

  const renderSrc = (it: any) => {
    if (!it) return "";
    if (typeof it === "string") return it;
    if (it.url) return it.url;
    if (it.preview) return it.preview;
    if (it.file) return it.file;
    return "";
  };

  const normalizedStatus = currentStatus.trim().toLowerCase();
  const isStatusKnown = normalizedStatus.length > 0 && normalizedStatus !== "-";
  const statusButtonClasses = isStatusKnown
    ? `${getStatusColor(normalizedStatus)} hover:opacity-90`
    : "bg-white/20 text-white hover:bg-white/30";

  const getDropdownItemClasses = (status: string) => {
    const baseClasses = "w-full px-3 py-2 text-left text-sm transition-colors rounded-md";
    if (normalizedStatus === status) {
      return `${baseClasses} ${getStatusColor(status)} hover:opacity-90`;
    }
    return `${baseClasses} text-white hover:bg-white/20`;
  };

  // Book Now Button - Only show if room is Available
  const isBookable = normalizedStatus === "available";

  return (
    <DialogContent 
      className="max-w-sm md:max-w-5xl p-0 overflow-hidden rounded-xl border-0 shadow-2xl"
      style={{ background: "transparent" }}
    >
      <div className="relative h-screen max-h-[70vh] md:max-h-[85vh] bg-gray-900">
        {hasImages ? (
          <>
            {/* Image Slideshow */}
            {imgs.map((img, index) => {
              const src = renderSrc(img);
              return src ? (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Room ${room.room_number} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null;
            })}

            <div className="absolute inset-0 bg-black/50" />

            {/* Navigation Arrows */}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-3 rounded-full transition-all z-20 ${
                    currentIndex === 0
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white/80 hover:bg-white text-gray-800 shadow-xl hover:shadow-2xl active:scale-95"
                  }`}
                >
                  <FaChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === imgs.length - 1}
                  className={`absolute right-2 md:right-16 top-1/2 -translate-y-1/2 p-1.5 md:p-3 rounded-full transition-all z-20 ${
                    currentIndex === imgs.length - 1
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white/80 hover:bg-white text-gray-800 shadow-xl hover:shadow-2xl active:scale-95"
                  }`}
                >
                  <FaChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-2 top-2 md:right-4 md:top-4 p-1.5 md:p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all z-30"
            >
              <X className="w-4 h-4 md:w-6 md:h-6 text-white drop-shadow-md" />
            </button>

            {/* Room Title */}
            <DialogHeader className="absolute top-3 left-3 md:top-6 md:left-6 z-20">
              <DialogTitle className="text-xl md:text-4xl font-bold text-white drop-shadow-2xl">
                Room {room.room_number || room.room_code || room.id}
              </DialogTitle>
            </DialogHeader>

            {/* Details Grid */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-white mb-16 md:mb-24">
                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-80">Category</h3>
                  <p className="text-sm md:text-lg font-bold">{room.room_category || "-"}</p>
                </div>

                <div className="relative">
                  <h3 className="text-xs md:text-sm font-medium opacity-80">Status</h3>
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className={`flex items-center gap-1 md:gap-2 mt-1 px-2 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-lg font-bold transition-all ${statusButtonClasses}`}
                  >
                    {currentStatus}
                    <RefreshCw className="w-3 h-3 md:w-5 md:h-5" />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-white/30 rounded-lg shadow-2xl z-50 min-w-[140px]">
                      {["available", "occupied", "reserved", "maintenance"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          className={getDropdownItemClasses(s)}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-80">Guest</h3>
                  <p className="text-sm md:text-lg font-bold">{room.guest || "No Guest"}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-80">Price / Night</h3>
                  <p className="text-sm md:text-lg font-bold">₹{room.price_per_night || "-"}</p>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-medium opacity-80">Floor</h3>
                  <p className="text-sm md:text-lg font-bold">{room.floor ?? "-"}</p>
                </div>
              </div>

              {/* BOOK NOW BUTTON - Bottom Right */}
              {isBookable && (
                <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-30">
                  <button 
                    onClick={() => {
                      if (room) {
                        console.log("Booking room:", room);
                        // Set default dates: check-in today, check-out tomorrow
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        
                        // Store room data on window object for RoomBooking
                        (window as any).bookingData = { 
                          room, 
                          step: 3,
                          checkInDate: today,
                          checkOutDate: tomorrow
                        };
                        // Switch to booking tab
                        const event = new CustomEvent("switchToBooking");
                        window.dispatchEvent(event);
                      }
                      onClose();
                    }}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 md:px-10 py-2 md:py-5 text-sm md:text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/50 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center gap-1 md:gap-3">
                      <span className="hidden md:inline">Book Now</span>
                      <span className="inline md:hidden">Book</span>
                      <svg className="w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* No Image Fallback */
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-2xl font-light">No Image Available</div>
            <button
              onClick={onClose}
              className="mt-8 p-4 rounded-full bg-white/20 hover:bg-white/40 transition"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default RoomCard;