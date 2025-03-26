import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Account Settings" },
    { name: "description", content: "Manage your account settings" },
  ];
}

export default function Settings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700 ">Account Settings</h2>
      {/* Add settings form/content here */}
    </div>
  );
}
