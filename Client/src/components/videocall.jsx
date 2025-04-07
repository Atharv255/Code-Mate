import React, { useState, useEffect, useRef } from "react";
import { Camera, Mic, MicOff, Phone, VideoOff, Code, X, User, PlusCircle, MinusCircle } from "lucide-react";

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoCall() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState([{ id: 1, name: "You", stream: null }]);

  const peerConnections = useRef({});
  const localStream = useRef(null);
  const socket = useRef(null); // WebSocket connection

  useEffect(() => {
    startLocalStream();
    setupSocket();
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      setParticipants([{ id: 1, name: "You", stream }]);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const setupSocket = () => {
    socket.current = new WebSocket("ws://your-signaling-server.com");

    socket.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case "offer":
          await handleOffer(data.offer, data.sender);
          break;
        case "answer":
          await handleAnswer(data.answer, data.sender);
          break;
        case "candidate":
          if (peerConnections.current[data.sender]) {
            await peerConnections.current[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate));
          }
          break;
        case "user-joined":
          createPeerConnection(data.id);
          break;
        case "user-left":
          removeParticipant(data.id);
          break;
        default:
          break;
      }
    };
  };

  const createPeerConnection = (id) => {
    const pc = new RTCPeerConnection(config);

    localStream.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.send(JSON.stringify({ type: "candidate", candidate: event.candidate, receiver: id }));
      }
    };

    pc.ontrack = (event) => {
      setParticipants((prev) => [...prev, { id, name: `User ${id}`, stream: event.streams[0] }]);
    };

    peerConnections.current[id] = pc;
  };

  const handleOffer = async (offer, sender) => {
    if (!peerConnections.current[sender]) {
      createPeerConnection(sender);
    }

    try {
      await peerConnections.current[sender].setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnections.current[sender].createAnswer();
      await peerConnections.current[sender].setLocalDescription(answer);

      socket.current.send(JSON.stringify({ type: "answer", answer, receiver: sender }));
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const handleAnswer = async (answer, sender) => {
    if (peerConnections.current[sender]) {
      await peerConnections.current[sender].setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const addParticipant = () => {
    const newId = participants.length + 1;
    setParticipants([...participants, { id: newId, name: `User ${newId}`, stream: null }]);
    socket.current.send(JSON.stringify({ type: "user-joined", id: newId }));
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));

    if (peerConnections.current[id]) {
      peerConnections.current[id].close();
      delete peerConnections.current[id];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`flex-1 p-4 transition-all duration-300 ${isEditorOpen ? "w-[60%]" : "w-full"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
          {participants.map((participant) => (
            <div key={participant.id} className="relative overflow-hidden rounded-lg bg-white shadow-sm flex items-center justify-center">
              <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                {participant.name}
              </div>
              {participant.stream ? (
                <video ref={(video) => video && (video.srcObject = participant.stream)} autoPlay muted={participant.id === 1} className="w-full h-full object-cover" />
              ) : (
                <User size={50} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-sm border-t">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
            <button className={`p-3 rounded-full border ${isMuted ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100" : "hover:bg-gray-100 border-gray-200"}`} onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button className={`p-3 rounded-full border ${isVideoOff ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100" : "hover:bg-gray-100 border-gray-200"}`} onClick={() => setIsVideoOff(!isVideoOff)}>
              {isVideoOff ? <VideoOff size={20} /> : <Camera size={20} />}
            </button>
            <button className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600">
              <Phone size={20} className="rotate-[135deg]" />
            </button>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600" onClick={addParticipant}>
              <PlusCircle size={20} />
            </button>
            <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600" onClick={() => removeParticipant(participants.length)}>
              <MinusCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
