import React from "react";
import { NavLink } from "react-router";
import FullLogo from "../assets/FullLogo.png";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
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
                  isActive ? "text-primary font-bold" : "font-semibold"
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contests"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : "font-semibold"
                }
              >
                All Contests
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "text-primary font-bold" : "font-semibold"
                }
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>
        <img className="w-15" src={FullLogo} alt="Logo" />

        <a className="text-2xl font-bold cursor-pointer">
          Contest<span className="text-purple-500">Hub</span>
        </a>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : "font-semibold"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contests"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : "font-semibold"
              }
            >
              All Contests
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-primary font-bold" : "font-semibold"
              }
            >
              Contact Us
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <a className="btn">Login</a>
      </div>
    </div>
  );
};

export default NavBar;
