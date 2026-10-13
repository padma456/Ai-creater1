
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIStudio from "./pages/AIStudio";
import Marketplace from "./pages/Marketplace";
import CreateContent from "./pages/CreateContent";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import DiscoverCreators from "./pages/DiscoverCreators";
export default function App() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ai-studio" element={<AIStudio />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create" element={<CreateContent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/discover-creators" element={<DiscoverCreators />} />
        </Routes>
      </main>
    </>
  );
}
