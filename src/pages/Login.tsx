import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

// --- API Endpoint ---
// const API_URL = "http://192.168.1.5:8000/api/login/";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. API Call
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // 2. SUCCESS BLOCK: response.ok is true (Status 200-299)
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/dashboard"); // Will show hotel view by default


      } else {

        let errorMessage = "Invalid credentials or Server Error.";

        try {
          const errorData = await response.json();
          console.error("Error Data from API:", errorData);
          errorMessage = errorData.detail || errorData.error || errorData.non_field_errors?.[0] || errorMessage;

        } catch (e) {
          console.error("Could not parse error response as JSON:", e);
          errorMessage = `Login failed. Server responded with status ${response.status}.`;
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("🚨 CRITICAL NETWORK ERROR:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Check if the backend is running and check for CORS issues.",
        variant: "destructive",
      });
    } finally {
      // 6. Reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white/90 backdrop-blur-xl rounded-3xl p-6">
        <CardHeader className="text-center space-y-1 pb-8">
          <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-500 text-lg">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium ml-1">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium ml-1">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Signing in...
                  <Spinner />
                </span>
              ) : (
                "Sign In"
              )}

            </Button>
          </form>
          <div className="mt-8 text-center text-sm space-y-3">
            <p>
              <span className="text-slate-500">Don't have an account? </span>
              <Link to="/register" className="font-semibold text-blue-600 hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
            <Link to="/home" className="block text-slate-400 hover:text-slate-600 transition-colors">
              Continue as guest
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;