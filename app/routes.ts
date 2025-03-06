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
    // Students routes
    route("students", "routes/dashboard/students/students.tsx", [
      index("routes/dashboard/students/list.tsx"),
      route("new", "routes/dashboard/students/new.tsx"),
      route(":id", "routes/dashboard/students/detail.tsx"),
      route(":id/edit", "routes/dashboard/students/edit.tsx"),
    ]),
    // Class routes
    route("classes", "routes/dashboard/classes/classes.tsx", [
      index("routes/dashboard/classes/list.tsx"),
      route("new", "routes/dashboard/classes/new.tsx"),
      route(":id/edit", "routes/dashboard/classes/edit.tsx"),
    ]),
    // Class routes
    route("teachers", "routes/dashboard/teachers/teachers.tsx", [
      index("routes/dashboard/teachers/index.tsx"),
      route("new", "routes/dashboard/teachers/new.tsx"),
      route(":id/edit", "routes/dashboard/teachers/edit.tsx"),
    ]),
    route("exams/:id?/:action?", "routes/dashboard/exam/exams.tsx"),
    route("exams/results/:id?/:action?", "routes/dashboard/exam/examResults.tsx"),
    route("daily-diary/new", "routes/dashboard/dailyDiary/new.tsx"),
    route("daily-diary/:id?/:action?", "routes/dashboard/dailyDiary/index.tsx"),
    route("attendance/:id?/:action?", "routes/dashboard/attendance/attendance.tsx"),
    route("attendance/new", "routes/dashboard/attendance/new.tsx"),
    route("courses", "routes/dashboard/courses.tsx"),
    route("exam-types", "routes/dashboard/exam/examType.tsx"),
    route("management", "routes/dashboard/management.tsx"),
    route("settings", "routes/dashboard/settings.tsx")
  ])
] satisfies RouteConfig;
