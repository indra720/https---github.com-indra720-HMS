// ================= IMPORTS =================
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hotel as HotelIcon, Menu, X, Zap, Star, Award } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { HeroSection } from "@/components/ui/hero-section";
import { FeaturesGrid } from "@/components/ui/features-grid";
import { NewsletterSection } from "@/components/ui/newsletter-section";
import { FeatureCard } from "@/components/ui/feature-card";
import PopularDestinations from "@/components/ui/PopularDestinations";
import  Hotel  from "@/components/cards/Hotel";
import Restaurant from "@/components/cards/Restaurant";
import BrowseExp from "@/components/ui/browse_exp";
import { FloatingActions } from "@/components/ui/floating-actions";
import { AiChatbot } from "@/components/ui/ai-chatbot";
import { hotels, restaurants } from "@/data/mockData";



// ================= TYPES =================
interface Comment {
  comment: string;
  rating: number;
  user_name: string;
  user_image: string;
}

interface FeaturedItem {
  id: string;
  type: string;
  name: string;
  address: string;
  description: string;
  cover_photo: string;
  review: {
    rating: number;
    count: number;
  };
  category?: string;
  amenities?: string;
}

// ================= COMPONENT =================
const Home = () => {
  const [featuredList, setFeaturedList] = useState<FeaturedItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔵 dummy restaurant data
  // const restaurants = [
  //   {
  //     id: 1,
  //     name: "Spice Garden",
  //     cuisine: "Indian",
  //     location: "Jaipur",
  //     rating: 4.5,
  //     reviews: 120,
  //     image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  //     priceRange: "$$",
  //   },
  //   {
  //     id: 2,
  //     name: "Italian Hub",
  //     cuisine: "Italian",
  //     location: "Delhi",
  //     rating: 4.2,
  //     reviews: 90,
  //     image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
  //     priceRange: "$$$",
  //   },
  // ];

  // ---------- API ----------
  const getTrending = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/featured-list/`);
      const data = await res.json();
      setFeaturedList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotel-reviews/public-reviews/`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTrending();
    getComments();
  }, []);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <HotelIcon className="h-8 w-8" />
            <div>
              <h1 className="font-bold text-xl">Hotel Management</h1>
              <p className="text-xs flex items-center gap-1">
                <Zap className="h-3 w-3" /> AI Powered
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* HERO */}
      <HeroSection onSearch={(d:any)=>console.log(d)} />

      {/* DESTINATIONS */}
      <PopularDestinations />
      
      {/* HOTELS SECTION */}

   <section className="container mx-auto py-16">
  <h2 className="text-3xl font-bold mb-8">Hotels</h2>

  <div className="grid md:grid-cols-6 gap-8">
    {hotels.map((hotel) => (
      <Hotel key={hotel.id} {...hotel} />
    ))}
  </div>
</section>


      {/* RESTAURANTS */}
     <section className="container mx-auto py-16">
  <h2 className="text-3xl font-bold mb-8">Restaurants</h2>

  <div className="grid md:grid-cols-4 gap-8">
    {restaurants.map((r) => (
      <Restaurant key={r.id} {...r} />
    ))}
  </div>
</section>


      <BrowseExp/> 

      
      {/* FEATURES */}
      <FeaturesGrid />


      {/* FEATURED API DATA */}
      {featuredList.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">
                <Award className="h-4 w-4 mr-2" />
                Featured
              </Badge>
              <h2 className="text-4xl font-bold">Handpicked For You</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredList.slice(0,6).map(item => (
                <FeatureCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {comments.map((c,i)=>(
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex mb-2">
                    {[...Array(c.rating)].map((_,i)=>
                      <Star key={i} className="fill-yellow-400 text-yellow-400"/>
                    )}
                  </div>
                  <p className="mb-4">"{c.comment}"</p>
                  <div className="flex items-center gap-3">
                    <img src={c.user_image} className="w-10 h-10 rounded-full"/>
                    <span>{c.user_name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />

      <footer className="bg-slate-900 text-white py-10 text-center">
        <p>© 2026 Hotel Management</p>
      </footer>

      <AiChatbot/>
      <FloatingActions/>
    </div>
  );
};

export default Home;
