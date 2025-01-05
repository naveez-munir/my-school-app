import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import type { Route } from "../+types";
import ParentDashboard from '~/components/guardian';
import { StudentDetailPage } from '~/components/student/StudentDetailPage';
import { StudentLeavesTable } from '~/components/leave/student/StudentLeavesList';
import { GuardianFeeSection } from '~/components/guardian/GuardianFeeSection';
import { StudentDailyDiaryDashboard } from '~/components/dailyDiary/StudentDailyDiary';
import { GuardianAcademicSection } from '~/components/guardian/GuardianAcademicSection';
import { StudentScheduleView } from '~/components/timetable/schedules/StudentScheduleView';
import { useStudentSchedule } from '~/hooks/useScheduleQueries';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Guardian Child management" },
    { name: "description", content: "Manage child data" },
  ];
}

export default function GuardianRoute() {
  const { action, id } = useParams();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(id || '');

  useEffect(() => {
    if (id) {
      setSelectedStudentId(id);
    }
  }, [id]);

  const handleStudentChange = (studentId: string) => {
    setSelectedStudentId(studentId);
  };
  
  return (
    <ParentDashboard
      selectedStudentId={selectedStudentId}
      onStudentChange={handleStudentChange}
    >
      <SectionRenderer 
        action={action} 
        studentId={selectedStudentId} 
      />
    </ParentDashboard>
  );
}

const SectionRenderer = ({ 
  action, 
  studentId 
}: { 
  action?: string; 
  studentId: string 
}) => {

  if (!studentId) {
    return null;
  }

  switch(action) {
    case "academic":
      return <GuardianAcademicSection studentId={studentId} />;
    case "fees":
      return <GuardianFeeSection studentId={studentId} />;
    case "leave":
      return <StudentLeavesTable studentId={studentId}/>;
    case "daily-diary":
      return <StudentDailyDiaryDashboard studentId={studentId} />;
    case "children":
    default:
      return <StudentDetailPage stId={studentId}/>
  }
}
