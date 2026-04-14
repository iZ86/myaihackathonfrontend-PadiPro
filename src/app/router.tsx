import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Home from "@routes/Home";
import User from "@routes/User";
import SignUp from "@routes/SignUp";
import Analysis from "@routes/Analysis";
import DiagnosisResults from "@routes/DiagnosisResults";
import Products from "@routes/Products";
import Login from "@routes/Login";
import Profile from "@routes/Profile";
import History from "@routes/History";

const routes = [
  // Guest routes
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/users",
    element: <User />,
  },
  {
    path: "/*",
    element: <Navigate to="/home" replace />,
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
    path: "/products",
    element: <Products />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/history",
    element: <History />,
  },
];

export const Router = () => {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
