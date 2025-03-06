
import { TeacherSection } from "~/components/teacher/TeacherSection";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teachers Management" },
    { name: "description", content: "Manage teacher information and assignments" },
  ];
}

export default function Teachers() {
  return (
    <TeacherSection />
  );
}
