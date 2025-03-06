import { useParams } from 'react-router';
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exam Results Management" },
    { name: "description", content: "Manage school exam results" },
  ];
}

export default function ExamResults() {
  const { id, action } = useParams();
  if (action === "new") {
    return <h1>New </h1>;
  }

  if (id && action === "edit") {
    return <h1>Edit</h1>;
  }

  if (id && !action) {
    return <h1>Details</h1>;
  }

  return <h1>Exam dashboard</h1>;
}
