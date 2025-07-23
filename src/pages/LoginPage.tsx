import {
  Database,
  Image,
  Palette,
  PenLine,
  PenTool,
  Sparkles,
} from "lucide-react";
import React from "react";
import bgimage from "../assets/banner.png";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 md:flex-[0.5] bg-white flex justify-center items-center p-4 md:p-8 relative z-10">
        <div className="container max-w-md py-8 md:py-20">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-md p-2 mr-2">
                <PenTool className="w-6 h-6" />
              </span>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Kreatifana
              </h1>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right side - Visual/Illustration */}
      <div
        className="hidden md:flex flex-[0.5] relative bg-cover bg-center bg-gradient-to-br py-32 md:py-48 lg:py-40 flex-col justify-center items-center text-white  overflow-hidden"
        style={{
          backgroundImage: `url(${bgimage})`,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTAgNDBMNDAgMEgyMEwwIDIwTTQwIDQwVjIwTDIwIDQwIi8+PC9nPjwvc3ZnPg==')]" />

        <div className="container max-w-md z-10 text-center p-8 -mt-60">
          <h2 className="text-3xl font-bold mb-6">
            Unlock your creative potential
          </h2>
          <p className="text-lg mb-12 opacity-90">
            Join thousands of designers, artists, and creative professionals on
            the ultimate platform for creative collaboration.
          </p>

          {/* Feature icons */}
          <div className="flex justify-center flex-wrap gap-8 mx-auto max-w-sm">
            {[
              { icon: <PenLine size={24} />, label: "Design" },
              { icon: <Image size={24} />, label: "Imagery" },
              { icon: <Palette size={24} />, label: "Colors" },
              { icon: <Database size={24} />, label: "Assets" },
              { icon: <Sparkles size={24} />, label: "AI Tools" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-3 rounded-md bg-white/20 backdrop-blur-lg w-20 h-20 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/30"
              >
                {item.icon}
                <span className="text-xs mt-2 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
