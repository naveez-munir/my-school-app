import type { Route } from "../+types";
import ExamForm from "~/components/examSection/exams/ExamForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create New Exam" },
    { name: "description", content: "Create a new exam" },
  ];
}

export default function ExamNew() {
  return <ExamForm />;
}
