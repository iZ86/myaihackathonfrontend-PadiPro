import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import User from "@routes/User";
import Analysis from "@routes/Analysis";
import DiagnosisResults from "@routes/DiagnosisResults";
import Login from "@routes/Login";
import Profile from "@routes/Profile";
import History from "@routes/History";
import Weather from "@routes/Weather";
import AuthProvider from "@context/AuthProvider";
// import Home from "@routes/Home";
// import SignUp from "@routes/SignUp";
// import Products from "@routes/Products";

const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
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
        path: "/users",
        element: <User />,
      },
      {
        path: "/*",
        element: <Navigate to="/weather" replace />,
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
      // {
      //   path: "/products",
      //   element: <Products />,
      // },
      // {
      //   path: "/signup",
      //   element: <SignUp />,
      // },
      // {
      //   path: "/home",
      //   element: <Home />,
      // },
    ],
  },
];

export const Router = () => {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
