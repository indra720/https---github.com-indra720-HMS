// pages/AuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { slug } = useParams(); 

  useEffect(() => {
    if (!slug) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/api/verify-email/${slug}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Email verification failed", data);
          navigate("/login", { replace: true });
          return;
        }

        // success case
        navigate("/login", { replace: true });

      } catch (error) {
        console.error("Error in verify email", error);
        navigate("/login", { replace: true });
      }
    };

    verifyEmail();
  }, [slug, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner h="10" w="10" />
    </div>
  );
};

export default AuthRedirect;
