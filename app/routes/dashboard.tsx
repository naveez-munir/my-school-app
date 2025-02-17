//this is will be treated as layout for dashboard related pages

import { Outlet } from "react-router";
import type { Route } from "./dashboard/+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "User dashboard" },
  ];
}

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
