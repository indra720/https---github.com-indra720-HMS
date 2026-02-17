import React, { useState, useEffect } from 'react';
import { ArrowUp, Phone, Mail, MessageCircle, Share2, Heart, Bookmark, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingActionsProps {
  className?: string;
}

export function FloatingActions({ className }: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const start = window.pageYOffset;
    const duration = 600; // 600ms animation
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);

      window.scrollTo(0, start * (1 - eased));

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hotel - Find Amazing Places',
          text: 'Discover the best hotels and restaurants with AI-powered recommendations',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const actions = [
    {
      icon: Phone,
      label: 'Call Support',
      action: () => window.open('tel:+91 8094603700'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Mail,
      label: 'Email Us',
      action: () => window.open('mailto:pramodsaini189@gmail.com'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Share2,
      label: 'Share',
      action: handleShare,
      color: "bg-[#0FC1A1] hover:bg-[#0CA98C]"
    },
    {
      icon: Bookmark,
      label: 'Save Page',
      action: () => {
        console.log('Added to favorites');
      },
      color: 'bg-[#000000] hover:bg-[#000000]'
    }
  ];

  return (
     <div className={cn("fixed right-7 bottom-24 z-40", className)}>
    <div className="relative inline-block">

      {/* Secondary Action Buttons – Curved Rainbow in Top-Left */}
      {actions.map((action, index) => {
        const total = actions.length;
        const radius = 95; // curve ka circle radius
        // Angle 60 se 90 kiya gaya hai for more space
        const angleDeg = (index / (total - 1)) * 90; // 0 to 90 degree 
        const angle = (angleDeg * Math.PI) / 180; // radian

        return (
          <div
            key={index}
            className={cn(
              "absolute right-0 bottom-0 transition-all duration-500 ease-out pointer-events-none",
              isExpanded
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-0"
            )}
            style={{
              transform: isExpanded
                ? `translateX(${-Math.cos(angle) * radius}px)
                   translateY(${-Math.sin(angle) * radius}px)
                   scale(1)`
                : "translateX(0) translateY(0) scale(0)",
              transitionDelay: isExpanded ? `${index * 80}ms` : "0ms",
            }}
          >
            <Button
              onClick={action.action}
              className={cn(
                "w-12 h-12 rounded-full shadow-xl hover:scale-110 transition-transform",
                action.color,
                "text-white "
              )}
              size="icon"
              title={action.label}
            >
              <action.icon className="h-5 w-5" />
            </Button>
          </div>
        );
      })}

      {/* Main Navy Blue Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
          "bg-[#1B1A55] hover:bg-[#15143f]",
          
          isExpanded && "rotate-45"
        )}
        style={{
          // ✨ ALTERNATIVE CHANGE HERE: Apply direct transform for 2px Right and 2px Up.
          transform: `translate(2px, -2px) ${isExpanded ? 'rotate(45deg)' : ''}`
        }}
        size="icon"
      >
        <Sparkles className="h-7 w-7 text-white" />
      </Button>

    </div>

    {/* Scroll to Top – center mein, bilkul waise hi */}
    {showScrollTop && (
      <Button
  onClick={scrollToTop}
  className={cn(
    "w-10 h-10 rounded-full shadow-lg hover:scale-110 animate-fade-in",
    "text-background fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
    "bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-[#1d4ed8] via-[#1e40af] to-[#111827]",
    "hover:bg-[#000000]" // <-- ek hi # hona chahiye
  )}
  size="icon"
  title="Scroll to Top"
>
  <ArrowUp className="h-5 w-5" />
</Button>


    )}
  </div>
  );
}