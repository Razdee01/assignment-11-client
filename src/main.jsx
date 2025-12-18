import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router/dom";
import { router } from './routes/router.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProviders from './contexts/AuthProviders.jsx';
import AOS from "aos";
import "aos/dist/aos.css";

const queryClient = new QueryClient();
AOS.init({
  duration: 800,
  once: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProviders>
        <RouterProvider router={router} />
      </AuthProviders>
    </QueryClientProvider>
  </StrictMode>
);
