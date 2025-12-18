import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FullLogo from "../assets/FullLogo.png";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);
  

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You have been logged out successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
       
      });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-purple-500" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/all-contests"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-purple-500" : ""}`
                }
              >
                All Contests
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/how-it-works"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-purple-500" : ""}`
                }
              >
                How It Works
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-purple-500" : ""}`
                }
              >
                Leaderboard
              </NavLink>
            </li>
          </ul>
        </div>

        <img className="w-15" src={FullLogo} alt="Logo" />

        <a className="text-2xl font-bold cursor-pointer">
          Contest<span className="text-purple-500">Hub</span>
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-purple-500" : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/all-contests"
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-purple-500" : ""}`
              }
            >
              All Contests
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-purple-500" : ""}`
              }
            >
              How It Works
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-purple-500" : ""}`
              }
            >
              Leaderboard
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right Side */}
      
      <div className="navbar-end">
        <ThemeToggle />
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="cursor-pointer">
              <img
                src={user.photoURL}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
              />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box w-52 shadow p-2"
            >
              <li className="pointer-events-none font-bold text-center py-2">
                {user.displayName || "No Name"}
              </li>

              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-semibold"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
