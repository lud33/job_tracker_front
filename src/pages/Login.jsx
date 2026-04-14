import { useState } from "react";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in!");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <div className="space-y-4">
          <Input placeholder="Email"
            onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <Input type="password" placeholder="Password"
            onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </div>

        <p className="text-center mt-4 text-sm">
          No account?{" "}
          <span className="text-blue-500 cursor-pointer"
            onClick={()=>navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}