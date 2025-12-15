import React from "react";

const DemoDashboard = () => {
  // Hardcoded data for User Section
  const participatedContests = [
    { name: "Contest A", paymentStatus: "Paid", deadline: "2023-12-01" },
    { name: "Contest B", paymentStatus: "Unpaid", deadline: "2023-11-15" },
    { name: "Contest C", paymentStatus: "Paid", deadline: "2023-12-10" },
  ].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const winningContests = [
    { name: "Contest X", prize: "$500" },
    { name: "Contest Y", prize: "$1000" },
  ];

  const userProfile = {
    avatar: "https://via.placeholder.com/150",
    name: "John Doe",
    bio: "Enthusiastic contestant with a passion for challenges.",
  };

  // Hardcoded data for Creator Section
  const createdContests = [
    { name: "My Contest 1", status: "Active" },
    { name: "My Contest 2", status: "Closed" },
  ];

  const submittedTasks = [
    {
      participant: "User A",
      email: "usera@example.com",
      task: "Task description",
      contest: "My Contest 1",
    },
    {
      participant: "User B",
      email: "userb@example.com",
      task: "Another task",
      contest: "My Contest 2",
    },
  ];

  // Hardcoded data for Admin Section
  const users = [
    { name: "John Doe", role: "User" },
    { name: "Jane Smith", role: "Creator" },
    { name: "Admin User", role: "Admin" },
  ];

  const contests = [
    { name: "Contest P", status: "Pending" },
    { name: "Contest Q", status: "Approved" },
  ];

  return (
    <div className="p-5 font-sans">
      {/* User Section */}
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-5">User Section</h1>

        {/* Participated Contests Table */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-5">
          <h2 className="text-xl font-semibold mb-2.5">
            Participated Contests
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2.5 text-left">Name</th>
                <th className="p-2.5 text-left">Payment Status</th>
                <th className="p-2.5 text-left">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {participatedContests.map((contest, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2.5">{contest.name}</td>
                  <td className="p-2.5">{contest.paymentStatus}</td>
                  <td className="p-2.5">{contest.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Winning Contests Cards */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-2.5">Winning Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {winningContests.map((contest, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg shadow-md text-center"
              >
                <h3 className="text-lg font-medium">{contest.name}</h3>
                <p>Prize: {contest.prize}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2.5">Profile</h2>
          <div className="flex items-center mb-5">
            <img
              src={userProfile.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full mr-5"
            />
            <div>
              <h3 className="text-lg font-medium">{userProfile.name}</h3>
              <p>{userProfile.bio}</p>
            </div>
          </div>
          {/* Update Form */}
          <form className="grid gap-2.5">
            <input
              type="text"
              placeholder="Name"
              defaultValue={userProfile.name}
              className="p-2.5 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Bio"
              defaultValue={userProfile.bio}
              className="p-2.5 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>
          {/* Win Percentage Chart Placeholder */}
          <div className="mt-5 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            Win Percentage Chart Placeholder
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-5">Creator Section</h1>

        {/* Add Contest Form */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-5">
          <h2 className="text-xl font-semibold mb-2.5">Add Contest</h2>
          <form className="grid gap-2.5">
            <input
              type="text"
              placeholder="Name"
              className="p-2.5 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              className="p-2.5 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description"
              className="p-2.5 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              className="p-2.5 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Prize"
              className="p-2.5 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Task Instruction"
              className="p-2.5 border border-gray-300 rounded"
            />
            <select className="p-2.5 border border-gray-300 rounded">
              <option>Contest Type</option>
              <option>Type A</option>
              <option>Type B</option>
            </select>
            <input
              type="date"
              className="p-2.5 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="p-2.5 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Contest
            </button>
          </form>
        </div>

        {/* My Created Contests Table */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-5">
          <h2 className="text-xl font-semibold mb-2.5">My Created Contests</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2.5 text-left">Name</th>
                <th className="p-2.5 text-left">Status</th>
                <th className="p-2.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {createdContests.map((contest, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2.5">{contest.name}</td>
                  <td className="p-2.5">{contest.status}</td>
                  <td className="p-2.5 flex gap-2.5">
                    <button className="px-2.5 py-1.25 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="px-2.5 py-1.25 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                    <button className="px-2.5 py-1.25 bg-cyan-500 text-white rounded hover:bg-cyan-600">
                      See Submissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submitted Tasks Table */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2.5">Submitted Tasks</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2.5 text-left">Participant</th>
                <th className="p-2.5 text-left">Email</th>
                <th className="p-2.5 text-left">Task</th>
                <th className="p-2.5 text-left">Contest</th>
                <th className="p-2.5 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {submittedTasks.map((task, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2.5">{task.participant}</td>
                  <td className="p-2.5">{task.email}</td>
                  <td className="p-2.5">{task.task}</td>
                  <td className="p-2.5">{task.contest}</td>
                  <td className="p-2.5">
                    <button className="px-2.5 py-1.25 bg-green-500 text-white rounded hover:bg-green-600">
                      Declare Winner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admin Section */}
      <section>
        <h1 className="text-2xl font-bold mb-5">Admin Section</h1>

        {/* Manage Users Table */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-5">
          <h2 className="text-xl font-semibold mb-2.5">Manage Users</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2.5 text-left">Name</th>
                <th className="p-2.5 text-left">Role</th>
                <th className="p-2.5 text-left">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2.5">{user.name}</td>
                  <td className="p-2.5">{user.role}</td>
                  <td className="p-2.5">
                    <select className="p-1.25 border border-gray-300 rounded">
                      <option>User</option>
                      <option>Creator</option>
                      <option>Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Manage Contests Table */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2.5">Manage Contests</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2.5 text-left">Name</th>
                <th className="p-2.5 text-left">Status</th>
                <th className="p-2.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2.5">{contest.name}</td>
                  <td className="p-2.5">{contest.status}</td>
                  <td className="p-2.5 flex gap-2.5">
                    <button className="px-2.5 py-1.25 bg-green-500 text-white rounded hover:bg-green-600">
                      Confirm
                    </button>
                    <button className="px-2.5 py-1.25 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      Reject
                    </button>
                    <button className="px-2.5 py-1.25 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DemoDashboard;
