const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Graphic Designer",
      text: "ContestHub is where I found my first professional client. The competition is tough but the rewards are worth it!",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "Rahat Ahmed",
      role: "Full-Stack Dev",
      text: "The coding challenges here are world-class. I love the leaderboard system and the community support.",
      avatar: "https://i.pravatar.cc/150?u=rahat",
    },
  ];

  return (
    <section
      className="py-20"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-4">
            Testimonials
          </h2>
          <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            What our <span className="text-primary">Creators</span> say
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 sm:p-10 rounded-[3rem] border border-base-content/10 relative overflow-hidden group hover:border-primary transition-all duration-500"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--background-nav), var(--text-nav) 3%)",
              }}
            >
              <p className="text-xl italic opacity-80 mb-8 leading-relaxed text-center md:text-left">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <img
                  src={rev.avatar}
                  className="w-14 h-14 rounded-full border-2 border-primary"
                  alt={rev.name}
                />
                <div className="text-center md:text-left">
                  <h4 className="font-bold text-lg">{rev.name}</h4>
                  <p className="text-sm opacity-50 uppercase tracking-widest">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
