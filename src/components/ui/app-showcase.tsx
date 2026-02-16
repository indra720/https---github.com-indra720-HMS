import React from 'react';
import { Smartphone, Download, Star, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const appFeatures = [
  {
    title: "Lightning Fast Search",
    description: "Find perfect hotels and restaurants in seconds with our AI-powered search"
  },
  {
    title: "Offline Maps",
    description: "Access your bookings and maps even without internet connection"
  },
  {
    title: "Real-time Notifications",
    description: "Get instant updates about your reservations and exclusive deals"
  },
  {
    title: "One-tap Booking",
    description: "Book your favorite places with just one tap using saved preferences"
  }
];

export const AppShowcase = () => {
  return (
   <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background to-primary/5">
  <div className="container mx-auto px-4">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
    
    {/* Left Side - Content */}
    <div>
      <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20">
        <Smartphone className="h-4 w-4 mr-2" />
        Mobile App
      </Badge>
      
      {/* IMPROVEMENT: text-2xl/3xl/4xl/5xl kept, font remains bold */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
        Take Your Travel Plans Everywhere
      </h2>
      
      {/* IMPROVEMENT: 'text-muted-foreground' removed for description text. */}
      <p className="text-base sm:text-lg md:text-xl text-foreground mb-6 sm:mb-8 leading-relaxed">
        Download our award-winning mobile app and experience seamless travel planning 
        on the go. Book, manage, and discover amazing places with the power of your smartphone.
      </p>

      {/* App Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-primary mb-1">4.9</div>
          {/* IMPROVEMENT: 'text-muted-foreground' removed, text size increased to 'text-sm' */}
          <div className="text-sm text-foreground flex items-center justify-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            App Store
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-primary mb-1">2M+</div>
          {/* IMPROVEMENT: 'text-muted-foreground' removed, text size increased to 'text-sm' */}
          <div className="text-sm text-foreground flex items-center justify-center gap-1">
            <Download className="h-3 w-3" />
            Downloads
          </div>
        </div>
        <div className="text-center col-span-2 md:col-span-1">
          <div className="text-xl sm:text-2xl font-bold text-primary mb-1">95%</div>
          {/* IMPROVEMENT: 'text-muted-foreground' removed, text size increased to 'text-sm' */}
          <div className="text-sm text-foreground flex items-center justify-center gap-1">
            <Users className="h-3 w-3" />
            Satisfaction
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {appFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              {/* IMPROVEMENT: Title font weight increased to 'font-bold' for emphasis */}
              <h4 className="font-bold mb-1 text-foreground">{feature.title}</h4>
              {/* IMPROVEMENT: 'text-muted-foreground' removed */}
              <p className="text-sm text-foreground/80">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button size="lg" className="group w-full sm:w-auto">
          <Download className="h-5 w-5 mr-2" />
          Download for iOS
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button size="lg" variant="outline" className="group w-full sm:w-auto">
          <Download className="h-5 w-5 mr-2" />
          Download for Android
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>



      {/* Right Side - Phone Mockup */}
      <div className="relative">
        <div className="relative mx-auto w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-96">
          {/* Phone Frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 rounded-[2.5rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden relative">
              {/* Screen Content */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs">
                  <span className="font-semibold">9:41</span>
                  <span>100%</span>
                </div>
                
                {/* App Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="font-bold text-base sm:text-lg md:text-xl mb-2">Find Your Perfect Stay</h3>
                  <div className="bg-background/80 rounded-xl p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Smartphone className="h-4 w-4" />
                      <span>Search hotels near you...</span>
                    </div>
                  </div>
                </div>

                {/* Sample Cards */}
                <div className="px-4 sm:px-6 space-y-2 sm:space-y-3">
                  <Card className="border-0 bg-background/90 backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs sm:text-sm">Grand Palace Hotel</h4>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Downtown • $299/night</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] sm:text-xs">4.8</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-background/90 backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-xs sm:text-sm">La Bella Vista</h4>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Sky Tower • Italian</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] sm:text-xs">4.9</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-32 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 sm:-top-8 -right-6 sm:-right-8 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full animate-float"></div>
          <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-400/30 to-teal-400/30 rounded-full animate-float-delayed"></div>
          
          {/* Award Badge */}
          <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Award className="h-3 w-3" />
            #1 Travel App
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};