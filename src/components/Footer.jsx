import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";
import FullLogo from "../assets/FullLogo.png";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer
      className="py-16 border-t border-base-content/10 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <img src={FullLogo} alt="ContestHub" className="h-10 w-10 mr-3" />
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Contest<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              The ultimate platform for creators to showcase skills, compete in
              global challenges, and win amazing prizes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  All Contests
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">
              Support
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Presence */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[
                {
                  icon: <FaLinkedinIn />,
                  // Added https:// here
                  link: "https://www.linkedin.com/in/walid-rahman-rajdee-029b08264",
                  color: "hover:bg-blue-700",
                },
                
                {
                  icon: <FaTwitter />,
                  link: "https://x.com/RahmanRazdee",
                  color: "hover:bg-sky-500",
                },
                {
                  icon: <FaGithub />,
                  link: "https://github.com/Razdee01",
                  color: "hover:bg-pink-600",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className={`w-10 h-10 rounded-full border border-base-content/10 flex items-center justify-center transition-all duration-300 hover:text-white hover:border-transparent ${social.color} hover:-translate-y-1`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50 font-medium">
          <p>© 2026 ContestHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
