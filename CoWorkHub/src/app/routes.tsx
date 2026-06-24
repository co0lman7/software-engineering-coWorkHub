import { createBrowserRouter } from "react-router";
import { Landing }          from "./pages/Landing";
import { Login }            from "./pages/Login";
import { WorkspaceListing } from "./pages/WorkspaceListing";
import { WorkspaceDetails } from "./pages/WorkspaceDetails";
import { Booking }          from "./pages/Booking";
import { UserDashboard }    from "./pages/UserDashboard";
import { AdminDashboard }   from "./pages/AdminDashboard";
import { ProtectedRoute }   from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/",              Component: Landing },
  { path: "/login",         Component: Login },
  { path: "/workspaces",    Component: WorkspaceListing },
  { path: "/workspace/:id", Component: WorkspaceDetails },
  { path: "/booking/:id",   element: <ProtectedRoute><Booking /></ProtectedRoute> },
  { path: "/dashboard",     element: <ProtectedRoute><UserDashboard /></ProtectedRoute> },
  { path: "/admin",         element: <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute> },
]);
