import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Overview" },
    { name: "description", content: "Dashboard overview page" },
  ];
}

export default function DashboardIndex() {
  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add dashboard widgets/cards here */}
      </div>
    </div>
  );
}
