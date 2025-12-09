const HowItWorks = () => {
  const steps = [
    {
      title: "Register an Account",
      description:
        "Sign up on ContestHub to start participating in creative contests.",
    },
    {
      title: "Browse Contests",
      description:
        "Explore all contests on the platform, filter by type, and find your favorite ones.",
    },
    {
      title: "Participate & Submit",
      description:
        "Follow the contest guidelines and submit your creative entries before the deadline.",
    },
    {
      title: "Win Prizes",
      description:
        "Top entries are selected by judges or votes. Claim your rewards and recognition.",
    },
    {
      title: "Track Your Progress",
      description:
        "Check your submissions, leaderboard, and upcoming contests in your profile.",
    },
  ];

  return (
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 bg-white"
          >
            <h3 className="text-xl font-semibold mb-2">
              Step {index + 1}: {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
