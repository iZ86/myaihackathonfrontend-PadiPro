import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Home from "@routes/Home";
import User from "@routes/User";



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
    element: <Navigate to="/home" replace />
  }
];

export const Router = () => {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
