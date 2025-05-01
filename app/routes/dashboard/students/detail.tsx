
import { useParams } from "react-router";
import type { Route } from "../+types";
import { StudentDetailPage } from "~/components/student/StudentDetailPage";
import { StudentLeavesTable } from "~/components/leave/student/StudentLeavesList";
import { StudentDailyDiaryDashboard } from "~/components/dailyDiary/StudentDailyDiary";
import StudentExamDashboard from "~/components/examSection/exams/StudentExamDashboard";
import StudentResultDashboard from "~/components/examSection/examResult/StudentResultDashboard";

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
  if (id === 'dairy') {
    return <StudentDailyDiaryDashboard />
  }
  if(id === 'exams') {
    return <StudentExamDashboard />
  }
  if(id === 'result') {
    return <StudentResultDashboard />
  }
  return <StudentDetailPage />;
}
