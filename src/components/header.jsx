import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark";
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDark = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        <h1
          className="font-bold text-xl cursor-pointer text-gray-900 dark:text-white"
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
          <Button variant="ghost" onClick={toggleDark}>
            {isDark ? "☀️" : "🌙"}
          </Button>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};