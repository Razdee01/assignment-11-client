import React from "react";
import { FaRocket, FaUsers, FaShieldAlt } from "react-icons/fa";

const About = () => {
  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-20">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">
            Our <span className="text-primary">Mission</span>
          </h1>
          <p className="max-w-2xl mx-auto opacity-60 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed">
            We are building the world's most transparent platform for creators
            to compete, win, and level up their careers through high-stakes
            challenges.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaRocket />,
              title: "Innovation",
              desc: "Pushing the boundaries of what creators can achieve in digital spaces.",
            },
            {
              icon: <FaUsers />,
              title: "Community",
              desc: "A global network of designers, developers, and thinkers collaborating.",
            },
            {
              icon: <FaShieldAlt />,
              title: "Fairness",
              desc: "Strict verification and expert judging to ensure the best work always wins.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-10 rounded-[2.5rem] bg-base-content/5 border border-base-content/10 hover:border-primary/50 transition-all text-center space-y-4"
            >
              <div className="text-4xl text-primary flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic">
                {item.title}
              </h3>
              <p className="text-sm opacity-60 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default About;
