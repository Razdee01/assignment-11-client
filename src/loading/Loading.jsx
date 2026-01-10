import React from "react";

const Loading = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen transition-all duration-500"
      style={{ backgroundColor: "var(--background-nav)" }}
    >
      <div className="flex flex-col items-center">
        {/* Animated Core */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <div className="w-20 h-20 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>

          {/* Inner Pulsing Circle */}
          <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>

          {/* Static Center Point */}
          <div className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#007BFF]"></div>
        </div>

        {/* Text Styling */}
        <div className="mt-8 text-center">
          <p
            className="text-2xl font-black uppercase italic tracking-[0.3em] animate-pulse"
            style={{ color: "var(--text-nav)" }}
          >
            System <span className="text-primary">Loading</span>
          </p>
          <div className="mt-2 w-48 h-[2px] bg-base-content/10 overflow-hidden">
            <div className="w-full h-full bg-primary origin-left animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Keyframe (Add this to your globals.css or keep as-is if using DaisyUI) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `,
        }}
      />
    </div>
  );
};

export default Loading;
