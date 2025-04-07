import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/SocketProvider";
import { Video, Users, ArrowRight, Copy, Sparkles } from "lucide-react";
import { v4 as uuid } from "uuid";
import toast, { Toaster } from "react-hot-toast";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    
    // Validate fields before submitting
    if (!email.trim() || !room.trim()) {
      toast.error("All fields are required!", {
        className: "bg-red-700 text-white",
      });
      return;
    }
    
    socket.emit("room:join", { email, room });
  }, [email, room, socket]);

  const generateRoomId = useCallback(() => {
    const newRoomId = uuid();
    setRoom(newRoomId);
    toast.success(`Room ID generated: ${newRoomId}`);
  }, []);

  const copyRoomIdToClipboard = useCallback(() => {
    if (!room) return toast.error("No Room ID to copy!");
    navigator.clipboard.writeText(room)
      .then(() => toast.success("Room ID copied to clipboard!", { icon: "📋" }))
      .catch(() => toast.error("Failed to copy Room ID"));
  }, [room]);

  const handleJoinRoom = useCallback(({ room, email }) => {
    navigate(`/room/${room}/${email}`);
  }, [navigate]);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => socket.off("room:join", handleJoinRoom);
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 md:p-10">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-gray-800 text-gray-100",
          success: {
            className: "bg-green-700 text-white",
            iconTheme: { primary: "#fff", secondary: "#059669" }
          },
          error: { className: "bg-red-700 text-white" }
        }}
      />

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 border border-gray-700/50 transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/10">
        <header className="text-center space-y-5 md:space-y-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-transform hover:scale-105">
            <Video className="w-9 h-9 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join Video Room
          </h1>
          <p className="text-gray-300/90 text-sm sm:text-base md:text-lg">
            Collaborate seamlessly with crystal-clear video
          </p>
        </header>

        <form onSubmit={handleSubmitForm} className="mt-10 md:mt-12 space-y-7 md:space-y-8">
          <div className="space-y-5 md:space-y-6">
            {/* Room ID Input Group */}
            <div className="space-y-3">
              <label htmlFor="roomId" className="block text-sm md:text-base font-medium text-gray-300">
                Room ID
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    id="roomId"
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-5 py-3.5 text-sm md:text-base rounded-xl bg-gray-800/70 border border-gray-600/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 text-gray-100 placeholder-gray-400 transition-all"
                    placeholder="Paste room ID"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={copyRoomIdToClipboard}
                    className="px-4 py-3.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600/50 flex items-center justify-center transition-all hover:scale-105"
                    aria-label="Copy Room ID"
                  >
                    <Copy className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                  </button>
                  <button
                    type="button"
                    onClick={generateRoomId}
                    className="px-4 py-3.5 bg-purple-600/70 hover:bg-purple-500/70 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                    aria-label="Generate New Room ID"
                  >
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Name Input Group */}
            <div className="space-y-3">
              <label htmlFor="userName" className="block text-sm md:text-base font-medium text-gray-300">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <Users className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                </div>
                <input
                  id="userName"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 text-sm md:text-base rounded-xl bg-gray-800/70 border border-gray-600/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 text-gray-100 placeholder-gray-400 transition-all"
                  placeholder="Enter your display name"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-sm md:text-base"
          >
            Join Now
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;