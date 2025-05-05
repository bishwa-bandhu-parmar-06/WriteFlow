import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // console.log("Users Data : ", user);
  return (
    <nav className="flex items-center justify-between p-4 bg-blue-500 shadow-md">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate("/")}
      >
        <img
          className="w-12 h-12 object-contain"
          src={Logo}
          alt="WriteFlow Logo"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-white font-bold underline"
              : "text-white hover:text-gray-200"
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-white font-bold underline"
              : "text-white hover:text-gray-200"
          }
          to="/about"
        >
          About
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-white font-bold underline"
              : "text-white hover:text-gray-200"
          }
          to="/contact"
        >
          Contact
        </NavLink>

        {/* Profile Dropdown - Only shown when user is logged in */}
        {user ? (
          <div className="relative group">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-500 font-semibold focus:outline-none overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </button>

            {/* Dropdown Menu with gap and pointer-events */}
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1">
              <div className="absolute -top-3 right-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>

              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              <NavLink
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Profile
              </NavLink>

              {/* <NavLink 
                to="/edit-profile" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Edit Profile
              </NavLink> */}

              {/* <NavLink 
                to="/delete-profile" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Delete Profile
              </NavLink> */}

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-white font-bold underline"
                : "text-white hover:text-gray-200"
            }
            to="/auth"
          >
            Signin/Signup
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
