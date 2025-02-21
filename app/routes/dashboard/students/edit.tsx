
import type { Route } from "../+types";
import { StudentFormPage } from "~/components/student/StudentFormPage";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Edit Student" },
    { name: "description", content: "Edit student information" },
  ];
}

export default function StudentEdit() {
  return (
    <StudentFormPage />
  );
}
