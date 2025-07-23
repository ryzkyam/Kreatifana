// src/components/layout/Header.tsx
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  PenTool,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/categories"
        onClick={() => setIsMenuOpen(false)}
        className="text-gray-700 hover:text-primary-600 block py-2"
      >
        Kategori
      </Link>
      <Link
        to="/trendings"
        onClick={() => setIsMenuOpen(false)}
        className="text-gray-700 hover:text-primary-600 block py-2"
      >
        Paling hitss
      </Link>
      <Link
        to="/portof"
        onClick={() => setIsMenuOpen(false)}
        className="text-gray-700 hover:text-primary-600 block py-2"
      >
        Portofolio/CV
      </Link>
    </>
  );

  const SearchBar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <form
      onSubmit={handleSearch}
      className={`w-full ${isMobile ? "mb-3" : "max-w-sm mx-4"}`}
    >
      <button type="submit" hidden></button>
    </form>
  );

  const UserActions = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (isLoading) {
      return (
        <div className={`flex items-center ${isMobile ? "flex-col" : ""}`}>
          <span className="text-gray-700">Loading user...</span>
        </div>
      );
    }

    if (!auth.user) {
      return (
        <div
          className={`flex ${
            isMobile ? "flex-col space-y-2 pt-4" : "space-x-4"
          }`}
        >
          <Link to="/LoginPage" onClick={() => setIsMenuOpen(false)}>
            <Button
              variant={isMobile ? "outline" : "ghost"}
              fullWidth={isMobile}
              leftIcon={<LogIn size={18} />}
            >
              Masuk
            </Button>
          </Link>
          <Link to="/Signupform" onClick={() => setIsMenuOpen(false)}>
            <Button
              className="font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent"
              fullWidth={isMobile}
            >
              Daftar
            </Button>
          </Link>
        </div>
      );
    }

    const currentUser = auth.user;

    const links = (
      <>
        <Link
          to="/favorites"
          className="text-gray-700 hover:text-primary-600 block py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Heart size={20} />
        </Link>
        <Link
          to="/Cart"
          className="text-gray-700 hover:text-primary-600 block py-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <ShoppingCart size={20} />
        </Link>
        {isMobile ? (
          <div className="space-y-2 mt-4">
            <Link
              to={`/profile/${currentUser.username}`}
              className="block w-full px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {currentUser.isAdmin && (
              <Link
                to="/AdminDashboard"
                className="block w-full px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
                navigate("/");
              }}
              className="block w-full px-4 py-3 rounded-md text-left text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} className="inline-block mr-2" />
              Keluar
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
            >
              <User size={20} />
              <span>{currentUser.name || currentUser.email}</span>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg z-20">
                <Link
                  to={`/profile/${currentUser.username}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Profile
                </Link>
                {currentUser.isAdmin && (
                  <Link
                    to="/AdminDashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );

    return isMobile ? (
      <div>{links}</div>
    ) : (
      <div className="flex items-center space-x-4">{links}</div>
    );
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md p-2">
              <PenTool className="w-5 h-5" />
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent pr-10">
              Kreatifana
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex">
            <UserActions />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-4 transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 scale-100 max-h-screen"
            : "opacity-0 scale-95 max-h-0 overflow-hidden"
        }`}
      >
        <SearchBar isMobile />
        <NavLinks />
        <UserActions isMobile />
      </div>
    </header>
  );
};

export default Header;
