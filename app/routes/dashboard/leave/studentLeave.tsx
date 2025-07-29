import { useParams } from 'react-router'
import type { Route } from "../+types";
import { PendingLeavesTable } from '~/components/leave/student/PendingLeaves';
import { AllStudentLeavesTable } from '~/components/leave/student';
import { StudentLeaveDetailsView } from '~/components/leave/student/StudentLeaveDetails';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Leave Management" },
    { name: "description", content: "Manage student leaves" },
  ];
}

export default function Leave() {
  const {action, id} = useParams();
  if (action === "pending") {
    return <PendingLeavesTable />;
  }
  if(id){
    return <StudentLeaveDetailsView />
  }
  return <AllStudentLeavesTable />;
}
