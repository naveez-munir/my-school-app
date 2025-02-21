import { StudentSection } from "~/components/student";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Students Management" },
    { name: "description", content: "Manage student information and records" },
  ];
}

export default function Students() {
  return (
    <StudentSection />
  );
}
