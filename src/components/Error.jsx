import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGhost, FaArrowLeft } from "react-icons/fa";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-all duration-300 px-4"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="text-center space-y-6">
        {/* Animated Ghost Icon */}
        <div className="relative inline-block animate-bounce">
          <FaGhost className="text-8xl md:text-9xl text-primary opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black italic uppercase tracking-tighter text-primary">
              Lost
            </span>
          </div>
        </div>

        {/* Glitchy 404 Text */}
        <h1 className="text-[12rem] md:text-[18rem] font-black leading-none italic uppercase tracking-tighter opacity-10 select-none">
          404
        </h1>

        <div className="-mt-20 md:-mt-32 space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
            Signal <span className="text-primary">Lost</span>
          </h2>
          <p className="max-w-md mx-auto opacity-60 font-bold text-sm uppercase tracking-widest leading-relaxed">
            The coordinates you provided do not exist in our database. The page
            has been moved or deleted from the mainframe.
          </p>
        </div>

        {/* Back Button */}
        <div className="pt-10">
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary btn-wide rounded-full font-black italic uppercase tracking-widest gap-3 shadow-[0_0_20px_rgba(0,123,255,0.3)] hover:shadow-primary/50 transition-all"
          >
            <FaArrowLeft /> Return to Base
          </button>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
};

export default Error;
