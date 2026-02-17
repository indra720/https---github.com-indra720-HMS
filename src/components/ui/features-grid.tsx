import React from "react";
import {
  Shield,
  Clock,
  Heart,
  Star,
  Users,
  Smartphone,
  Gift,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ShieldCheck,
    color: "from-[#00204A] to-[#00204A]",
    title: "Verified Properties",
    description: "All hotels and restaurants are personally verified by our team",
  },
  {
    icon: Clock,
    color: "from-[#00B906] via-[#00D408] to-[#00F00A]",
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your travel needs",
  },
  {
    icon: Heart,
    color: "from-[#C41212] via-[#E21818] to-[#FF3333]",
    title: "Best Price Guarantee",
    description: "We'll match any lower price you find elsewhere",
  },
  {
    icon: Star,
    color: "bg-gradient-to-b from-[#f59e0b] via-[#f59e0b] to-[#ea580c]",
    title: "Exclusive Deals",
    description: "Access to member-only rates and special promotions",
  },
  {
    icon: Users,
    color: "from-[#5039B0] via-[#604CC3] to-[#7E6FF5]",
    title: "Trusted Community",
    description: "Join millions of travelers who trust our platform",
  },
  {
    icon: Smartphone,
   color: "bg-gradient-to-tl from-[#3b82f6] via-[#4f46e5] to-[#4338ca]",
    title: "Mobile App",
    description: "Book on-the-go with our award-winning mobile app",
  },
  {
    icon: Gift,
    color: "bg-gradient-to-bl from-[#991b1b] via-[#dc2626] to-[#f87171]",
    title: "Loyalty Rewards",
    description: "Earn points and unlock exclusive benefits with every booking",
  },
  {
    icon: MapPin,
    color: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#06b6d4] via-[#2563eb] to-[#6366f1]",
    title: "Local Insights",
    description: "Get insider tips and recommendations from local experts",
  },
];

export const FeaturesGrid = () => {
  return (
   <section
  className="py-14 md:py-24 relative overflow-hidden"
  style={{
    background: "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.15), transparent 70%), radial-gradient(circle at 70% 70%, rgba(139,92,246,0.1), transparent 60%), linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%)",
  }}
>
  <div className="container mx-auto px-4 relative z-10">
    {/* Heading */}
    <div className="text-center mb-20">
      <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 tracking-wide px-5 py-1.5 shadow-sm">
        <Star className="h-4 w-4 mr-2 text-primary" />
        Why Choose Us
      </Badge>

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight">
        Everything You Need for Perfect Travel
      </h2>

      <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        We've built the most complete platform to make your travel planning effortless, personalized and delightful.
      </p>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <div
            key={index}
            className="
              group relative overflow-hidden rounded-3xl bg-card/90 backdrop-blur-md 
              border border-border/60 hover:border-primary/30
              shadow-sm hover:shadow-2xl hover:-translate-y-2
              transition-all duration-600 ease-out
            "
            style={{ animationDelay: `${index * 120}ms` }}
          >
            {/* Soft highlight glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

            <div className="relative px-8 py-12 text-center">
              {/* ICON */}
              <div
                className={`
                  w-16 h-16 mx-auto mb-7 rounded-2xl flex items-center justify-center
                  shadow-lg bg-gradient-to-br ${feature.color}
                  group-hover:scale-110 group-hover:shadow-2xl
                  transition-all duration-400 ease-out ring-0 outline-none
                `}
              >
                <Icon className="w-8 h-8 text-white drop-shadow" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>

            {/* Premium border glow on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 rounded-3xl shadow-[0_0_35px_10px_rgba(0,0,0,0.05)]"></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

  );
};
