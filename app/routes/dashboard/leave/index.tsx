import { useParams } from 'react-router'
import type { Route } from "../+types";
import { ExpenseSection } from '~/components/account/expense/ExpenseSection';
import { LeaveSection } from '~/components/leave/staff/LeaveSection';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function Leave() {
  const {action, type } = useParams();
  if (action === "staff") {
    return <LeaveSection />;
  }
  if (action === "expenses") {
    return <ExpenseSection />;
  }
  return <div>
    <h1> Leave management </h1>
  </div>;
}
