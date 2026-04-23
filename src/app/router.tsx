import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import User from "@routes/User";
import Analysis from "@routes/Analysis";
import DiagnosisResults from "@routes/DiagnosisResults";
import Login from "@routes/Login";
import Profile from "@routes/Profile";
import History from "@routes/History";
import Weather from "@routes/Weather";
import AuthProvider from "@context/auth/AuthProvider";
import { useAuth } from "@context/auth/useAuth";
import { LanguageProvider } from "@context/lang/LanguageProvider";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const wasLoading = React.useRef(loading);

  useEffect(() => {
    // Only show the toast if we just finished the INITIAL loader
    // and found no session. This prevents it from firing on Logout.
    if (wasLoading.current === true && !loading && !isAuthenticated) {
      toast.error("Session Required", {
        description: "Please log in to access your field intelligence.",
      });
    }
    wasLoading.current = loading;
  }, [isAuthenticated, loading]);

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const AuthLayout = () => (
  <LanguageProvider>
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Outlet />
    </AuthProvider>
  </LanguageProvider>
);

const routes = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/users",
            element: <User />,
          },
          {
            path: "/analysis",
            element: <Analysis />,
          },
          {
            path: "/diagnosis-results",
            element: <DiagnosisResults />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/history",
            element: <History />,
          },
          {
            path: "/weather",
            element: <Weather />,
          },
        ],
      },
      {
        path: "/*",
        element: <Navigate to="/weather" replace />,
      },
      {
        path: "/",
        element: <Navigate to="/weather" replace />,
      },
    ],
  },
];

export const Router = () => {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Router;
