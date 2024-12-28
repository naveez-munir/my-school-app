import { TenantConfigSection } from "~/components/tenant-config/TenantConfigSection";

export function meta() {
  return [
    { title: "Tenant Configuration" },
    { name: "description", content: "Configure tenant settings and policies" },
  ];
}

export default function TenantConfigList() {
  return <TenantConfigSection />;
}