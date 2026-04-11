import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard, Book, Settings, LogOut, Languages, Headphones, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Check for session timeout (12 hours)
  React.useEffect(() => {
    const checkTimeout = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const twelveHours = 12 * 60 * 60 * 1000;
        if (Date.now() - parseInt(loginTime, 10) >= twelveHours) {
          toast.error("Session expired. Please log in again.");
          handleLogout();
        }
      }
    };

    // Check initially
    checkTimeout();
    // Then check every minute
    const intervalId = setInterval(checkTimeout, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/books', icon: <Book size={20} />, label: 'Books' },
    { path: '/translations', icon: <Languages size={20} />, label: 'Translations' },
    { path: '/audio', icon: <Headphones size={20} />, label: 'Audio' },
    { path: '/quiz', icon: <HelpCircle size={20} />, label: 'Quiz' },
    { path: '/summary', icon: <Book size={20} />, label: 'Summary' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR - Only exists here! */}
      <aside className="w-64 bg-white border-r fixed h-full flex flex-col">
        <div className="p-6 font-bold text-xl text-blue-600 tracking-tight">BookBridge</div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
            >
              {item.icon}
              <span className="font-bold">{item.label}</span>
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-50 hover:text-red-600 group cursor-pointer"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 ml-64">
        {/* TOP BLUE HEADER - Only exists here! */}
        <header className="bg-blue-600 h-16 flex items-center justify-between px-8 text-white sticky top-0 z-50">
          <h2 className="text-lg font-medium">Admin Dashboard</h2>
        </header>

        {/* PAGE CONTENT - This is where Dashboard or ManageUsers injects */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}