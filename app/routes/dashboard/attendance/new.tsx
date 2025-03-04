import { CreateAttendance } from "~/components/attendance/CreateAttendance";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Attendance Tracking" },
    { name: "description", content: "Track and manage student attendance" },
  ];
}

export default function Attendance() {
  return (
    <CreateAttendance/>
  );
}
