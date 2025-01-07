import type { Route } from "./+types";
import { EditStaff } from "~/components/staff/EditStaff";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Staff Member" },
    { name: "description", content: "Update staff member information" },
  ];
}

export default function StaffEdit() {
  return (
    <EditStaff />
  );
}

