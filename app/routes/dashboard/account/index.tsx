import { useParams } from 'react-router'
import type { Route } from "../+types";
import { SalaryStructureSection } from '~/components/account/salaryStructure/SalaryStructureSection';
import { SalarySection } from '~/components/account/salary/SalarySection';
import { ExpenseSection } from '~/components/account/expense/ExpenseSection';
import { PaymentSection } from '~/components/account/payment/PaymentSection';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function Account() {
  const {action } = useParams();
  if (action === "payment") {
    return <PaymentSection />;
  }
  if (action === "expenses") {
    return <ExpenseSection />;
  }
  if (action === "salary-structure") {
    return <SalaryStructureSection />;
  }
  if (action === "salary") {
    return <SalarySection />;
  }
  return <div>
    <h1> Account management </h1>
  </div>;
}
