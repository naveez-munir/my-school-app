import type { Route } from "../+types";
import ExamDetailView from "~/components/examSection/exams/ExamDetailView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exam Details" },
    { name: "description", content: "View exam details" },
  ];
}

export default function ExamDetail() {
  return <ExamDetailView />;
}
