import React from "react";

const Privacy = () => {
  const sections = [
    {
      title: "Data Collection",
      content:
        "We collect basic profile information (email, name, photo) via Google/Email to manage your contest entries and payments.",
    },
    {
      title: "Payment Security",
      content:
        "All financial transactions are handled via Stripe. We do not store your credit card details on our servers.",
    },
    {
      title: "Contest Rules",
      content:
        "Creators must provide clear instructions. Plagiarism will result in a permanent ban from the platform.",
    },
    {
      title: "Winner Selection",
      content:
        "The contest creator has sole authority to select a winner unless the contest is flagged for manual review by an Admin.",
    },
  ];

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            Legal <span className="text-primary">Directives</span>
          </h1>
          <p className="opacity-40 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">
            Last Updated: January 2026
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((item, i) => (
            <div
              key={i}
              className="collapse collapse-arrow bg-base-content/5 border border-base-content/10 rounded-2xl"
            >
              <input
                type="radio"
                name="privacy-accordion"
                defaultChecked={i === 0}
              />
              <div className="collapse-title text-lg font-black italic uppercase tracking-widest">
                {item.title}
              </div>
              <div className="collapse-content opacity-70 text-sm leading-relaxed">
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Privacy;
