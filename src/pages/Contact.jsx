import React from "react";
import { FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="opacity-60 font-bold uppercase tracking-widest text-sm">
            Have a question about a contest or payment? Our tactical support
            team is ready.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-base-content/5 border border-base-content/10">
              <FaMapMarkerAlt className="text-2xl text-primary" />
              <div>
                <p className="font-black uppercase italic text-xs opacity-40">
                  Headquarters
                </p>
                <p className="font-bold">Dhaka,Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-base-content/5 border border-base-content/10">
              <FaPhoneAlt className="text-2xl text-primary" />
              <div>
                <p className="font-black uppercase italic text-xs opacity-40">
                  Direct Line
                </p>
                <p className="font-bold">+880 1867075117</p>
              </div>
            </div>
          </div>
        </div>

        <form className="p-8 md:p-12 rounded-[3rem] bg-base-content/5 border border-base-content/10 shadow-2xl space-y-4">
          <input
            type="text"
            placeholder="YOUR NAME"
            className="input input-bordered w-full bg-transparent border-base-content/10 font-bold italic uppercase"
          />
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="input input-bordered w-full bg-transparent border-base-content/10 font-bold italic uppercase"
          />
          <textarea
            placeholder="MESSAGE CONTENT"
            className="textarea textarea-bordered w-full bg-transparent border-base-content/10 font-bold italic uppercase h-32"
          ></textarea>
          <button
            type="button"
            className="btn btn-primary w-full rounded-2xl font-black italic uppercase tracking-[0.2em] gap-3"
          >
            <FaPaperPlane /> Dispatch Signal
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
