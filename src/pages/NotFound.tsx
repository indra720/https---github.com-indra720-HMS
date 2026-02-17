import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import notFoundImg from "../assets/404.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
   <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-100">
  <div className="text-center">
    <img
      src={notFoundImg}
      alt="404 Page Not Found"
      className="mx-auto mb-12 w-full max-w-6xl h-[420px] sm:h-[550px] lg:h-[700px] object-contain"
    />






      </div>
    </div>
  );
};

export default NotFound;
