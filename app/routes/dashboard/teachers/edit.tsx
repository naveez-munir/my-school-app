import type { Route } from "./+types";
import { EditTeacher } from "~/components/teacher/EditTeacher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teachers edit Management" },
    { name: "description", content: "Manage teacher edit information and assignments" },
  ];
}

export default function TeachersEdit() {
  return (
    <EditTeacher />
  );
}
