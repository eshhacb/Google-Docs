import React from "react";
import { Link } from "react-router-dom";  // To navigate to different pages if needed

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-purple-500 to-pink-500 text-white">
      <div className="flex items-center justify-center h-20 text-2xl font-semibold">
        <span>Collabify</span>
      </div>

      <div className="flex flex-col space-y-4 p-4">
        {/* Links or items for the sidebar */}
        <Link
          to="/collaboration"
          className="text-white hover:bg-pink-600 p-2 rounded-md transition-all"
        >
          Collaboration
        </Link>
        <Link
          to="/documents"
          className="text-white hover:bg-pink-600 p-2 rounded-md transition-all"
        >
          Documents
        </Link>
        <Link
          to="/profile"
          className="text-white hover:bg-pink-600 p-2 rounded-md transition-all"
        >
          Profile
        </Link>
        <Link
          to="/settings"
          className="text-white hover:bg-pink-600 p-2 rounded-md transition-all"
        >
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
