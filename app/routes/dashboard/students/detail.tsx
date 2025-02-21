
import { useParams } from "react-router";
import type { Route } from "../+types";
import { StudentDetailPage } from "~/components/student/StudentDetailPage";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Student Details" },
    { name: "description", content: "View student details and information" },
  ];
}

export default function StudentDetail() {
  const { id } = useParams();
  return <StudentDetailPage id={id!} />;
}
