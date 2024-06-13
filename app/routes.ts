import { 
  type RouteConfig, 
  index,
  route 
} from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),

  // Super Admin routes
  route("admin/dashboard", "routes/admin/dashboard.tsx"),
  route("admin/tenants", "routes/admin/tenants.tsx", [
    index("routes/admin/tenants/list.tsx"),
    route("new", "routes/admin/tenants/new.tsx"),
    route(":id", "routes/admin/tenants/detail.tsx"),
  ]),
  route("admin/tenant-config", "routes/admin/tenant-config.tsx", [
    index("routes/admin/tenant-config/list.tsx"),
    route(":id", "routes/admin/tenant-config/detail.tsx"),
  ]),

  // Protected routes group
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard/index.tsx"),
    route("profile", "routes/dashboard/profile.tsx"),
    // Students routes
    route("students", "routes/dashboard/students/students.tsx", [
      index("routes/dashboard/students/list.tsx"),
      route("new", "routes/dashboard/students/new.tsx"),
      route(":id", "routes/dashboard/students/detail.tsx"),
      route(":id/edit/:action", "routes/dashboard/students/edit.tsx"),
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
    // Staff routes
    route("staff", "routes/dashboard/staff/staff.tsx", [
      index("routes/dashboard/staff/index.tsx"),
      route("new", "routes/dashboard/staff/new.tsx"),
      route(":id/edit", "routes/dashboard/staff/edit.tsx"),
    ]),
    route("exams", "routes/dashboard/exams.tsx", [
      index("routes/dashboard/exams/index.tsx"),
      route("new", "routes/dashboard/exams/new.tsx"),
      route("results", "routes/dashboard/exams/results.tsx"),
      route("results/bulk-entry", "routes/dashboard/exams/results/bulk-entry.tsx"),
      route(":id", "routes/dashboard/exams/$id.tsx"),
      route(":id/edit", "routes/dashboard/exams/$id.edit.tsx"),
    ]),
    route("accounts/:action?/:subaction?/:id?", "routes/dashboard/account/index.tsx"),
    route("fee/:action?", "routes/dashboard/studentFee/index.tsx"),
    route("guardian/:action?/:id?", "routes/dashboard/guardian/index.tsx"),
    route("salary", "routes/dashboard/salary.tsx", [
      route(":id", "routes/dashboard/salary/$id.tsx"),
    ]),
    route("leave/student/:action?/:id?", "routes/dashboard/leave/studentLeave.tsx"),
    route("leave/:action?", "routes/dashboard/leave/index.tsx"),
    route("daily-diary/new", "routes/dashboard/dailyDiary/new.tsx"),
    route("daily-diary/:id?/:action?", "routes/dashboard/dailyDiary/index.tsx"),
    route("attendance/:id?/:action?", "routes/dashboard/attendance/attendance.tsx"),
    route("attendance/new", "routes/dashboard/attendance/new.tsx"),
    route("attendance/batch", "routes/dashboard/attendance/batch.tsx"),
    route("attendance/reports", "routes/dashboard/attendance/reports.tsx"),
    // Timetable routes
    route("timetable", "routes/dashboard/timetable/timetable.tsx", [
      index("routes/dashboard/timetable/index.tsx"),
      route("periods", "routes/dashboard/timetable/periods/index.tsx"),
      route("periods/new", "routes/dashboard/timetable/periods/new.tsx"),
      route("allocations", "routes/dashboard/timetable/allocations/index.tsx"),
      route("allocations/new", "routes/dashboard/timetable/allocations/new.tsx"),
      route("timetables", "routes/dashboard/timetable/timetables/index.tsx"),
      route("timetables/new", "routes/dashboard/timetable/timetables/new.tsx"),
      route("timetables/:id", "routes/dashboard/timetable/timetables/$id.tsx"),
      route("schedule", "routes/dashboard/timetable/schedule/index.tsx"),
      route("exceptions", "routes/dashboard/timetable/exceptions/index.tsx"),
      route("exceptions/new", "routes/dashboard/timetable/exceptions/new.tsx"),
    ]),
    route("courses", "routes/dashboard/courses.tsx"),
    route("exam-types", "routes/dashboard/exam-types.tsx"),
    route("management", "routes/dashboard/management.tsx"),
    route("settings", "routes/dashboard/settings.tsx")
  ])
] satisfies RouteConfig;
