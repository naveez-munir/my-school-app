import { AttendanceSection } from "~/components/attendance/AttendanceSection";
import type { Route } from "../+types";
import { useParams } from "react-router";
import { EditAttendance } from "~/components/attendance/EditAttendance";
import { AttendanceDetail } from "~/components/attendance/AttendanceDetail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Attendance Tracking" },
    { name: "description", content: "Track and manage student attendance" },
  ];
}

export default function Attendance() {
  const { id, action } = useParams();
  if (id && action === "edit") {
    return <EditAttendance />;
  }

  if (id && !action) {
    return <AttendanceDetail />;
  }
  return <AttendanceSection />;
}
