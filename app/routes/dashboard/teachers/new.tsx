import { CreateTeacher } from "~/components/teacher/CreateTeacher";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teachers Management" },
    { name: "description", content: "Manage teacher information and assignments" },
  ];
}

export default function NewTeachers() {
  return (
    <CreateTeacher />
  );
}
