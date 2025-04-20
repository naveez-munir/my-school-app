
import { useParams } from "react-router";
import type { Route } from "../+types";
import { StudentDetailPage } from "~/components/student/StudentDetailPage";
import { StudentLeavesTable } from "~/components/leave/student/StudentLeavesList";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Student Details" },
    { name: "description", content: "View student details and information" },
  ];
}

export default function StudentDetail() {
  const { id } = useParams();
  if (id === 'leave') {
    return <StudentLeavesTable />
  }
  return <StudentDetailPage />;
}
