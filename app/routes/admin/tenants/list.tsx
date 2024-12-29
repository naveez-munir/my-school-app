import { TenantSection } from "~/components/tenant/TenantSection";

export function meta() {
  return [
    { title: "Tenant Management" },
    { name: "description", content: "Manage tenants across the system" },
  ];
}

export default function TenantsList() {
  return <TenantSection />;
}