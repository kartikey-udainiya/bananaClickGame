import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Banana, Trophy, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface PlayerLayoutProps {
  children: React.ReactNode;
}

const PlayerLayout: React.FC<PlayerLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Banana className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Banana Clicker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block font-medium">
              Hello, {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 py-1 px-3 bg-red-500 hover:bg-red-600 rounded-full text-sm font-medium transition duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`py-4 px-3 flex items-center gap-2 border-b-2 font-medium transition duration-150 ${
                pathname === "/"
                  ? "border-primary-500 text-primary-700"
                  : "border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800"
              }`}
            >
              <Banana className="h-5 w-5" />
              <span>Play</span>
            </Link>
            <Link
              to="/ranking"
              className={`py-4 px-3 flex items-center gap-2 border-b-2 font-medium transition duration-150 ${
                pathname === "/ranking"
                  ? "border-primary-500 text-primary-700"
                  : "border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-800"
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span>Rankings</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>By - Kartikey udainiya </p>
        </div>
      </footer>
    </div>
  );
};

export default PlayerLayout;
