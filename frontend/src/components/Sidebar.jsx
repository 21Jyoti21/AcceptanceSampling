import { Link } from "react-router-dom";
import { Home, BarChart, Upload, FileText, Settings, Info } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-gray-900 text-gray-200 flex flex-col shadow-lg fixed">
      <div className="p-4 text-xl font-bold text-green-400">Sampling App</div>
      <nav className="flex flex-col gap-2 mt-4 px-2">
        <Link to="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 hover:text-green-400">
          <Home size={18}/> Home
        </Link>
        <Link to="/sampling" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 hover:text-green-400">
          <BarChart size={18}/> Sampling Plans
        </Link>
        <Link to="/upload" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 hover:text-green-400">
          <Upload size={18}/> Upload Data
        </Link>
        <Link to="/results" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 hover:text-green-400">
          <FileText size={18}/> Results
        </Link>
        <Link to="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 hover:text-green-400">
          <Settings size={18}/> Settings
        </Link>
        <Link to="/about" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 hover:text-green-400">
          <Info size={18}/> About
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
