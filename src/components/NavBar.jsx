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
          text: "See you soon!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      })
      .catch(() => {
        Swal.fire({ icon: "error", title: "Error", text: "Logout failed!" });
      });
  };

  // Logic for NavLink Styling
  const navLinkStyles = ({ isActive }) =>
    `px-3 py-2 transition-all duration-300 custom-nav-link ${
      isActive ? "active-link" : ""
    }`;

  const navItems = (
    <>
      <li>
        <NavLink to="/" className={navLinkStyles}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-contests" className={navLinkStyles}>
          All Contests
        </NavLink>
      </li>
      <li>
        <NavLink to="/how-it-works" className={navLinkStyles}>
          How It Works
        </NavLink>
      </li>
      <li>
        <NavLink to="/leaderboard" className={navLinkStyles}>
          Leaderboard
        </NavLink>
      </li>
    </>
  );

  return (
    <div
      className="sticky top-0 z-[100] w-full border-b border-base-content/5 transition-all duration-300 backdrop-blur-md"
      style={{
        backgroundColor: "var(--background-nav)", // This ensures the background color is always there
        opacity: 0.90, // Slight transparency for a modern glass look
      }}
    >
      <div className="navbar max-w-7xl mx-auto px-4 min-h-[4rem]">
        {/* Navbar Start */}
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-base-200 text-base-content"
            >
              {navItems}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2">
            <img className="w-10 h-10" src={FullLogo} alt="Logo" />
            <span className="hidden sm:block text-2xl font-black uppercase tracking-tighter">
              Contest<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">{navItems}</ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end gap-3">
          <ThemeToggle />

          {user ? (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar online ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user?.photoURL || "https://i.ibb.co/3S3s8Vj/user.png"}
                    alt="profile"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-base-200 text-base-content"
              >
                <li className="px-4 py-3 border-b border-base-200 mb-2">
                  <span className="text-[10px] uppercase text-primary font-bold">
                    Authorized User
                  </span>
                  <span className="font-bold truncate block">
                    {user?.displayName}
                  </span>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard Overview</Link>
                </li>
                <li>
                  <Link to="/dashboard/my-contests">
                    My Registered Contests
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/winning-contests">My Wins 🏆</Link>
                </li>
                <li>
                  <Link to="/dashboard/profile">Manage Profile</Link>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error font-bold"
                  >
                    Logout System
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary rounded-full px-6 btn-sm md:btn-md shadow-lg shadow-primary/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
