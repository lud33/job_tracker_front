import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Header } from "@/components/Header";
import { Input, Button, Switch } from "@/components/ui";

export default function Settings(){
  const [data,setData]=useState({});

  useEffect(()=>{
    API.get("/settings").then(res=>setData(res.data));
  },[]);

  const save=async()=>{
    await API.put("/settings",data);
  };

  return(
    <div className="min-h-screen bg-muted/40">
      <Header/>

      <div className="max-w-xl mx-auto p-6 space-y-4">
        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl">
          <Input value={data.name||""}
            onChange={e=>setData({...data,name:e.target.value})}/>
          <Input value={data.email||""}
            onChange={e=>setData({...data,email:e.target.value})}/>
        </div>

        <div className="bg-white/60 backdrop-blur p-6 rounded-2xl">
          <Switch checked={data.notifications}
            onCheckedChange={v=>setData({...data,notifications:v})}/>
          <Switch checked={data.weeklyDigest}
            onCheckedChange={v=>setData({...data,weeklyDigest:v})}/>
        </div>

        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}