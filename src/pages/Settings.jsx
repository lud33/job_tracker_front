import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    notifications: false,
    weeklyDigest: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await API.get("/settings");
      setData({
        name: response.data.name || "",
        email: response.data.email || "",
        notifications: response.data.notifications || false,
        weeklyDigest: response.data.weeklyDigest || false
      });
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      await API.put("/settings", data);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out!");
    setTimeout(() => navigate("/login"), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            🚀 Job Tracker
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate("/settings")}>
              Settings
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Real-time Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive instant job alerts
                </p>
              </div>
              <Switch
                checked={data.notifications}
                onCheckedChange={v => setData({ ...data, notifications: v })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weekly summary every Monday
                </p>
              </div>
              <Switch
                checked={data.weeklyDigest}
                onCheckedChange={v => setData({ ...data, weeklyDigest: v })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}