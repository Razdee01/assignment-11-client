import { createBrowserRouter, Navigate } from "react-router-dom";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/Home";
import AllContests from "../pages/AllContests";
import HowItWorks from "../pages/HowItWorks";
import Error from "../components/Error";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import ContestDetails from "../pages/ContestDetails";
import PaymentSuccess from "../pages/PaymentSuccess";
import DashBoardUser from "../pages/DashBoardUser";
import Dashboard from "../pages/DashBoard"; // Creator
import DashBoardAdmin from "../pages/DashBoardAdmin";
import SeeSubmisson from "../pages/SeeSubmisson";
import EditContest from "../pages/EditContest";
import PrivetRoute from "./PrivetRoute";
import RoleRedirect from "../pages/RoleRedirect";
import LeaderBoard from "../pages/LeaderBoard";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Privacy from "../pages/Privacy";
// import RoleRedirect from "../components/RoleRedirect"; // ← Import

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-contests", element: <AllContests /> },
      // { path: "how-it-works", element: <HowItWorks /> },
      { path: "login", element: <Login /> },
      { path: "registration", element: <Registration /> },
      { path: "leaderboard", element: <LeaderBoard></LeaderBoard> },
 
 
  
{ path:"/about", element:<About /> },
{ path:"/contact", element:<Contact /> },
{ path:"/privacy", element:<Privacy /> },
  // {path:"/help", element:<Help /> },
  
  

      // Public pages
      {
        path: "contests/:id",
        element: (
          
            <ContestDetails />
          
        ),
      },
      { path: "payment-success", element: <PaymentSuccess /> },

      // Main dashboard — redirect by role
      {
        path: "/dashboard",
        element: (
          <PrivetRoute>
            <RoleRedirect />
          </PrivetRoute>
        ),
      },

      // User Dashboard
      {
        path: "/dashboard/user",
        element: (
          <PrivetRoute allowedRoles={["User"]}>
            <DashBoardUser />
          </PrivetRoute>
        ),
      },

      // Creator Dashboard
      {
        path: "/dashboard/creator",
        element: (
          <PrivetRoute allowedRoles={["Creator"]}>
            <Dashboard />
          </PrivetRoute>
        ),
      },

      // Admin Dashboard
      {
        path: "/dashboard/admin",
        element: (
          <PrivetRoute allowedRoles={["Admin"]}>
            <DashBoardAdmin />
          </PrivetRoute>
        ),
      },

      // See Submissions (Creator or Admin)
      {
        path: "/see-submissions/:contestId",
        element: (
          <PrivetRoute allowedRoles={["Creator", "Admin"]}>
            <SeeSubmisson />
          </PrivetRoute>
        ),
      },

      // Edit Contest (Creator only)
      {
        path: "/edit-contest/:id",
        element: (
          <PrivetRoute allowedRoles={["Creator"]}>
            <EditContest />
          </PrivetRoute>
        ),
      },
    ],
  },
]);
