import { PeriodList } from '~/components/timetable/periods/PeriodList';

export function meta() {
  return [
    { title: "Period Management" },
    { name: "description", content: "Configure school periods and break times" },
  ];
}

export default function PeriodsPage() {
  return <PeriodList />;
}

