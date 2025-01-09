import { AllocationList } from '~/components/timetable/allocations/AllocationList';

export function meta() {
  return [
    { title: "Class Subject Allocations" },
    { name: "description", content: "Assign teachers to subjects for each class" },
  ];
}

export default function AllocationsPage() {
  return <AllocationList />;
}

