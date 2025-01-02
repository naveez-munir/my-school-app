import type { Route } from "../+types";
import ExamForm from "~/components/examSection/exams/ExamForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Exam" },
    { name: "description", content: "Edit exam details" },
  ];
}

export default function ExamEdit() {
  return <ExamForm />;
}
