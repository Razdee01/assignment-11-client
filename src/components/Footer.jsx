// components/Footer.jsx
import React from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import FullLogo from "../assets/FullLogo.png"; // make sure the path is correct

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo + Name */}
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src={FullLogo}
            alt="ContestHub Logo"
            className="h-10 w-10 mr-3"
          />
          <span className="text-2xl font-bold">
            Contest<span className="text-purple-500">Hub</span>
          </span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <a
            href="https://www.facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm opacity-70">
          © 2025 ContestHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
