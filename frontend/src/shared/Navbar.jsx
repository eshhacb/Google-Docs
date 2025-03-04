import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = document.cookie.includes("token=");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between">
      <div className="text-lg font-semibold">Auth App</div>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link className="hover:underline" to="/login">Login</Link>
            <Link className="hover:underline" to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link className="hover:underline" to="/dashboard">Dashboard</Link>
            <button className="hover:underline" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
