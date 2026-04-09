import logo from "../assets/Photos/i.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full h-16 bg-blue-600 flex items-center justify-between px-6">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        {/* Logo Box */}
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        <h1 className="text-white text-xl font-semibold">
          Admin Panel
        </h1>
      </div>

      {/* Right Section */}
      <div className="text-white text-sm flex gap-6">
        <Link to="/documentation" className="cursor-pointer hover:text-blue-200 transition-colors">Documentation</Link>
      </div>
    </div>
  );
}