import { useParams } from 'react-router'
import type { Route } from "../+types";
import { FeeCategorySection } from '~/components/Fee/feeCategory';
import { FeePaymentSection } from '~/components/Fee/feePayment/FeePaymentSection';
import { FeeStructureSection } from '~/components/Fee/feeStructure';
import { StudentDiscountSection } from '~/components/Fee/studentDiscount/Index';
import { StudentFeeSection } from '~/components/Fee/studentFee/Index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function DailyDiary() {
  const {action } = useParams();
  if (action === "category") {
    return <FeeCategorySection />;
  }
  if (action === "payment") {
    return <FeePaymentSection />;
  }
  if (action === "structure") {
    return <FeeStructureSection />;
  }
  if (action === "discount") {
    return <StudentDiscountSection />;
  }
  if (action === "fee") {
    return <StudentFeeSection />;
  }
  return <StudentFeeSection />;
}
