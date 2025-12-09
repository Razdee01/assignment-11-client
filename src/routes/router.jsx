import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/Home";
import AllContests from "../pages/AllContests";
import ContactUs from "../pages/HowItWorks";
import Error from "../components/Error";
import HowItWorks from "../pages/HowItWorks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "contests", element: <AllContests /> },
      { path: "how-it-works", element: <HowItWorks /> },
    ],
  },
]);
