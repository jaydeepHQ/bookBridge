import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../../assets/Photos/Logo-White.png";
import Navbar from "../Navbar.jsx";
import { Eye, EyeOff, BookOpen } from "lucide-react"; // Using lucide for better icons
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate('/dashboard');
    }
  }, [navigate]);

  // 1. State for inputs and errors
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // 2. Validation Logic
  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } 

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (formData.email === "admin@gmail.com" && formData.password === "admin@123") {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Login successful! Welcome to the dashboard.");
        navigate('/dashboard');
      } else {
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center py-12">
        <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            {/* Logo */}
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200 mb-6">
              <img src={LogoWhite} alt="BookBridge Logo" className="w-[60px] h-[60px] object-contain" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to access your admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Email Address</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" }); // Clear error on type
                }}
                placeholder="admin@company.com"
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                  }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" }); // Clear error on type
                  }}
                  placeholder="********"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                    }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 cursor-pointer transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm py-6">
          © 2026 Admin Panel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}