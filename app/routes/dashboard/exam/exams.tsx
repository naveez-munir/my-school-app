import { useParams } from 'react-router'
import ExamForm from "~/components/examSection/exams/ExamForm";
import ExamDashboard from "~/components/examSection/exams/Index";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exams Management" },
    { name: "description", content: "Manage school Exam and curriculum" },
  ];
}

export default function Exams() {
  const { id, action } = useParams();
  if (action === "new") {
    return <ExamForm />;
  }

  if (id && action === "edit") {
    return <ExamForm />;
  }
  return <ExamDashboard />;
}
