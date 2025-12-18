
ContestHub
ContestHub is a full-stack contest platform where creators can host paid contests, participants can join and submit tasks, and admins manage everything with approval flow.

Live Site URL
https://strong-axolotl-c79cc6.netlify.app/

Features
Role-Based Dashboards
Separate dashboards for Users, Creators, and Admins with full access control.
Contest Creation & Management
Creators can create, edit (before approval), and delete contests. Includes banner image, entry fee, prize money, task instructions, and deadline.
Admin Approval System
All new contests start as "Pending". Admins can Confirm, Reject, or Delete contests. Only confirmed contests are visible to users.
Secure Payments with Stripe
Participants pay entry fee via Stripe Checkout (BDT currency supported). Minimum ৳100 entry fee enforced.
Task Submission
Registered participants can submit task links. Creators view submissions and declare winners.
Winner Declaration & Leaderboard
Creators declare winners. Dynamic Leaderboard ranks users by number of wins with trophies for top 3.
User Profile & Stats
Users see participated contests, winning contests, win percentage chart, and profile stats.
Google & Email Authentication
Login/Registration with Firebase Auth (Google Sign-In + Email/Password).
JWT Security
All private APIs protected with JWT tokens. Token auto-sent via Axios interceptors.
Responsive & Modern UI
Built with React, Tailwind CSS, and DaisyUI — fully responsive and beautiful design.
Pagination
All Contests page shows 10 contests per page with navigation.
Dark/Light Theme Toggle
Theme switch with localStorage persistence.
Extra Pages
Leaderboard and How It Works pages added for better user experience.
Technologies Used
Frontend: React, React Router, React Hook Form, DaisyUI, Tailwind CSS
Backend: Node.js, Express, MongoDB
Authentication: Firebase Auth
Payments: Stripe
State Management: React Query (Tanstack Query)
Deployment: Netlify (frontend)
Thank you for visiting ContestHub! 🏆

Made with ❤️ by [Razdee Rahman]