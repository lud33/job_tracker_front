import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, Plus, Trash2, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const addJob = async () => {
    if (!title.trim() || !company.trim()) return;
    setLoading(true);
    await API.post("/jobs", { title, company, status });
    setTitle("");
    setCompany("");
    setStatus("Applied");
    fetchJobs();
    setLoading(false);
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
    Applied: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
    Interview: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30",
    Offer: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
  }[s] || "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700");

  const filtered = jobs.filter(j =>
    (j.title + j.company).toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || j.status === filter)
  );

  const stats = {
    applied: jobs.filter(j => j.status === "Applied").length,
    interview: jobs.filter(j => j.status === "Interview").length,
    offer: jobs.filter(j => j.status === "Offer").length,
    total: jobs.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Header />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Job Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and manage all your job applications in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Applications</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Applied</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.applied}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Interview</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.interview}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Offer</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.offer}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search jobs by title or company..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10 bg-white/50 dark:bg-gray-900/50 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              className="px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white border-0 cursor-pointer hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 mb-8 shadow-lg">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add New Job Application
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              placeholder="Job Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
              className="flex-1 bg-white/50 dark:bg-gray-900/50 border-0 focus:ring-2 focus:ring-blue-500"
            />
            <Input 
              placeholder="Company Name" 
              value={company}
              onChange={(e) => setCompany(e.target.value)} 
              className="flex-1 bg-white/50 dark:bg-gray-900/50 border-0 focus:ring-2 focus:ring-blue-500"
            />
            
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[140px] bg-white/50 dark:bg-gray-900/50 border-0 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0">
                <SelectItem value="Applied">📋 Applied</SelectItem>
                <SelectItem value="Interview">🎯 Interview</SelectItem>
                <SelectItem value="Offer">🎉 Offer</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={addJob} 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              {loading ? "Adding..." : "Add Job"}
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-600 dark:text-gray-400">Start by adding your first job application above!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(job => (
              <div key={job._id} 
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{job.company}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => deleteJob(job._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <select
                    className={`text-sm font-medium bg-transparent cursor-pointer focus:outline-none transition-all duration-200 px-2 py-1 rounded-lg ${getStatusColor(job.status)}`}
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