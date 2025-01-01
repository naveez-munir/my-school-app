import type { Route } from "./+types";
import ExamTypeDashboard from "~/components/examSection/examTypes/Index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exam Types Management" },
    { name: "description", content: "Manage school exam types and curriculum" },
  ];
}

export default function ExamTypes() {
  return <ExamTypeDashboard />;
}
