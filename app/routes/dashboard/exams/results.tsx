import type { Route } from "../+types";
import { ExamResultSection } from '~/components/examSection/examResult/ExamResultSection';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Exam Results Management" },
    { name: "description", content: "Manage school exam results" },
  ];
}

export default function ExamResults() {
  return <ExamResultSection />
}
