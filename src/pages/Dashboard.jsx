import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const addJob = async () => {
    await API.post("/jobs",{title,company,status:"Applied"});
    setTitle(""); setCompany("");
    fetchJobs();
  };

  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
    fetchJobs();
  };

  const getStatusStyle = (s) => ({
    Applied:"bg-blue-100 text-blue-600",
    Interview:"bg-yellow-100 text-yellow-700",
    Offer:"bg-green-100 text-green-600",
  }[s] || "bg-gray-100");

  const filtered = jobs.filter(j =>
    (j.title+j.company).toLowerCase().includes(search.toLowerCase()) &&
    (filter==="All" || j.status===filter)
  );

  const stats = {
    applied: jobs.filter(j=>j.status==="Applied").length,
    interview: jobs.filter(j=>j.status==="Interview").length,
    offer: jobs.filter(j=>j.status==="Offer").length,
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat label="Applied" value={stats.applied} color="blue"/>
          <Stat label="Interview" value={stats.interview} color="yellow"/>
          <Stat label="Offer" value={stats.offer} color="green"/>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <Input placeholder="Search..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)} />
          <select className="border rounded px-2"
            onChange={(e)=>setFilter(e.target.value)}>
            <option>All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
          </select>
        </div>

        {/* Add */}
        <div className="flex gap-2 mb-6">
          <Input placeholder="Title" value={title}
            onChange={(e)=>setTitle(e.target.value)} />
          <Input placeholder="Company" value={company}
            onChange={(e)=>setCompany(e.target.value)} />
          <Button onClick={addJob}>Add</Button>
        </div>

        {/* Jobs */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(job => (
            <div key={job._id}
              className="bg-white/60 backdrop-blur rounded-2xl p-4 shadow hover:shadow-lg">
              
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-muted-foreground">{job.company}</p>

              <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(job.status)}`}>
                {job.status}
              </span>

              <Button size="sm" variant="destructive"
                onClick={()=>deleteJob(job._id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Stat = ({label,value,color}) => (
  <div className="bg-white/60 backdrop-blur p-4 rounded-xl shadow">
    <p className="text-sm">{label}</p>
    <h2 className={`text-2xl font-bold text-${color}-600`}>
      {value}
    </h2>
  </div>
);