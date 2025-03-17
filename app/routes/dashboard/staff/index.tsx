import type { Route } from "../+types";
import { StaffSection } from '~/components/staff/StaffSection';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function StaffDetail() {
  return <StaffSection />;
}
