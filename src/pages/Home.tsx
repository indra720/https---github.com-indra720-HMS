import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import {
  Search,
  MapPin,
  Star,
  Users,
  Utensils,
  Bed,
  Waves,
  Wifi,
  Car,
  Phone,
  Mail,
  Award,
  ChevronRight,
  Heart,
  Share2,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  ChefHat,
  Coffee,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Brain,
  Zap,
  X,
  Menu,
  Hotel,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/ui/feature-card";
import { HeroStats } from "@/components/ui/hero-stats";
// import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

// import { CTASection } from "@/components/ui/cta-section";
import { HeroSection } from "@/components/ui/hero-section";
import { TrendingDestinations } from "@/components/ui/trending-destinations";
import { FeaturesGrid } from "@/components/ui/features-grid";
import { NewsletterSection } from "@/components/ui/newsletter-section";
import { AppShowcase } from "@/components/ui/app-showcase";
import Browse_exp from "@/components/ui/browse_exp";

import { FloatingActions } from "@/components/ui/floating-actions";
import { AiChatbot } from "@/components/ui/ai-chatbot";
// import PerformanceLoader from "@/components/ui/performance-loader";

const Home = () => {
  interface Comment {
    comment: string;
    rating: number;
    user_name: string;
    user_image: string;
  }
  interface Featured {
    id: string;
    type: string;
    name: string;
    address: string;
    category: string;
    description: string;
    amenities: string;
    cover_photo: string;
    review: {
      rating: number;
      count: number;

    };

  }
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");


  const restaurants = [
    {
      id: 1,
      name: "La Bella Vista",
      image:
        "https://t4.ftcdn.net/jpg/08/97/91/75/360_F_897917529_rB6HUrzIAXp7RnMm8UAMpMbGuXrZvw5H.jpg",
      rating: 4.9,
      reviews: 312,
      location: "Downtown, Sky Tower",
      cuisine: "Italian Fine Dining",
      priceRange: "$$$",
      category: "luxury",
      cuisineType: "italian",
      description:
        "Authentic Italian cuisine with breathtaking city views from the 45th floor.",
      specialties: ["Truffle Pasta", "Osso Buco", "Tiramisu"],
      openHours: "5:00 PM - 11:00 PM",
      featured: true,
    },
    {
      id: 2,
      name: "Ocean Breeze Grill",
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 189,
      location: "Waterfront District",
      cuisine: "Seafood & Steakhouse",
      priceRange: "$$",
      category: "family",
      cuisineType: "american",
      description:
        "Fresh seafood and premium steaks with ocean views and outdoor seating.",
      specialties: ["Lobster Thermidor", "Wagyu Steak", "Seafood Platter"],
      openHours: "12:00 PM - 10:00 PM",
      featured: false,
    },
    {
      id: 3,
      name: "The Garden Terrace",
      image:
        "https://i.pinimg.com/originals/c7/f0/c6/c7f0c6e97a04e1dee497de259a55939c.jpg",
      rating: 4.6,
      reviews: 267,
      location: "Historic Quarter",
      cuisine: "Modern European",
      priceRange: "$$",
      category: "romantic",
      cuisineType: "mediterranean",
      description:
        "Farm-to-table dining in a beautiful garden setting with seasonal menus.",
      specialties: ["Herb-Crusted Lamb", "Seasonal Vegetables", "Wine Pairing"],
      openHours: "6:00 PM - 10:00 PM",
      featured: true,
    },
    {
      id: 4,
      name: "Sakura Sushi House",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 145,
      location: "Arts District",
      cuisine: "Japanese",
      priceRange: "$$$",
      category: "luxury",
      cuisineType: "asian",
      description:
        "Authentic Japanese sushi and traditional dishes in an elegant atmosphere.",
      specialties: ["Omakase", "Chirashi Bowl", "Miso Soup"],
      openHours: "5:30 PM - 10:30 PM",
      featured: false,
    },
    {
      id: 5,
      name: "Rustic Tavern",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 203,
      location: "Old Town",
      cuisine: "American Comfort",
      priceRange: "$$",
      category: "budget",
      cuisineType: "american",
      description:
        "Classic American comfort food with craft beers and a cozy atmosphere.",
      specialties: ["BBQ Ribs", "Mac & Cheese", "Craft Beer"],
      openHours: "11:00 AM - 11:00 PM",
      featured: false,
    },
    {
      id: 6,
      name: "Spice Route",
      image:
        "https://media.istockphoto.com/id/1131393938/photo/very-stylish-indian-gourmet-restaurant.jpg?b=1&s=612x612&w=0&k=20&c=3zzNV5a4zgM-ht12J3Bc_O3r-DsZthZnDoZMauVjg3c=",
      rating: 4.4,
      reviews: 178,
      location: "Cultural Quarter",
      cuisine: "Indian",
      priceRange: "$$",
      category: "family",
      cuisineType: "asian",
      description:
        "Authentic Indian flavors with traditional recipes and aromatic spices.",
      specialties: ["Butter Chicken", "Biryani", "Naan Bread"],
      openHours: "12:00 PM - 9:30 PM",
      featured: true,
    },
  ];

  const hotels = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      image:
        "https://media.istockphoto.com/id/1129146859/photo/3d-render-luxury-hotel-lobby-entrance.jpg?s=612x612&w=0&k=20&c=nnBF_rirNfZHUGYuVxR9bzcFCC9jQ2Jl9KR2byrHres=",
      rating: 4.8,
      reviews: 245,
      location: "Downtown, City Center",
      price: "$299/night",
      originalPrice: "$399/night",
      starRating: 5,
      category: "luxury",
      description:
        "Luxury 5-star hotel with world-class amenities and exceptional service.",
      amenities: ["Spa", "Pool", "Gym", "Business Center"],
      featured: true,
    },
    {
      id: 2,
      name: "Oceanview Resort",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 189,
      location: "Beachfront",
      price: "$199/night",
      originalPrice: "$249/night",
      starRating: 4,
      category: "family",
      description:
        "Beachfront resort with stunning ocean views and relaxing spa facilities.",
      amenities: ["Beach Access", "Kids Club", "Restaurant", "Spa"],
      featured: false,
    },
    {
      id: 3,
      name: "Mountain Lodge",
      image:
        "https://assets.cntraveller.in/photos/655750ca0d0fd182642391ae/master/w_1024,c_limit/Screenshot%202023-11-17%20at%204.38.25%20PM.png",
      rating: 4.6,
      reviews: 167,
      location: "Mountain District",
      price: "$149/night",
      originalPrice: "$189/night",
      starRating: 4,
      category: "budget",
      description:
        "Cozy mountain retreat with hiking trails and scenic mountain views.",
      amenities: ["Hiking Trails", "Fireplace", "Mountain Views", "Parking"],
      featured: true,
    },
    {
      id: 4,
      name: "Urban Boutique Hotel",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 134,
      location: "Arts District",
      price: "$179/night",
      originalPrice: "$219/night",
      starRating: 4,
      category: "business",
      description:
        "Modern boutique hotel in the heart of the arts district with unique design.",
      amenities: ["Business Center", "Rooftop Bar", "Concierge", "Wifi"],
      featured: false,
    },
    {
      id: 5,
      name: "Riverside Inn",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop",
      rating: 4.3,
      reviews: 198,
      location: "Riverside",
      price: "$129/night",
      originalPrice: "$159/night",
      starRating: 3,
      category: "romantic",
      description:
        "Charming riverside inn with peaceful atmosphere and scenic river views.",
      amenities: ["River Views", "Garden", "Restaurant", "Parking"],
      featured: false,
    },
    {
      id: 6,
      name: "Sky Tower Suites",
      image:
        "https://www.therooftopguide.com/rooftop-news/Bilder/rome-rooftop-hotel-doubletree-by-hilton-rome-monti-1.jpg",
      rating: 4.9,
      reviews: 287,
      location: "Financial District",
      price: "$349/night",
      originalPrice: "$449/night",
      starRating: 5,
      category: "luxury",
      description:
        "Luxury suites with panoramic city views and premium business amenities.",
      amenities: [
        "City Views",
        "Business Center",
        "Concierge",
        "Valet Parking",
      ],
      featured: true,
    },
  ];

  const [featuredList, setFeaturedList] = useState<Featured[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const getTrending = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/featured-list/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFeaturedList(data);
      if (response.ok) {
        console.log('Featured Destinations', data)
      }
      else {
        throw new Error(`Failed to get Featured Destinations: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting Featured Destinations:", error);
    }

  }
  const getComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/hotel-reviews/public-reviews/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setComments(data);
      if (response.ok) {
        console.log('Comments', data)
      }
      else {
        throw new Error(`Failed to get Comments: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error getting Comments:", error);
    }

  }


  useEffect(() => {
    getTrending();
    getComments();
  }, [])


  const handleSearch = (searchData: any) => {
    console.log("Search data:", searchData);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Amazing platform! Found the perfect restaurant for our anniversary dinner. The booking process was seamless and the recommendations were spot on.",
      rating: 5,
      image:
        "https://media.gettyimages.com/id/1311655328/photo/im-the-best-asset-in-my-business.jpg?s=612x612&w=0&k=20&c=ebkVt_iY6rRjXvyx2CESPC8EtcWrv0nYt_y4IdKmN3M=",
      title: "Food Enthusiast",
    },
    {
      name: "Michael Chen",
      text: "Great selection of hotels with detailed information. Saved money and found exactly what I was looking for. The filter options are very helpful!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      title: "Business Traveler",
    },
    {
      name: "Emily Davis",
      text: "The detailed information and photos helped me make the right choice. Customer service was excellent and the user experience is outstanding.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      title: "Vacation Planner",
    },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-[#1d4ed8] via-[#1e40af] to-[#111827] text-primary-foreground shadow-md sticky top-0 z-30">

        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Hotel className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Hotel Management
                </h1>
                <p className="text-xs text-white flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  AI-Powered Discovery
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border border-primary-foreground/30"
                asChild
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-primary-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="flex flex-col mt-3 space-y-1 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left text-primary-foreground hover:bg-primary-foreground/20"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border border-primary-foreground/30"
                asChild
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <HeroStats />
        </div>
      </section>

      {/* Trending Destinations */}
      <TrendingDestinations />
      <Browse_exp />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Featured Section */}
      {featuredList.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Award className="h-4 w-4 mr-2" />
                Featured Collection
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Handpicked for You
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our curated selection of exceptional dining and
                accommodation experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredList.slice(0, 6).map((item) => (
                <FeatureCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                {activeTab === "all" && "Discover Amazing Places"}
                {activeTab === "hotels" && "Premium Hotels"}
                {activeTab === "restaurants" && "Exceptional Restaurants"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {featuredList.length} places found
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                <option value="all">All Prices</option>
                <option value="$">Budget ($)</option>
                <option value="$$">Mid-range ($$)</option>
                <option value="$$$">Luxury ($$$)</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.map((item) => (
            <FeatureCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </main>

      {/* App Showcase with AI Features */}
      <section className="py-10 md:py-20 px-8 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden border-2 md:hidden">
        {/* REMOVED: <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" /> */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-16 animate-fade-up">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              AI-Enhanced Experience
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-6">
              Experience the Future of Travel Planning
            </h2>
            <p className="md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI chatbot provides instant recommendations, smart search
              capabilities, and personalized suggestions to make your journey
              unforgettable
            </p>
          </div>
        </div>
        <AppShowcase />
      </section>

      {/* Testimonials Section */}
      <section className=" py-8 md:py-20 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Users className="h-4 w-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">
              What Our Customers Say
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied customers who have found their perfect
              dining and accommodation experiences through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {comments.map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/20 transition-colors"
              >
                <CardContent className=" p-4 sm:p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.comment}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.user_image || 'https://upload.wikimedia.org/wikipedia/commons/7/79/Barbate,_Spain_(Unsplash).jpg'}
                      alt={testimonial.user_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-lg">
                        {testimonial.user_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {'Food Enthusiast'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <footer className="bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] pt-20 pb-12 text-white">
        <div className="container mx-auto px-4 max-w-7xl">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 mb-16">

            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-2xl tracking-tight text-white">
                  Hotel Management
                </h3>
              </div>

              <p className="text-slate-300 mb-6 max-w-sm leading-relaxed text-sm">
                Your trusted partner for finding the best hotels and restaurants worldwide. Creating unforgettable experiences since 2024.
              </p>

              {/* <div className="space-y-4">
                <a href="tel:+15551234567" className="flex items-center gap-3 text-sm hover:text-cyan-400 transition-colors group">
                  <Phone className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 font-medium">+91 8094603700</span>
                </a>
                <a href="mailto:support@hospitalityhub.com" className="flex items-center gap-3 text-sm hover:text-cyan-400 transition-colors group">
                  <Mail className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 font-medium">pramodsaini189@gmail.com</span>
                </a>
              </div> */}
            </div>

            {/* For Travelers */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-base tracking-tight">
                For Travelers
              </h4>
              <ul className="space-y-3 text-sm">
                {["Search Hotels", "Find Restaurants", "Travel Guides", "Special Offers", "Mobile App"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-400 hover:text-cyan-400 transition-all duration-200 font-medium">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Partners */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-base tracking-tight">
                For Partners
              </h4>
              <ul className="space-y-3 text-sm">
                {["List Your Hotel", "List Your Restaurant", "Partner Portal", "Marketing Tools", "Analytics"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-400 hover:text-cyan-400 transition-all duration-200 font-medium">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="col-span-2 md:col-span-1 lg:col-span-1">
              <h4 className="font-semibold text-white mb-6 text-base tracking-tight">
                Support & Legal
              </h4>
              <ul className="space-y-3 text-sm">
                {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-slate-400 hover:text-cyan-400 transition-all duration-200 font-medium">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr className="my-8 border-border" />


          {/* Right: Social Icons */}
          <div className="flex space-x-6">
            {[
              { Icon: Facebook, href: "#" },
              { Icon: FaXTwitter, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Linkedin, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm
                         hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:shadow-xl hover:shadow-cyan-400/20
                         transition-all duration-300 hover:scale-110"
              >
                <Icon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            ))}
          </div>



          <div className=" text-center">
            <p className="text-sm text-slate-500 font-medium">
              &copy; 2024 Hotel management . All rights reserved.
              Made with{" "}
              <a
                href="https://atsglobaltech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-cyan-400 hover:text-cyan-300 font-semibold tracking-wide transition-all duration-300 
                 hover:translate-x-1 hover:scale-105"
              >
                <span className="underline underline-offset-4 decoration-cyan-400/60">
                  ATS GLOBAL TECH
                </span>
              </a>
              .
            </p>
          </div>
        </div>
      </footer>

      {/* AI Components */}
      <AiChatbot />
      <FloatingActions />
    </div>
  );
};

export default Home;
