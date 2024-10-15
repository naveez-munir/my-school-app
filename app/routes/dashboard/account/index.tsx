import { useParams } from 'react-router'
import type { Route } from "../+types";
import { SalaryStructureSection } from '~/components/account/salaryStructure/SalaryStructureSection';
import { SalarySection } from '~/components/account/salary/SalarySection';
import { SalaryDetailView } from '~/components/account/salary/SalaryDetailView';
import { ExpenseSection } from '~/components/account/expense/ExpenseSection';
import { PaymentSection } from '~/components/account/payment/PaymentSection';
import NewSalary from './salary/new';
import NewSalaryStructure from './salary-structure/new';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Account Management" },
    { name: "description", content: "Manage school accounts" },
  ];
}

export default function Account() {
  const { action, subaction, id } = useParams();

  if (action === "salary") {
    if (subaction === "new") {
      return <NewSalary />;
    }
    if (subaction && id === "edit") {
      return <NewSalary mode="edit" salaryId={subaction} />;
    }
    if (subaction && !id) {
      return <SalaryDetailView />;
    }
    return <SalarySection />;
  }

  if (action === "payment") {
    return <PaymentSection />;
  }

  if (action === "expenses") {
    return <ExpenseSection />;
  }
  if (action === "salary-structure") {
    if (subaction === "new") {
      return <NewSalaryStructure />;
    }
    if (subaction && id === "edit") {
      return <NewSalaryStructure mode="edit" structureId={subaction} />;
    }
    return <SalaryStructureSection />;
  }

  return <div>
    <h1> Account management </h1>
  </div>;
}
