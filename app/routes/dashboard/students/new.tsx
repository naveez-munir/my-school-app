import type { Route } from "../+types";
import { StudentFormPage } from "~/components/student/StudentFormPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add New Student" },
    { name: "description", content: "Add a new student to the system" },
  ];
}

export default function StudentNew() {
  return (
    <StudentFormPage />
  );
}
