import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileUp, PenTool, LogOut, MessageSquare } from "lucide-react";
import { auth } from "../../lib/firebase";

const Sidebar: React.FC = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/chat", icon: MessageSquare, label: "Chat Rooms" },
    { to: "/upload", icon: FileUp, label: "Files" },
    { to: "/create", icon: PenTool, label: "New Post" },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass border-r border-white/10 flex flex-col p-6 z-50">
      <div className="mb-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          NexusApp
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
