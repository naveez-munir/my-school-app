import type { Route } from "./+types";
import { UserSection } from "~/components/user/UserSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Management" },
    { name: "description", content: "Manage user accounts and permissions" },
  ];
}

export default function Management() {
  return <UserSection />;
}
