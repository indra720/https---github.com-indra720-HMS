import { useState, useEffect } from "react";
import { Calendar, StarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Dashboardlive() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        const nameToDisplay = userData.full_name || userData.fullName || userData.email?.split('@')[0] || "User";
        setUserName(nameToDisplay);
      } catch (error) {
        console.error("Error parsing user data in Dashboardlive:", error);
        setUserName("User");
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  const dateString = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Greeting Logic based on Time
  const getGreeting = (hour: number) => {
    if (hour < 9) return "Good Morning";
    if (hour < 16) return "Good Afternoon";
    if (hour < 20) return "Good Evening";
    return "Good Night";
  };

  const currentHour = currentTime.getHours();
  const greeting = getGreeting(currentHour);

  return (
    <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border-0 text-white shadow-sm shadow-blue-500/25 rounded-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
      <div className="p-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-yellow-300" /> {greeting} ({userName})
            </h2>
            <p className="text-blue-100">Here's what's happening at your hotel today</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-sm p-3 text-center">
            <div className="text-2xl font-bold tracking-wider">
              {hours}:{minutes}:{seconds}
            </div>
            <div className="text-sm text-blue-200">{dateString}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}