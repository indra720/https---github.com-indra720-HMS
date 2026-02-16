import React, { useEffect, useState } from "react";

const destinations = [
  { name: "Delhi", img: "/delhi.jpg", accommodations: "2,004 accommodations" },
  {
    name: "Mussoorie",
    img: "/Mussoorie.jpg",
    accommodations: "2,224 accommodations",
  },
  {
    name: "Udaipur",
    img: "/Udaipur.jpg",
    accommodations: "2,007 accommodations",
  },
  {
    name: "Ranikhet",
    img: "/Ranikhet3.jpg",
    accommodations: "2,000 accommodations",
  },
  {
    name: "Munnar",
    img: "/Munnar2.jpg",
    accommodations: "1,200 accommodations",
  },
  {
    name: "Ladakh",
    img: "/ladhak...jpg",
    accommodations: "500 accommodations",
  },
  { name: "Goa", img: "/goa...jpg", accommodations: "1,550 accommodations" },
  { name: "Auli", img: "/Auli9.jpg", accommodations: "1,800 accommodations" },
  {
    name: "Gulmarg",
    img: "/Gulmarg8.jpg",
    accommodations: "2,500 accommodations",
  },
  {
    name: "Darjeeling",
    img: "/Darjeeling7.jpg",
    accommodations: "2,300 accommodations",
  },
];

export const HeroStats = () => {
  interface Destination {
    name: string;
    slug: string;
    image: string;
    description: string;
    accomodations: string;
    rating: string;
    state: string;
    state_restaurant_count: number;
    state_hotel_count: number;
    hotel_count: number;
  }

  const accessToken = localStorage.getItem("accessToken") || "";
  const [trendingDestinations, setTrendingDestinations] = useState<Destination[]>([]);

  const getTrending = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotels/top-destinations/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setTrendingDestinations(data);
      if (response.ok) {
        console.log('Trending Destinations', data)
      }
      else {
        throw new Error(`Failed to get Trending Destinations: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting Trending Destinations:", error);
    }


  }
  useEffect(() => {
    getTrending();
  }, [])
  return (
    <section className="w-full py-8 md:py-16  ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">
          Top Hotel & Restro in India
        </h3>

        {/* Divider */}
        <div className="flex justify-center mb-10">
          <div className="w-32 border-t-2 border-gray-400 relative flex items-center justify-center">
            <span className="absolute left-0 -top-2 w-3 h-3 bg-black rounded-full"></span>
            <span className="absolute right-0 -top-2 w-3 h-3 bg-black rounded-full"></span>
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-2xl text-gray-400 select-none">
              ✧
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4">
          {trendingDestinations.slice(0, 10).map((dest, index) => {
            const columns = 10;
            const row = Math.floor(index / columns);
            const col = index % columns;

            // Perfect slow & smooth wave
            const delay = row * 450 + col * 110; // Peak cinematic feel

            return (
              <div
                key={dest.name}
                className="flex flex-col items-center cursor-pointer group"
                style={{
                  transition: 'all 1000ms cubic-bezier(0.22, 0.88, 0.32, 1)',
                  transitionDelay: `${delay}ms`,
                  opacity: 0,
                  transform: 'translateY(40px)',
                  filter: 'blur(4px)',
                } as React.CSSProperties}
                ref={(el) => {
                  if (!el) return;
                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        el.style.filter = 'blur(0px)';
                        observer.unobserve(el);
                      }
                    },
                    {
                      threshold: 0.1,
                      rootMargin: "0px 0px -100px 0px", // triggers earlier, 200px above viewport bottom
                    }
                  );
                  observer.observe(el);
                }}
              >
                {/* TERA ORIGINAL PREMIUM HOVER EFFECT */}
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-3 border-4 border-white 
          transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-2xl 
          group-hover:scale-110 flex items-center justify-center bg-gray-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                    loading="lazy"
                    width="112"
                    height="112"
                  />
                </div>

                <h4 className="text-sm font-semibold text-gray-900 text-center line-clamp-1 w-28 px-1 
          transition-colors duration-300 group-hover:text-blue-600">
                  {dest.name}
                </h4>
                <p className="text-gray-500 text-xs text-center line-clamp-1 w-28 px-1 
          transition-colors duration-300 group-hover:text-blue-400">
                  {dest.hotel_count} accommodations
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};
