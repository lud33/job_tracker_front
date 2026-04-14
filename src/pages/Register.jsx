import { useState } from "react";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });

  const handleRegister = async () => {
    const res = await API.post("/auth/register", form);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <div className="space-y-3">
          <Input placeholder="Name"
            onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <Input placeholder="Email"
            onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <Input type="password" placeholder="Password"
            onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <Button className="w-full" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}