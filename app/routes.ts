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
    route("students", "routes/dashboard/students.tsx"),
    route("attendance", "routes/dashboard/attendance.tsx"),
    route("courses", "routes/dashboard/courses.tsx"),
    route("teachers", "routes/dashboard/teachers.tsx"),
    route("management", "routes/dashboard/management.tsx"),
    route("settings", "routes/dashboard/settings.tsx")
  ])
] satisfies RouteConfig;
