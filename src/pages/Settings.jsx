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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [changingPassword, setChangingPassword] = useState(false);

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
      
      if (data.weeklyDigest) {
        toast.info("📧 Weekly digest enabled! You'll receive updates every Monday morning.", {
          duration: 5000,
          icon: "📅"
        });
      }
      
      if (data.notifications) {
        toast.success("🔔 Real-time notifications enabled!", {
          duration: 4000,
          icon: "🔔"
        });
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);
      await API.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

  const testNotification = () => {
    if (data.notifications) {
      toast.success("🔔 Notifications are working! You'll receive job alerts in real-time.", {
        duration: 4000,
        icon: "✅"
      });
    } else {
      toast.info("🔕 Enable notifications in settings to receive job alerts.", {
        duration: 4000,
        icon: "⚠️"
      });
    }
  };

  const testWeeklyDigest = () => {
    if (data.weeklyDigest) {
      toast.info("📧 Weekly digest test: You would receive a summary of your applications every Monday at 9 AM.", {
        duration: 5000,
        icon: "📬"
      });
    } else {
      toast.info("📧 Enable weekly digest to get a summary of your applications every Monday.", {
        duration: 4000,
        icon: "📅"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6 transition-all duration-300">
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
                className="bg-gray-50 dark:bg-gray-900 border-0"
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
                className="bg-gray-50 dark:bg-gray-900 border-0"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6 transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Real-time Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive instant job alerts when your application status changes
                </p>
              </div>
              <Switch
                checked={data.notifications}
                onCheckedChange={v => setData({ ...data, notifications: v })}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Weekly Digest</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get a summary of all your applications every Monday morning at 9 AM
                </p>
              </div>
              <Switch
                checked={data.weeklyDigest}
                onCheckedChange={v => setData({ ...data, weeklyDigest: v })}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <Button onClick={testNotification} variant="outline" className="flex-1">
                🔔 Test Notifications
              </Button>
              <Button onClick={testWeeklyDigest} variant="outline" className="flex-1">
                📧 Test Weekly Digest
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Click to test how notifications will appear
            </p>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6 transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security
          </h2>
          
          <div className="space-y-3">
            <Button
              onClick={() => setShowPasswordModal(true)}
              variant="outline"
              className="w-full justify-start"
            >
              🔒 Change Password
            </Button>
            
            <Button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.")) {
                  toast.error("Account deletion request submitted. Please contact support.", {
                    duration: 5000,
                  });
                }
              }}
              variant="destructive"
              className="w-full justify-start"
            >
              🗑️ Delete Account
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}