import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 dark:bg-gray-900/60 border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        <h1
          className="font-bold text-xl cursor-pointer"
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
            🌙
          </Button>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};