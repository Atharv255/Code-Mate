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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-white text-slate-800 shadow-lg",
          success: {
            className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
            iconTheme: { primary: "#059669", secondary: "#fff" }
          },
          error: { 
            className: "bg-red-50 text-red-800 border border-red-200",
            iconTheme: { primary: "#dc2626", secondary: "#fff" }
          }
        }}
      />

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-slate-200 transition-all duration-300">
        <header className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
            <div className="relative bg-gradient-to-b from-blue-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25">
              <Video className="w-10 h-10 text-white drop-shadow-lg" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">
              Join Video Room
            </h1>
            <p className="text-slate-600 text-base sm:text-lg font-medium">
              Connect and collaborate in real-time
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmitForm} className="mt-12 space-y-8">
          <div className="space-y-6">
            {/* Room ID Input Group */}
            <div className="space-y-3">
              <label htmlFor="roomId" className="block text-base font-semibold text-slate-700">
                Room ID
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <input
                    id="roomId"
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-5 py-4 text-base rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-400"
                    placeholder="Enter or paste room ID"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={copyRoomIdToClipboard}
                    className="p-4 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500/20"
                    aria-label="Copy Room ID"
                  >
                    <Copy className="w-6 h-6 text-slate-600" />
                  </button>
                  <button
                    type="button"
                    onClick={generateRoomId}
                    className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl border border-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-500/20"
                    aria-label="Generate New Room ID"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Name Input Group */}
            <div className="space-y-3">
              <label htmlFor="userName" className="block text-base font-semibold text-slate-700">
                Your Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-slate-400 transition-colors duration-300 group-hover:text-blue-500">
                  <Users className="w-6 h-6" aria-hidden="true" />
                </div>
                <input
                  id="userName"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 text-base rounded-xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder-slate-400 transition-all duration-300 hover:border-slate-400"
                  placeholder="Enter your display name"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-blue-500/25 text-base"
          >
            Join Video Room
            <ArrowRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;