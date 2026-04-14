import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const addJob = async () => {
    if (!title.trim() || !company.trim()) return;
    await API.post("/jobs", { title, company, status });
    setTitle("");
    setCompany("");
    setStatus("Applied");
    fetchJobs();
  };

  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
    fetchJobs();
  };

  const updateStatus = async (id, newStatus) => {
    await API.put(`/jobs/${id}`, { status: newStatus });
    fetchJobs();
  };

  const getStatusColor = (s) => ({
    Applied: "text-blue-600 dark:text-blue-400",
    Interview: "text-yellow-600 dark:text-yellow-400",
    Offer: "text-green-600 dark:text-green-400",
  }[s] || "text-gray-600 dark:text-gray-400");

  const filtered = jobs.filter(j =>
    (j.title + j.company).toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || j.status === filter)
  );

  const stats = {
    applied: jobs.filter(j => j.status === "Applied").length,
    interview: jobs.filter(j => j.status === "Interview").length,
    offer: jobs.filter(j => j.status === "Offer").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Job Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applied</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.applied}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xl">
                📋
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interview</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.interview}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-xl">
                🎯
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Offer</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.offer}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xl">
                🎉
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-3">
            <Input 
              placeholder="🔍 Search jobs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)} 
              className="flex-1 bg-gray-50 dark:bg-gray-900 border-0"
            />
            
            <select 
              className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-0"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Jobs</option>
              <option value="Applied">📋 Applied</option>
              <option value="Interview">🎯 Interview</option>
              <option value="Offer">🎉 Offer</option>
            </select>
          </div>
        </div>

        {/* Add Job */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Add New Job</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="Job Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
              className="flex-1 bg-gray-50 dark:bg-gray-900 border-0"
            />
            <Input 
              placeholder="Company" 
              value={company}
              onChange={(e) => setCompany(e.target.value)} 
              className="flex-1 bg-gray-50 dark:bg-gray-900 border-0"
            />
            
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 dark:bg-gray-900 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Applied">📋 Applied</SelectItem>
                <SelectItem value="Interview">🎯 Interview</SelectItem>
                <SelectItem value="Offer">🎉 Offer</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={addJob}>
              + Add Job
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600 dark:text-gray-400">No jobs found. Add your first job!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(job => (
              <div key={job._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{job.company}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => deleteJob(job._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-2 -mr-2"
                  >
                    ✕
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <select
                    className={`text-sm font-medium bg-transparent cursor-pointer focus:outline-none ${getStatusColor(job.status)}`}
                    value={job.status}
                    onChange={(e) => updateStatus(job._id, e.target.value)}
                  >
                    <option value="Applied">📋 Applied</option>
                    <option value="Interview">🎯 Interview</option>
                    <option value="Offer">🎉 Offer</option>
                  </select>
                  
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}