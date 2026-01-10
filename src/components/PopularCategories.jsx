const PopularCategories = () => {
  const categories = [
    { name: "Design", icon: "🎨", count: "12 Contests" },
    { name: "Coding", icon: "💻", count: "8 Contests" },
    { name: "Writing", icon: "✍️", count: "15 Contests" },
    { name: "Gaming", icon: "🎮", count: "5 Contests" },
  ];

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: "var(--background-nav)",
        color: "var(--text-nav)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tighter">
          Browse by <span className="text-primary">Category</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="p-6 sm:p-8 rounded-[2rem] border border-base-content/10 bg-base-200/50 hover:border-primary transition-all group cursor-pointer"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform flex justify-center">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-center">{cat.name}</h3>
              <p className="opacity-50 text-sm text-center">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PopularCategories;
