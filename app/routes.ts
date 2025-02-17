import { 
  type RouteConfig, 
  index,
  route 
} from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),

  // Protected routes group
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard/index.tsx"),
    route("profile", "routes/dashboard/profile.tsx"),
    route("settings", "routes/dashboard/settings.tsx")
  ])
] satisfies RouteConfig;
