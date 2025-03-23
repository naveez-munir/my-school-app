import { useParams } from 'react-router'
import type { Route } from "../+types";
import { PersonalInfoForm } from '~/components/student/form/PersonalInfoForm';
import { AcademicInfoForm } from '~/components/student/form/AcademicInfoStep';
import { StatusForm } from '~/components/student/form/StatusForm';
import { DocumentsForm } from '~/components/student/form/DocumentsForm';
import { GuardianInfoForm } from '~/components/student/form/GuardianInfoForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function Account() {
  const {action } = useParams();
  if (action === "personal") {
    return <PersonalInfoForm />;
  }
  if (action === "academic") {
    return <AcademicInfoForm />
  }
  if (action === "guardian") {
    return <GuardianInfoForm />;
  }
  if (action === "status") {
    return <StatusForm />;
  }
  if (action === "documents") {
    return <DocumentsForm />;
  }
  return <div>
    <h1> Student management </h1>
  </div>;
}
