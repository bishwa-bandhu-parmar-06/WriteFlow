import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-500 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img className="w-10 h-10 mr-2" src={Logo} alt="WriteFlow" />
        <span className="text-white text-lg font-semibold">WriteFlow</span>
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

        {/* Conditional rendering based on user auth status */}
        {user ? (
          <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-500 font-semibold focus:outline-none overflow-hidden">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-sm">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <NavLink 
                to="/profile" 
                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
              >
                Profile
              </NavLink>
              <NavLink 
                to="/settings" 
                className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
              >
                Edit Details
              </NavLink>
              <button 
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
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
