import {
  Calendar,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Grid,
  Heart,
  Instagram,
  Linkedin,
  List,
  Mail,
  MapPin,
  Plus,
  Upload,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mockPortfolios, mockUsers } from "../components/data/MockData";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadingCV, setIsUploadingCV] = useState(false);

  const user = mockUsers.find((u) => u.id === id);
  const userPortfolios = mockPortfolios.filter((p) => p.creator.id === id);
  const isOwnProfile = id === "1"; // Simulate current user

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User not found
          </h2>
          <Link
            to="/portfolio"
            className="text-purple-600 hover:text-purple-700"
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingCV(true);
      // Simulate upload
      setTimeout(() => {
        setIsUploadingCV(false);
        alert("CV uploaded successfully!");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/portfolio" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CreativeHubsssss
              </span>
            </Link>

            <nav className="flex space-x-8">
              <Link
                to="/portfolio"
                className="text-gray-500 hover:text-gray-700"
              >
                Gallery
              </Link>
              <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                src={user.avatar}
                alt={user.name}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {isOwnProfile ? (
                    <>
                      <Link
                        to={`/profile/${id}/edit`}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Link>
                      <Link
                        to="/portfolio/create"
                        className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Portfolio</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </button>
                      {user.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{user.bio}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user.portfolioCount}
                  </div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userPortfolios.reduce((sum, p) => sum + p.likes, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userPortfolios.reduce((sum, p) => sum + p.views, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-200">
            {user.social.linkedin && (
              <a
                href={`https://linkedin.com/in/${user.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {user.social.instagram && (
              <a
                href={`https://instagram.com/${user.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* CV Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Resume / CV
              </h3>
              <p className="text-gray-600">
                {isOwnProfile
                  ? "Download or upload a new version"
                  : "Download resume"}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {user.cvUrl && (
                <a
                  href={user.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </a>
              )}

              {isOwnProfile && (
                <label className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>
                    {isUploadingCV ? "Uploading..." : "Upload New CV"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    className="hidden"
                    disabled={isUploadingCV}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Portfolio ({userPortfolios.length})
            </h3>

            <div className="flex items-center space-x-3">
              {isOwnProfile && (
                <Link
                  to="/portfolio/create"
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </Link>
              )}

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {userPortfolios.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isOwnProfile ? "No projects yet" : "No projects to show"}
              </h3>
              <p className="text-gray-500 mb-4">
                {isOwnProfile
                  ? "Mulailah membangun portofolio Anda dengan menambahkan proyek pertama Anda"
                  : "Kamu belum menambahkan proyek apa pun."}
              </p>
              {isOwnProfile && (
                <Link
                  to="/portfolio/create"
                  className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Karya Pertama Mu</span>
                </Link>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPortfolios.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  to={`/portfolio/${portfolio.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      src={portfolio.images[0]}
                      alt={portfolio.title}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {portfolio.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {portfolio.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {portfolio.category}
                      </span>

                      <div className="flex items-center space-x-3 text-gray-500">
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userPortfolios.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  to={`/portfolio/${portfolio.id}`}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    className="w-24 h-18 rounded-lg object-cover flex-shrink-0"
                    src={portfolio.images[0]}
                    alt={portfolio.title}
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {portfolio.title}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {portfolio.category}
                        </span>
                      </div>

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

                    <p className="text-gray-600 text-sm">
                      {portfolio.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
