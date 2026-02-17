import { Star } from "lucide-react";

export default function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${i < Math.floor(rating) ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
          size={size}
        />
      ))}
    </div>
  );
}