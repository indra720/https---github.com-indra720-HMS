export const hotels = [
  { id: 1, name: "The Grand Meridian", location: "Goa, India", price: 8500, rating: 4.8, reviews: 342, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", amenities: ["Pool", "Spa", "WiFi", "Restaurant"], type: "Luxury" },
  { id: 2, name: "Seaside Paradise Resort", location: "Maldives", price: 15200, rating: 4.9, reviews: 512, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600", amenities: ["Beach", "Pool", "Spa", "Bar"], type: "Resort" },
  { id: 3, name: "Mountain View Lodge", location: "Manali, India", price: 4200, rating: 4.5, reviews: 189, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600", amenities: ["WiFi", "Parking", "Restaurant"], type: "Lodge" },
  { id: 4, name: "Urban Suites Hotel & Spa", location: "Mumbai, India", price: 6800, rating: 4.6, reviews: 278, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600", amenities: ["WiFi", "Gym", "Restaurant", "Bar"], type: "Business" },
  { id: 5, name: "Heritage Palace Hotel", location: "Jaipur, India", price: 12000, rating: 4.7, reviews: 401, image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600", amenities: ["Pool", "Spa", "WiFi", "Heritage"], type: "Heritage" },
  { id: 6, name: "Lakeside Retreat Resort", location: "Udaipur, India", price: 7500, rating: 4.4, reviews: 156, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600", amenities: ["Lake View", "Restaurant", "WiFi"], type: "Boutique" },
];

export const restaurants = [
  { id: 1, name: "Spice Garden", cuisine: "Indian", location: "Delhi, India", rating: 4.7, reviews: 523, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600", priceRange: "$$", openTime: "11:00 AM - 11:00 PM" },
  { id: 2, name: "Ocean Breeze Bistro", cuisine: "Seafood", location: "Goa, India", rating: 4.8, reviews: 312, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600", priceRange: "$$$", openTime: "12:00 PM - 10:30 PM" },
  { id: 3, name: "Sakura Japanese Dining", cuisine: "Japanese", location: "Mumbai, India", rating: 4.6, reviews: 245, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600", priceRange: "$$$", openTime: "6:00 PM - 11:00 PM" },
  { id: 4, name: "Tuscany Trattoria", cuisine: "Italian", location: "Bangalore, India", rating: 4.5, reviews: 198, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600", priceRange: "$$", openTime: "11:30 AM - 10:00 PM" },
];

export const homestays = [
  { id: 1, name: "Cozy Mountain Cabin", location: "Shimla, India", price: 2800, rating: 4.6, reviews: 87, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600", host: "Priya", type: "Entire home", guests: 4 },
  { id: 2, name: "Beachfront Bungalow", location: "Kerala, India", price: 3500, rating: 4.8, reviews: 134, image: "https://images.unsplash.com/photo-1499793983394-e58fc2180be2?w=600", host: "Rahul", type: "Entire home", guests: 6 },
  { id: 3, name: "Heritage Haveli Room", location: "Jodhpur, India", price: 2200, rating: 4.5, reviews: 65, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600", host: "Meera", type: "Private room", guests: 2 },
  { id: 4, name: "Riverside Cottage", location: "Rishikesh, India", price: 1800, rating: 4.4, reviews: 92, image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600", host: "Vikram", type: "Entire home", guests: 3 },
];

export const packages = [
  { id: 1, name: "Magical Maldives", destination: "Maldives", duration: "5 Days / 4 Nights", price: 45000, originalPrice: 62000, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600", rating: 4.9, includes: ["Flights", "Hotel", "Meals", "Activities"] },
  { id: 2, name: "Royal Rajasthan", destination: "Rajasthan, India", duration: "7 Days / 6 Nights", price: 28000, originalPrice: 38000, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600", rating: 4.7, includes: ["Transport", "Hotels", "Sightseeing", "Meals"] },
  { id: 3, name: "Kerala Backwaters", destination: "Kerala, India", duration: "4 Days / 3 Nights", price: 18000, originalPrice: 25000, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", rating: 4.8, includes: ["Houseboat", "Meals", "Activities"] },
  { id: 4, name: "Bali Adventure", destination: "Bali, Indonesia", duration: "6 Days / 5 Nights", price: 55000, originalPrice: 72000, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", rating: 4.8, includes: ["Flights", "Villa", "Activities", "Spa"] },
];

export const destinations = [
  { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400", startingPrice: 3500 },
  { name: "Maldives", image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400", startingPrice: 45000 },
  { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400", startingPrice: 2800 },
  { name: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400", startingPrice: 4200 },
  { name: "Manali", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400", startingPrice: 3200 },
  { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400", startingPrice: 35000 },
];

export const testimonials = [
  { id: 1, name: "Ananya Sharma", avatar: "AS", text: "Absolutely loved the Maldives package! Everything was perfectly organized. The resort was stunning and the service was impeccable.", rating: 5, location: "Delhi" },
  { id: 2, name: "Rajesh Kumar", avatar: "RK", text: "Booked a hotel in Goa through this platform. The prices were the best I found anywhere. Will definitely use again!", rating: 5, location: "Mumbai" },
  { id: 3, name: "Priya Patel", avatar: "PP", text: "The homestay experience in Kerala was magical. The host was wonderful and the location was breathtaking.", rating: 4, location: "Bangalore" },
];
