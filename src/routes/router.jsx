import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/Home";
import AllContests from "../pages/AllContests";
import ContactUs from "../pages/HowItWorks";
import Error from "../components/Error";
import HowItWorks from "../pages/HowItWorks";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import DashBoard from "../pages/DashBoard";
import ContestDetails from "../pages/ContestDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-contests", element: <AllContests /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "/login", element: <Login /> },
      { path: "/registration", element: <Registration /> },
      { path: "/dashboard", element: <DashBoard /> },
      { path: "/contests/:id", element: <ContestDetails /> },
    ],
  },
]);
