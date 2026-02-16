import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// --- API Endpoint ---
const API_URL = "http://192.168.1.3:8000";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    number: "", // Assuming this is the phone number
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const payload = {
        full_name: formData.fullName, 
        email: formData.email,
        phone_number: formData.number, 
        password: formData.password,
      };
      
      console.log("Sending Payload:", payload); 

      const response = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Registration Success Data:", data);

      
        if (data.access && data.refresh) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user || { email: formData.email }));
        }
        // --------------------------------------------------------------------------

        toast({
          title: "Registration Successful",
          description: "Your account has been created. Redirecting to dashboard/login.",
        });
        
        window.location.href = data.access ? "/dashboard" : "/login"; 
        
      } else {
        
        
        let errorMessage = "Registration failed. Please check the details.";
        
        try {
            const errorData = await response.json(); 
            console.error("Error Details:", errorData);
            
           
            if (errorData.email) {
                 errorMessage = `Email: ${errorData.email[0]}`;
            } else if (errorData.password) {
                 errorMessage = `Password: ${errorData.password[0]}`;
            } else if (errorData.detail) {
                 errorMessage = errorData.detail;
            } else {
                 errorMessage = "Registration failed with unknown error.";
            }
            
        } catch (e) {
            errorMessage = `Registration failed. Server responded with status ${response.status}.`;
        }

        toast({
          title: "Registration Failed",
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {/* form field names are adjusted for consistent state management */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Phone No</Label>
              <Input
                id="number"
                name="number" // Changed from 'phone' to 'number' to match state key
                type="tel"
                placeholder="Enter your phone number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" // Changed from 'Password' to 'password' for consistency
                name="password" // Changed from 'Password' to 'password' for consistency
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;