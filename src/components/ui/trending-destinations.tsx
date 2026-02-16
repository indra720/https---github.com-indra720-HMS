import React, { useEffect, useState } from "react";
import { MapPin, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";




const destinations = [
  {
    id: 1,
    name: "Tokyo, Japan",
    image:
      "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description: "Experience the perfect blend of tradition and modernity",
    hotels: 245,
    restaurants: 1850,
    rating: 4.8,
    trending: true,
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    id: 2,
    name: "Paris, France",
    image:
      "https://media.gettyimages.com/id/1428305429/photo/paris-cityscape-during-sunset-high-angle-view-france.jpg?s=612x612&w=0&k=20&c=gCoUmhWPA6y9gZJu_M6LnOdLe8YUalg1ukzIHMqUb3k=",
    description: "The city of lights and culinary excellence",
    hotels: 189,
    restaurants: 2100,
    rating: 4.9,
    trending: true,
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 3,
    name: "New York, USA",
    image:
      "https://cdn.pixabay.com/photo/2018/09/03/15/27/new-york-3651503_640.jpg",
    description: "The city that never sleeps",
    hotels: 156,
    restaurants: 3200,
    rating: 4.7,
    trending: false,
    gradient: "from-green-500/20 to-teal-500/20",
  },
  {
    id: 4,
    name: "Bali, Indonesia",
    image:
      "https://img.freepik.com/free-photo/tanah-lot-temple-bali-island-indonesia_335224-394.jpg?semt=ais_hybrid&w=740&q=80",
    description: "Tropical paradise with rich culture",
    hotels: 98,
    restaurants: 450,
    rating: 4.6,
    trending: true,
    gradient: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    id: 5,
    name: "SAG, Japan",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Tropical paradise with rich culture",
    hotels: 98,
    restaurants: 450,
    rating: 4.6,
    trending: true,
    gradient: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    id: 6,
    name: "Udaipur, Rajasthan",
    image:
      "https://cdn.tajhotels.com/images/ocl5w36p/prod5/69ac7a724d1606fd34deb0fb2f20e9b6a80fcf20-3840x1860.jpg?w=2000",
    hotels: 245,
    restaurants: 1850,
    rating: 4.8,
    trending: true,
    gradient: "from-red-500/20 to-orange-500/20",
  },
];



export const TrendingDestinations = () => {
  interface Destination {
    name: string;
    slug:string;
    image: string;
    description: string;
    rating:string;
    state: string;
    state_restaurant_count: number;
    state_hotel_count: number;
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
    <section className="py-10 md:py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <Badge className="mb-2 md:mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Now
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">
            Popular Destinations
          </h2>
          <p className="sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the world's most sought-after destinations with exceptional
            hotels and restaurants
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          ref={(container) => {
            if (!container) return;

            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  container.querySelectorAll<HTMLElement>(".card-anim").forEach((el) => {
                    el.style.animation =
                      "slide-in-bck-left 0.65s cubic-bezier(0.25,0.46,0.45,0.94) forwards";
                  });
                  observer.unobserve(container);
                }
              },
              { threshold: 0.2, rootMargin: "0px 0px -10px 0px" } // triggers a bit earlier
            );

            observer.observe(container);
          }}
        >
          <style>
            {`
      @keyframes slide-in-bck-left {
        0% { transform: translateZ(700px) translateX(-400px); opacity: 0; }
        100% { transform: translateZ(0) translateX(0); opacity: 1; }
      }
    `}
          </style>

          {trendingDestinations.slice(0,9).map((destination) => (
            <Card
              key={destination.slug}
              className="card-anim group relative overflow-hidden rounded-lg border border-gray-200/70 bg-white shadow-lg transition-all duration-400 hover:shadow-xl hover:border-gray-300"
              style={{
                opacity: 0,
                transform: "translateZ(700px) translateX(-400px)",
              }}
            >

              <CardContent className="p-0">
                <div className="relative h-80">
                  {/* Sharp, controlled zoom */}
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />

                  {/* Solid dark overlay – no cheap transparency */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5" />

                  {/* Solid Trending Badge – Premium Orange */}
                  {destination.name && (
                    <div className="absolute top-4 left-4 rounded-full bg-orange-500 px-4 py-1.5 text-white text-xs font-bold tracking-wider shadow-md flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      TRENDING
                    </div>
                  )}

                  {/* Solid Rating Badge – Top Right */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 
            shadow-[0_8px_20px_rgba(0,0,0,0.12),_0_4px_6px_rgba(0,0,0,0.08)] 
            shadow-black/10">
                    <Star className="w-4 h-4.5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]" />

                    <span className="font-bold text-gray-900 tracking-tight">
                      {destination.rating}
                    </span>
                  </div>

                  {/* Content – Clean & Powerful */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    {/* Location tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-white/90" />
                      <span className="text-xs font-medium uppercase tracking-widest text-white/80">
                        Destination
                      </span>
                    </div>

                    {/* City Name – Big & Bold */}
                    <h3 className="text-3xl font-bold tracking-tight leading-tight">
                      {destination.name}
                    </h3>

                    {/* Crisp description */}
                    <p className="text-sm font-light text-white/90 mt-1.5 line-clamp-2 leading-snug">
                      {destination.description}
                    </p>

                    {/* Stats – Hotels & Restaurants */}
                    <div className="mt-6 flex items-center gap-6 text-sm">
                      <div>
                        <span className="font-bold text-lg">{destination.state_hotel_count}</span>
                        <span className="block text-white/80 text-xs">Hotels</span>
                      </div>
                      <div>
                        <span className="font-bold text-lg">{destination.state_restaurant_count}</span>
                        <span className="block text-white/80 text-xs">Restaurants</span>
                      </div>
                    </div>
                  </div>

                  {/* Solid Explore Button – Clean & Strong */}
                  <Button
                    size="sm"
                    className="group absolute bottom-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 bg-white text-black hover:bg-gray-100 font-medium rounded-sm shadow-lg"
                  >
                    <span className="flex items-center group/button">
                      Explore
                      <ArrowRight
                        className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover/button:translate-x-1"
                      />
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="group">
            View All Destinations
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
