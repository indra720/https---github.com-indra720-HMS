import React, { useState } from "react";
import { Mail, Send, Gift, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = localStorage.getItem('accessToken') || '' ;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const payload = {
      email : email
    }
    console.log(" Newsletter payload:", payload);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/messages/newsletter/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      // const data = await response.json();
      // console.log(" Task data:", data);
      // if (response.ok) {
      //   toast.success("Welcome aboard! Check your email for exclusive offers.");
      // } else {
      //   throw new Error(`Failed to subscribing email: ${JSON.stringify(data)}`);
      // }
    } catch (error) {
      console.error("Error subscribing email:", error);
    }
   
 

   
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto border bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
          <CardContent className=" p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                  <Gift className="h-4 w-4 mr-2" />
                  Exclusive Offers
                </Badge>

                <h2 className=" text-2xl md:text-3xl lg:text-4xl font-bold sm:mb-2 md:mb-6">
                  Never Miss a Great Deal
                </h2>

                <p className="md:text-lg text-muted-foreground mb-2 sm:mb-4 md:mb-6 leading-relaxed">
                  Join our newsletter and be the first to know about special
                  offers, new destinations, and insider travel tips. Plus, get
                  15% off your first booking!
                </p>

                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Exclusive member-only deals and discounts</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Early access to flash sales and promotions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Personalized travel recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>No spam, unsubscribe anytime</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ring-4 ring-orange-400/30">
                    <Mail className="h-9 w-9 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Get 15% Off</h3>
                  <p className="text-muted-foreground">
                    On your first booking when you subscribe
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Subscribing..."
                    ) : (
                      <>
                        Subscribe & Save
                        <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  By subscribing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements */}
       <div className="relative">
  <div className="absolute -top-20  right-50 w-20 h-20 bg-gradient-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] rounded-full animate-float opacity-50" />
<div className="absolute top-[-133px] right-10 w-16 h-16 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-[#dc2626] via-[#f87171] to-[#fecaca] rounded-full animate-float-delayed opacity-50" />
  <div className="absolute -bottom-10 left-1/3 w-12 h-12 bg-gradient-to-l from-[#f59e0b] via-[#f97316] to-[#dc2626] rounded-full animate-bounce opacity-50" />
</div>
      </div>
    </section>
  );
};
