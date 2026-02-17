//   import { useParams, Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft,
//   MapPin,
//   Star,
//   Clock,
//   Phone,
//   Mail,
//   Award,
//   Utensils,
//   Wine,
//   Calendar,
//   Camera,
//   Share2,
//   Heart,
//   ChefHat,
//   Info,
//   CheckCircle2,
//   Globe,
//   Instagram,
//   Facebook,
//   Twitter,
//   Armchair,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Separator } from "@/components/ui/separator";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { TableBooking } from "@/components/restaurant/TableBooking";

// const RestaurantDetail = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [restaurant, setRestaurant] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isBookingOpen, setIsBookingOpen] = useState(false);

//   const accessToken = localStorage.getItem("accessToken");

//   const getImageUrl = (url: string) => {
//     if (!url) return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=90";
//     if (url.startsWith("http")) return url;
//     return `${import.meta.env.VITE_API_BACKEND_URL}${url}`;
//   };

//   useEffect(() => {
//     const fetchRestaurantDetail = async () => {
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${slug}/`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch restaurant");
//         }

//         const data = await response.json();
//         setRestaurant(data);
//       } catch (error) {
//         console.error("Restaurant detail error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurantDetail();
//   }, [slug, accessToken]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-background">
//         <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-muted-foreground animate-pulse">Loading amazing flavors...</p>
//       </div>
//     );
//   }

//   if (!restaurant) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
//         <div className="bg-muted p-6 rounded-full mb-4">
//           <Utensils className="h-12 w-12 text-muted-foreground" />
//         </div>
//         <h2 className="text-2xl font-bold mb-2">Restaurant Not Found</h2>
//         <p className="text-muted-foreground mb-6">We couldn't find the restaurant you're looking for.</p>
//         <Button onClick={() => navigate("/restaurants")}>
//           Browse All Restaurants
//         </Button>
//       </div>
//     );
//   }

//   // Handle images array - use cover_image and fallback high-quality images if needed
//   const displayImages = (restaurant.images && restaurant.images.length > 0)
//     ? restaurant.images
//     : [
//         restaurant.cover_image,
//         "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
//         "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
//         "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
//       ].filter(img => img !== null && img !== undefined);

//   return (
//     <div className="min-h-screen bg-background pb-12">
//       {/* Dynamic Background Gradient */}
//       <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-background pointer-events-none" />

//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div className="flex flex-col">
//               <h1 className="text-lg font-bold leading-none">{restaurant.name}</h1>
//               <p className="text-xs text-muted-foreground">{restaurant.cuisine || "Multi Cuisine"}</p>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <Button variant="outline" size="icon" className="rounded-full">
//               <Share2 className="h-4 w-4" />
//             </Button>
//             <Button 
//               variant={isFavorite ? "default" : "outline"} 
//               size="icon" 
//               className="rounded-full"
//               onClick={() => setIsFavorite(!isFavorite)}
//             >
//               <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6 relative">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* Main Content Area */}
//           <div className="lg:col-span-8 space-y-8">
            
//             {/* Hero Image Section */}
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="rounded-2xl overflow-hidden shadow-2xl relative group"
//             >
//               <Carousel className="w-full">
//                 <CarouselContent>
//                   {displayImages.length > 0 ? (
//                     displayImages.map((img: string, index: number) => (
//                       <CarouselItem key={index}>
//                         <div className="relative aspect-[16/9] md:aspect-[21/9]">
//                           <img
//                             src={getImageUrl(img)}
//                             alt={`${restaurant.name} view ${index + 1}`}
//                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                           />
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                         </div>
//                       </CarouselItem>
//                     ))
//                   ) : (
//                     <CarouselItem>
//                       <div className="aspect-[16/9] bg-muted flex items-center justify-center">
//                         <Camera className="h-12 w-12 text-muted-foreground" />
//                       </div>
//                     </CarouselItem>
//                   )}
//                 </CarouselContent>
//                 <div className="absolute bottom-4 right-12 flex gap-2">
//                    <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
//                    <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
//                 </div>
//               </Carousel>
              
//               <div className="absolute bottom-6 left-6 text-white pointer-events-none">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none">
//                     <Award className="h-3 w-3 mr-1" /> Verified
//                   </Badge>
//                   <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none">
//                     {restaurant.price_range || "₹₹₹"}
//                   </Badge>
//                 </div>
//                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{restaurant.name}</h2>
//               </div>
//             </motion.div>

//             {/* Quick Stats */}
//             <div className="flex flex-wrap gap-6 py-4 px-2">
//               <div className="flex flex-col">
//                 <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</span>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <div className="bg-yellow-400/10 p-1 rounded">
//                     <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                   </div>
//                   <span className="text-xl font-bold">{restaurant.rating || "5.0"}</span>
//                   <span className="text-sm text-muted-foreground">(250+ reviews)</span>
//                 </div>
//               </div>
//               <Separator orientation="vertical" className="h-12 hidden sm:block" />
//               <div className="flex flex-col">
//                 <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cuisine</span>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <div className="bg-primary/10 p-1 rounded">
//                     <Utensils className="h-5 w-5 text-primary" />
//                   </div>
//                   <span className="text-xl font-bold">{restaurant.cuisine || "Multi Cuisine"}</span>
//                 </div>
//               </div>
//               <Separator orientation="vertical" className="h-12 hidden sm:block" />
//               <div className="flex flex-col">
//                 <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</span>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <div className="bg-blue-400/10 p-1 rounded">
//                     <MapPin className="h-5 w-5 text-blue-500" />
//                   </div>
//                   <span className="text-xl font-bold">{restaurant.city || "Jaipur"}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Tabs Content */}
//             <Tabs defaultValue="overview" className="w-full">
//               <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 gap-8">
//                 <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-base">Overview</TabsTrigger>
//                 <TabsTrigger value="menu" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-base">Menu</TabsTrigger>
//                 <TabsTrigger value="photos" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-base">Photos</TabsTrigger>
//               </TabsList>

//               <div className="mt-8">
//                 <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
//                   <section>
//                     <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                       <Info className="h-5 w-5 text-primary" /> About {restaurant.name}
//                     </h3>
//                     <p className="text-muted-foreground leading-relaxed text-lg">
//                       {restaurant.description || "Experience the finest culinary delights at our restaurant, where tradition meets innovation in every dish. Our chefs use only the freshest ingredients to create memorable dining experiences for all our guests."}
//                     </p>
//                   </section>

//                   <section>
//                     <h3 className="text-2xl font-bold mb-4">Popular Features</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {(restaurant.features && restaurant.features.length > 0 ? restaurant.features : ["Outdoor Seating", "Live Music", "Valet Parking", "Free Wi-Fi", "Private Dining", "Full Bar"]).map((feature: string, i: number) => (
//                         <div key={i} className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
//                           <div className="bg-primary/10 p-2 rounded-full">
//                             <CheckCircle2 className="h-4 w-4 text-primary" />
//                           </div>
//                           <span className="font-medium">{feature}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </section>
//                 </TabsContent>

//                 <TabsContent value="menu" className="space-y-8 animate-in fade-in-50 duration-500">
//                   {(restaurant.menu && restaurant.menu.length > 0) ? (
//                     restaurant.menu.map((section: any, i: number) => (
//                       <div key={i} className="space-y-4">
//                         <h4 className="text-xl font-bold flex items-center gap-2 text-primary">
//                           <span className="w-8 h-px bg-primary/30" />
//                           {section.category}
//                         </h4>
                         
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {section.items.map((item: any, idx: number) => (
//                             <div
//                               key={idx}
//                               className="group p-4 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md"
//                             >
//                               <div className="flex justify-between items-start mb-1">
//                                 <span className="font-bold group-hover:text-primary transition-colors">{item.name}</span>
//                                 <span className="font-bold text-primary">{item.price}</span>
//                               </div>
//                               <p className="text-sm text-muted-foreground">Traditional flavors with a modern twist.</p>
//                               {idx % 3 === 0 && (
//                                 <Badge variant="outline" className="mt-2 text-[10px] h-5 border-primary/30 text-primary">
//                                   Popular
//                                 </Badge>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-12">
//                       <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                       <p className="text-muted-foreground text-lg">Menu details are coming soon.</p>
//                     </div>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="photos" className="animate-in fade-in-50 duration-500">
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     {displayImages.map((img: string, idx: number) => (
//                       <div key={idx} className="aspect-square rounded-xl overflow-hidden border group">
//                         <img
//                           src={getImageUrl(img)}
//                           alt={`${restaurant.name} gallery ${idx}`}
//                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </TabsContent>
//               </div>
//             </Tabs>
//           </div>


//           {/* Sidebar Section */}
//           <div className="lg:col-span-4 space-y-6">
//             <Card className="sticky top-24 shadow-xl border-t-4 border-t-primary overflow-hidden">
//               <CardHeader className="bg-muted/30">
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5 text-primary" />
//                   Make a Reservation
//                 </CardTitle>
//                 <CardDescription>Experience fine dining at its best</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6 space-y-4">
//                 <div className="space-y-3">
                   
                  
//                   <div className="flex justify-between text-sm px-1">
//                     <span className="text-muted-foreground">Real-time Availability</span>
//                     <span className="text-green-600 font-medium flex items-center gap-1">
//                       <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
//                       Instantly Confirmable
//                     </span>
//                   </div>
//                 </div>
                
//                 <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
//                       Reserve a Table
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                       <DialogTitle>Reserve Your Table at {restaurant.name}</DialogTitle>
//                     </DialogHeader>
//                     <div className="py-4">
//                       <TableBooking />
//                     </div>
//                   </DialogContent>
//                 </Dialog>
                
//                 <div className="pt-4 space-y-3">
//                   <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-primary transition-colors">
//                     <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10">
//                       <Phone className="h-4 w-4" />
//                     </div>
//                     <span>{restaurant.contact?.phone}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-primary transition-colors">
//                     <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10">
//                       <Mail className="h-4 w-4" />
//                     </div>
//                     <span className="truncate">{restaurant.contact?.email}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-primary transition-colors">
//                     <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10">
//                       <Globe className="h-4 w-4" />
//                     </div>
//                     <span>www.{restaurant.slug}.com</span>
//                   </div>
//                 </div>

//                 <Separator />
                
//                 <div className="flex justify-center gap-4 pt-2">
//                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
//                     <Instagram className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-600/10 hover:text-blue-600">
//                     <Facebook className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-400/10 hover:text-sky-400">
//                     <Twitter className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="overflow-hidden">
//               <CardHeader className="bg-muted/30">
//                 <CardTitle className="text-sm flex items-center gap-2">
//                   <Clock className="h-4 w-4" /> Opening Hours
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <div className="space-y-2">
//                   {restaurant.hours &&
//                     Object.entries(restaurant.hours).map(([day, time]) => (
//                       <div key={day} className="flex justify-between text-sm py-1 border-b border-dashed last:border-0">
//                         <span className="font-medium">{day}</span>
//                         <span className="text-muted-foreground">{time as string}</span>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Special Recognition */}
//             <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
//               <div className="bg-primary/20 p-3 rounded-xl">
//                 <ChefHat className="h-6 w-6 text-primary" />
//               </div>
//               <div>
//                 <h4 className="font-bold">Chef's Special</h4>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Try our award-winning signature dishes prepared by world-class chefs.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RestaurantDetail;


  import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  Utensils,
  Wine,
  Calendar,
  Camera,
  Share2,
  Heart,
  ChefHat,
  Info,
  CheckCircle2,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Armchair,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableBooking } from "@/components/restaurant/TableBooking";

const RestaurantDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [menu, setMenu] = useState<any[]>([]);
const [menuLoading, setMenuLoading] = useState(true);

const [tables, setTables] = useState<any[]>([]);
const [tableLoading, setTableLoading] = useState(true);


  const accessToken = localStorage.getItem("accessToken");

  const getImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=90";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BACKEND_URL}${url}`;
  };

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/restaurants/${slug}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant");
        }

        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Restaurant detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetail();
  }, [slug, accessToken]);

   
  useEffect(() => {
  const fetchMenu = async () => {
    try {
      setMenuLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/menu-items/?restaurant=${slug}`, 
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );

      if (!res.ok) throw new Error("Menu fetch failed");

      const data = await res.json();

      // ✅ PAGINATION FIX
      const items = data.results || data;

      // ✅ SAFETY CHECK
      if (!Array.isArray(items)) {
        setMenu([]);
        return;
      }

      // ✅ CATEGORY FIX (string OR object)
      const groupedMenu = Object.values(
        items.reduce((acc: any, item: any) => {
          const category =
            item.category?.name ||
            item.category ||
            "Others";

          if (!acc[category]) {
            acc[category] = {
              category,
              items: [],
            };
          }

          acc[category].items.push({
            name: item.name,
            price: `₹${item.price}`,
            description: item.description,
            popular: item.is_popular,
          });

          return acc;
        }, {})
      );

      setMenu(groupedMenu);
    } catch (err) {
      console.error("Menu API error:", err);
      setMenu([]);
    } finally {
      setMenuLoading(false);
    }
  };

  fetchMenu();
}, [slug, accessToken]);



useEffect(() => {
  const fetchTables = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/tables/?restaurant=${slug}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Tables fetch failed");

      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error("Table API error:", err);
    } finally {
      setTableLoading(false);
    }
  };

  fetchTables();
}, [slug, accessToken]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Loading amazing flavors...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="bg-muted p-6 rounded-full mb-4">
          <Utensils className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Restaurant Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the restaurant you're looking for.</p>
        <Button onClick={() => navigate("/restaurants")}>
          Browse All Restaurants
        </Button>
      </div>
    );
  }

  // Handle images array - use cover_image and fallback high-quality images if needed
  const displayImages = (restaurant.images && restaurant.images.length > 0)
    ? restaurant.images
    : [
        restaurant.cover_image,
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
      ].filter(img => img !== null && img !== undefined);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Dynamic Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-background pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-none">{restaurant.name}</h1>
              <p className="text-xs text-muted-foreground">{restaurant.cuisine || "Multi Cuisine"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={isFavorite ? "default" : "outline"} 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Image Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden shadow-2xl relative group"
            >
              <Carousel className="w-full">
                <CarouselContent>
                  {displayImages.length > 0 ? (
                    displayImages.map((img: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-[16/9] md:aspect-[21/9]">
                          <img
                            src={getImageUrl(img)}
                            alt={`${restaurant.name} view ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <div className="absolute bottom-4 right-12 flex gap-2">
                   <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                   <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                </div>
              </Carousel>
              
              <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none">
                    <Award className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none">
                    {restaurant.price_range || "₹₹₹"}
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{restaurant.name}</h2>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 py-4 px-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="bg-yellow-400/10 p-1 rounded">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-xl font-bold">{restaurant.rating || "5.0"}</span>
                  <span className="text-sm text-muted-foreground">(250+ reviews)</span>
                </div>
              </div>
              <Separator orientation="vertical" className="h-12 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cuisine</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="bg-primary/10 p-1 rounded">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xl font-bold">{restaurant.cuisine || "Multi Cuisine"}</span>
                </div>
              </div>
              <Separator orientation="vertical" className="h-12 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="bg-blue-400/10 p-1 rounded">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-xl font-bold">{restaurant.city || "Jaipur"}</span>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 gap-8">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-base">Overview</TabsTrigger>
                <TabsTrigger value="menu" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-base">Menu</TabsTrigger>
                <TabsTrigger value="photos" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0 font-semibold text-base">Photos</TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
                  <section>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" /> About {restaurant.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {restaurant.description || "Experience the finest culinary delights at our restaurant, where tradition meets innovation in every dish. Our chefs use only the freshest ingredients to create memorable dining experiences for all our guests."}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold mb-4">Popular Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(restaurant.features && restaurant.features.length > 0 ? restaurant.features : ["Outdoor Seating", "Live Music", "Valet Parking", "Free Wi-Fi", "Private Dining", "Full Bar"]).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border bg-card/50">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </TabsContent>

                 <TabsContent value="menu" className="space-y-8 animate-in fade-in-50 duration-500">
  {menuLoading ? (
    <div className="text-center py-12">
      <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
      <p className="text-muted-foreground text-lg">Loading menu...</p>
    </div>
  ) : menu.length > 0 ? (
    menu.map((section: any, i: number) => (
      <div key={i} className="space-y-4">
        <h4 className="text-xl font-bold flex items-center gap-2 text-primary">
          <span className="w-8 h-px bg-primary/30" />
          {section.category}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="group p-4 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                <span className="font-bold text-primary">{item.price}</span>
              </div>

              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              {item.popular && (
                <Badge
                  variant="outline"
                  className="mt-2 text-[10px] h-5 border-primary/30 text-primary"
                >
                  Popular
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-12">
      <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground text-lg">Menu not available</p>
    </div>
  )}
</TabsContent>


                <TabsContent value="photos" className="animate-in fade-in-50 duration-500">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {displayImages.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border group">
                        <img
                          src={getImageUrl(img)}
                          alt={`${restaurant.name} gallery ${idx}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>


          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-24 shadow-xl border-t-4 border-t-primary overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Make a Reservation
                </CardTitle>
                <CardDescription>Experience fine dining at its best</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                   
                  
                  <div className="flex justify-between text-sm px-1">
                    <span className="text-muted-foreground">Real-time Availability</span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                      Instantly Confirmable
                    </span>
                  </div>
                </div>
                
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      Reserve a Table
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Reserve Your Table at {restaurant.name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                       <TableBooking tables={tables} loading={tableLoading} />

                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-primary transition-colors">
                    <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span>{restaurant.contact?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-primary transition-colors">
                    <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="truncate">{restaurant.contact?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group cursor-pointer hover:text-primary transition-colors">
                    <div className="bg-muted p-2 rounded-lg group-hover:bg-primary/10">
                      <Globe className="h-4 w-4" />
                    </div>
                    <span>www.{restaurant.slug}.com</span>
                  </div>
                </div>

                <Separator />
                
                <div className="flex justify-center gap-4 pt-2">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-600/10 hover:text-blue-600">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-400/10 hover:text-sky-400">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {restaurant.hours &&
                    Object.entries(restaurant.hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between text-sm py-1 border-b border-dashed last:border-0">
                        <span className="font-medium">{day}</span>
                        <span className="text-muted-foreground">{time as string}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Recognition */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold">Chef's Special</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Try our award-winning signature dishes prepared by world-class chefs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetail;





