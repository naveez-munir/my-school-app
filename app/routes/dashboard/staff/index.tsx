import type { Route } from "./+types";
import { StaffSection } from '~/components/staff/StaffSection';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Staff Management" },
    { name: "description", content: "Manage staff members" },
  ];
}

export default function Staff() {
  return <StaffSection />;
}
