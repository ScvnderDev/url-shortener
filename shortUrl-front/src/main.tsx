import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider

import NotFoundPage from "./components/NotFoundPage.tsx";
import Home from "./pages/home.tsx";
import AuthScreen from "./components/AuthScreen.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

// Create QueryClient instance
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthScreen />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "*", // 404 route
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap the RouterProvider with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
