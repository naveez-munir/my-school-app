import { TimetableList } from '~/components/timetable/timetables/TimetableList';

export function meta() {
  return [
    { title: "Timetables" },
    { name: "description", content: "Manage class timetables" },
  ];
}

export default function TimetablesPage() {
  return <TimetableList />;
}

