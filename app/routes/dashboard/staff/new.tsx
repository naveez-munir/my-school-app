import { CreateStaff } from "~/components/staff/CreateStaff";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add New Staff Member" },
    { name: "description", content: "Create a new staff member profile" },
  ];
}

export default function NewStaff() {
  return (
    <CreateStaff />
  );
}

