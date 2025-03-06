import type { Route } from "../+types";
import ExamTypeDashboard from "~/components/examSection/examTypes/Index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "examType Management" },
    { name: "description", content: "Manage school examTypes and curriculum" },
  ];
}

export default function ExamType() {

  return (
    <ExamTypeDashboard />
  );
}
