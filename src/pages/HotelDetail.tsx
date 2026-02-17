import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Users, Wifi, Car, Utensils, Waves, Phone, Mail, Award, Calendar, Camera, Share2, Heart, Dumbbell, Coffee, Bed, Bath, AirVent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HotelDetail = () => {
  const { id } = useParams();

  // Enhanced hotel data with comprehensive details
  const hotel = {
    id: 1,
    name: "Grand Palace Hotel",
    description: "Experience luxury at its finest in our 5-star hotel located in the heart of the city center. With elegant rooms, world-class amenities, and exceptional service, we provide an unforgettable stay for discerning travelers.",
    longDescription: "The Grand Palace Hotel stands as a beacon of luxury and sophistication in the city's prestigious downtown district. Our meticulously designed interiors feature marble lobbies, crystal chandeliers, and panoramic city views from every room. With over 100 years of hospitality excellence, we combine timeless elegance with modern conveniences to create an extraordinary experience for our guests.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 245,
    location: "Downtown, City Center",
    price: "$299/night",
    originalPrice: "$399/night",
    starRating: 5,
    established: "1923",
    totalRooms: 180,
    amenities: [
      { icon: Wifi, name: "Free High-Speed WiFi", description: "Complimentary fiber-optic internet throughout the property" },
      { icon: Waves, name: "Rooftop Infinity Pool", description: "Heated pool with panoramic city views" },
      { icon: Utensils, name: "Fine Dining Restaurant", description: "Award-winning cuisine by Michelin-starred chef" },
      { icon: Car, name: "Valet Parking", description: "24/7 secured valet parking service" },
      { icon: Dumbbell, name: "State-of-the-Art Fitness Center", description: "24/7 access with personal trainers available" },
      { icon: Coffee, name: "Luxury Spa & Wellness", description: "Full-service spa with massage and wellness treatments" },
    ],
    rooms: [
      { 
        type: "Deluxe City View", 
        price: "$199", 
        originalPrice: "$249",
        capacity: "2 guests", 
        size: "400 sq ft",
        description: "Elegantly appointed room with stunning city views and marble bathroom",
        features: ["King bed", "City view", "Marble bathroom", "Mini bar", "Work desk", "Smart TV"]
      },
      { 
        type: "Executive Suite", 
        price: "$299", 
        originalPrice: "$369",
        capacity: "3 guests", 
        size: "650 sq ft",
        description: "Spacious suite with separate living area and premium amenities",
        features: ["King bed", "Living area", "Premium bathroom", "Kitchenette", "Butler service", "Balcony"]
      },
      { 
        type: "Presidential Suite", 
        price: "$499", 
        originalPrice: "$649",
        capacity: "4 guests", 
        size: "1200 sq ft",
        description: "Ultimate luxury with panoramic views and exclusive concierge service",
        features: ["Master bedroom", "Living room", "Dining area", "Full kitchen", "Butler service", "Terrace"]
      },
    ],
    contact: {
      phone: "+1 (555) 123-4567",
      email: "reservations@grandpalace.com",
      website: "www.grandpalacehotel.com",
      address: "123 Luxury Avenue, Downtown City Center, NY 10001",
    },
    features: [
      "24/7 Concierge Service",
      "Rooftop Terrace",
      "Business Center",
      "Pet-Friendly",
      "Airport Shuttle",
      "Room Service",
      "Laundry Service",
      "Meeting Rooms",
    ],
    services: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      languages: ["English", "Spanish", "French", "Mandarin"],
      policies: [
        "Non-smoking property",
        "Pets allowed (fee applies)",
        "Children welcome",
        "Free cancellation up to 24 hours"
      ]
    },
    nearbyAttractions: [
      { name: "Central Museum", distance: "0.3 miles", walkTime: "5 min walk" },
      { name: "Shopping District", distance: "0.5 miles", walkTime: "8 min walk" },
      { name: "Convention Center", distance: "0.7 miles", walkTime: "10 min walk" },
      { name: "Financial District", distance: "1.2 miles", walkTime: "15 min walk" },
    ],
    awards: [
      "Forbes Travel Guide Five-Star Award",
      "AAA Five Diamond Award",
      "World Travel Awards - Best City Hotel",
      "TripAdvisor Travelers' Choice Award",
      "Conde Nast Gold List 2023"
    ],
    diningOptions: [
      {
        name: "Palazzo Restaurant",
        cuisine: "Italian Fine Dining",
        description: "Michelin-starred restaurant featuring authentic Italian cuisine",
        hours: "6:00 PM - 11:00 PM"
      },
      {
        name: "Sky Lounge",
        cuisine: "Cocktails & Light Bites",
        description: "Rooftop bar with panoramic city views and craft cocktails",
        hours: "5:00 PM - 1:00 AM"
      },
      {
        name: "Café Royale",
        cuisine: "International Breakfast",
        description: "All-day dining with international breakfast and lunch options",
        hours: "6:00 AM - 3:00 PM"
      }
    ],
    specialOffers: [
      { name: "Extended Stay Package", description: "20% off stays of 5+ nights", validity: "Valid through March 2024" },
      { name: "Romance Package", description: "Champagne, roses, and spa credits included", validity: "Available year-round" },
      { name: "Business Traveler Rate", description: "Flexible cancellation and late checkout", validity: "Corporate rates available" }
    ],
    guestReviews: [
      {
        name: "Jennifer Williams",
        rating: 5,
        date: "3 days ago",
        comment: "Exceptional service and luxury at its finest. The rooftop pool has incredible views and the staff went above and beyond to make our anniversary special.",
        verified: true,
        stayType: "Couple"
      },
      {
        name: "David Chen",
        rating: 5,
        date: "1 week ago",
        comment: "Perfect for business travel. The location is ideal, rooms are spacious and quiet, and the business center has everything you need. Highly recommend!",
        verified: true,
        stayType: "Business"
      },
      {
        name: "Sarah Johnson",
        rating: 4,
        date: "2 weeks ago",
        comment: "Beautiful hotel with amazing amenities. The spa treatments were incredible and the Italian restaurant was outstanding. Minor issue with room service timing but overall excellent.",
        verified: true,
        stayType: "Leisure"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Hotels
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-primary">HospitalityHub</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hotel Images Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-black/70 text-white">
                  <Camera className="h-3 w-3 mr-1" />
                  View All Photos
                </Badge>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {hotel.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden group">
                <img
                  src={image}
                  alt={`${hotel.name} ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(hotel.starRating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground">({hotel.starRating}-Star Hotel)</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
                  <p className="text-lg text-muted-foreground">Established {hotel.established}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{hotel.price}</div>
                  <div className="text-muted-foreground line-through">{hotel.originalPrice}</div>
                  <div className="text-muted-foreground">per night</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hotel.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
                </div>
                <Badge variant="outline">
                  <Bed className="h-3 w-3 mr-1" />
                  {hotel.totalRooms} Rooms
                </Badge>
                <Badge variant="outline">
                  <Award className="h-3 w-3 mr-1" />
                  Award Winner
                </Badge>
              </div>

              <p className="text-lg leading-relaxed mb-4">{hotel.description}</p>
              <p className="text-muted-foreground leading-relaxed">{hotel.longDescription}</p>
            </div>

            {/* Awards Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hotel.awards.map((award, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">{award}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Premium Amenities</CardTitle>
                <CardDescription>World-class facilities for an exceptional stay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <amenity.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">{amenity.name}</h4>
                        <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Types */}
            <Card>
              <CardHeader>
                <CardTitle>Luxury Accommodations</CardTitle>
                <CardDescription>Choose from our selection of elegantly appointed rooms and suites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hotel.rooms.map((room, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-semibold mb-1">{room.type}</h4>
                          <p className="text-muted-foreground mb-2">{room.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{room.capacity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              <span>{room.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{room.price}</div>
                          <div className="text-sm text-muted-foreground line-through">{room.originalPrice}</div>
                          <div className="text-sm text-muted-foreground">per night</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">Select This Room</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dining Options */}
            <Card>
              <CardHeader>
                <CardTitle>Dining Experiences</CardTitle>
                <CardDescription>Exceptional culinary offerings within the hotel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hotel.diningOptions.map((dining, index) => (
                    <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold mb-1">{dining.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{dining.description}</p>
                        <Badge variant="outline">{dining.cuisine}</Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {dining.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Offers */}
            <Card>
              <CardHeader>
                <CardTitle>Special Offers & Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotel.specialOffers.map((offer, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold mb-2">{offer.name}</h5>
                          <p className="text-muted-foreground mb-1">{offer.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {offer.validity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Attractions */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Attractions</CardTitle>
                <CardDescription>Explore the best of the city from our prime location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.nearbyAttractions.map((attraction, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{attraction.name}</h5>
                        <p className="text-sm text-muted-foreground">{attraction.walkTime}</p>
                      </div>
                      <Badge variant="outline">{attraction.distance}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hotel.guestReviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{review.name}</h5>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {review.stayType}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
                <CardDescription>Reserve your luxury experience today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">Great Deal!</div>
                  <div className="text-xs text-green-600">Save 25% compared to average rates</div>
                </div>
                <Button className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  or call us directly
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{hotel.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{hotel.contact.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{hotel.contact.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Check-in Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span className="font-medium">{hotel.services.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span className="font-medium">{hotel.services.checkOut}</span>
                </div>
                <div className="pt-2 border-t">
                  <h5 className="font-medium mb-2">Languages Spoken:</h5>
                  <div className="flex flex-wrap gap-1">
                    {hotel.services.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hotel Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hotel.services.policies.map((policy, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">✓</Badge>
                      <span className="text-sm">{policy}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">✓</Badge>
                    <span className="text-sm">Prime downtown location</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">✓</Badge>
                    <span className="text-sm">Award-winning service</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">✓</Badge>
                    <span className="text-sm">Luxury amenities included</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">✓</Badge>
                    <span className="text-sm">24/7 concierge service</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
