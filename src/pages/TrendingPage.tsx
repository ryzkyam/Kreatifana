import { Eye, Heart, MessageCircle } from "lucide-react";
import React from "react";

const projects = [
  {
    id: 1,
    title: "Modern Dashboard Design",
    description: "A clean and modern dashboard design with dark mode support",
    image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
    author: {
      name: "Sarah Chen",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    stats: {
      likes: 1234,
      comments: 56,
      views: 4321,
    },
    tags: ["UI Design", "Dashboard", "Dark Mode"],
  },
  {
    id: 2,
    title: "3D Character Animation",
    description: "Character animation for an upcoming indie game",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    author: {
      name: "Mike Johnson",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    stats: {
      likes: 892,
      comments: 34,
      views: 2156,
    },
    tags: ["3D Animation", "Game Design", "Character"],
  },
  {
    id: 3,
    title: "Brand Identity Design",
    description: "Complete brand identity design for a tech startup",
    image: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg",
    author: {
      name: "Emma Wilson",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
    stats: {
      likes: 567,
      comments: 23,
      views: 1789,
    },
    tags: ["Branding", "Logo Design", "Identity"],
  },
];

const TrendingPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8 ml-10">
        <h1 className="text-2xl font-bold text-gray-900">Trending Now</h1>
        <p className="mt-1 text-gray-600"></p>
      </div>

      <div className="grid container px-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-16 mb-10 cursor-pointer">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full md:w-48 object-cover"
                  src={project.image}
                  alt={project.title}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={project.author.avatar}
                    alt={project.author.name}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {project.author.name}
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{project.description}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {project.stats.likes}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {project.stats.comments}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {project.stats.views}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
