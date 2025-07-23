import {
  ExternalLink,
  Eye,
  Filter,
  Grid,
  Heart,
  List,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mockPortfolios } from "../components/data/MockData";
import { Portfolio } from "../types";

const PortfolioGallery: React.FC = () => {
  const [portfolios] = useState<Portfolio[]>(mockPortfolios);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "all",
    "Mobile Design",
    "Web Development",
    "Branding",
    "Illustration",
    "Photography",
  ];

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesSearch =
      portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "all" || portfolio.category === filterCategory;
    return matchesSearch && matchesCategory && portfolio.status === "published";
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4"></h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto"></p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Cari Portfolio Kreator..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    src={portfolio.images[0]}
                    alt={portfolio.title}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Link
                        to={`/users/2`}
                        className="bg-white rounded-full p-2 hover:bg-purple-50"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-700" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {portfolio.category}
                    </span>
                    {portfolio.featured && (
                      <span className="text-yellow-400 text-sm">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {portfolio.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {portfolio.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/profile/${portfolio.creator.id}`}
                      className="flex items-center space-x-2 hover:text-purple-600 transition-colors"
                    >
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={portfolio.creator.avatar}
                        alt={portfolio.creator.name}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {portfolio.creator.name}
                      </span>
                    </Link>

                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{portfolio.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{portfolio.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  <img
                    className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                    src={portfolio.images[0]}
                    alt={portfolio.title}
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-purple-600 transition-colors">
                          {portfolio.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {portfolio.category}
                        </span>
                      </div>
                      {portfolio.featured && (
                        <span className="text-yellow-400">★ Featured</span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">
                      {portfolio.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link
                        to={`/profile/${portfolio.creator.id}`}
                        className="flex items-center space-x-2 hover:text-purple-600 transition-colors"
                      >
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          src={portfolio.creator.avatar}
                          alt={portfolio.creator.name}
                        />
                        <span className="font-medium">
                          {portfolio.creator.name}
                        </span>
                      </Link>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4 text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{portfolio.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{portfolio.likes}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/portfolio/${portfolio.id}`}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            View Project
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No portfolios found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioGallery;
