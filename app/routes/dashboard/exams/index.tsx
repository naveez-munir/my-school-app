import type { Route } from "../+types";
import ExamDashboard from "~/components/examSection/exams/Index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exams Management" },
    { name: "description", content: "Manage school Exam and curriculum" },
  ];
}

export default function Exams() {
  return <ExamDashboard />;
}
