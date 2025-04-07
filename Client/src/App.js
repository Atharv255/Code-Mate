import { Routes, Route } from "react-router-dom";
import About from "./components/About.jsx";
import Lobby from "./components/Lobby.jsx";
import Room from "./components/Room.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId/:email" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
