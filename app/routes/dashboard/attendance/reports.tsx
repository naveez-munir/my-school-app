import { AttendanceReports } from "~/components/attendance/AttendanceReports";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Attendance Reports" },
    { name: "description", content: "View attendance analytics and reports" },
  ];
}

export default function Reports() {
  return <AttendanceReports />;
}