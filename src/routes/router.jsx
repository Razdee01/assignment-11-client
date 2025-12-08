import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";
import Home from "../pages/Home";
import AllContests from "../pages/AllContests";
import ContactUs from "../pages/ContactUs";
import Error from "../components/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "contests", element: <AllContests /> },
      { path: "contact", element: <ContactUs /> },
    ],
  },
]);
