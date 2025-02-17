import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile Settings" },
    { name: "description", content: "Manage your profile" },
  ];
}

export default function Profile() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {/* Add profile form/content here */}
    </div>
  );
}
