import { useParams } from 'react-router'
import type { Route } from "../+types";
import { ExpenseSection } from '~/components/account/expense/ExpenseSection';
import { LeaveSection } from '~/components/leave/staff/LeaveSection';
import { AllStudentLeavesTable } from '~/components/leave/student';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leave Management" },
    { name: "description", content: "Manage staff and student leaves" },
  ];
}

export default function Leave() {
  const { action } = useParams();

  if (!action) {
    return <LeaveSection />;
  }

  if (action === "staff") {
    return <LeaveSection />;
  }

  if (action === "student") {
    return <AllStudentLeavesTable />;
  }

  if (action === "expenses") {
    return <ExpenseSection />;
  }

  return <LeaveSection />;
}
