import { useNavigate } from "react-router-dom";
import { Terminal, Video, Users, ArrowRight } from "lucide-react";

function About() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="w-full h-full max-h-[90vh] flex items-center justify-center">
        <div className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-500">
          <div className="h-full flex flex-col justify-between gap-4 sm:gap-6 md:gap-8">
            {/* Header Section */}
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform">
                <Terminal className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Welcome to <span className="block sm:inline bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">CodeMate</span>
              </h1>
            </div>

            {/* Features Section */}
            <div className="grid gap-3 sm:gap-4 md:gap-5 text-gray-300 mx-auto w-full max-w-2xl">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all hover:bg-gray-800/70">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-400 flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Real-time collaborative coding environment
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all hover:bg-gray-800/70">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-pink-400 flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Integrated video conferencing
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all hover:bg-gray-800/70">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400 flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Instant code synchronization
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/lobby")}
              className="group relative w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 sm:py-4 md:py-5 px-6 rounded-xl text-base sm:text-lg md:text-xl transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                Start Coding Now
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;