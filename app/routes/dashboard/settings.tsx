import { useState } from "react";
import type { Route } from "./+types";
import AcademicYearDashboard from "~/components/settings/AcademicYearDashboard";
import { LeavePolicySettings } from "~/components/settings/LeavePolicySettings";
import { GradeLevelSettings } from "~/components/settings/GradeLevelSettings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Organization Settings" },
    { name: "description", content: "Manage your organization settings" },
  ];
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('academic');

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Organization Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure your organization policies and preferences</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('academic')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'academic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📚 Academic Year
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'grades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🎓 Grade Levels
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'leave'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🏖️ Leave Policy
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'academic' && <AcademicYearDashboard />}
        {activeTab === 'grades' && <GradeLevelSettings />}
        {activeTab === 'leave' && <LeavePolicySettings />}
      </div>
    </div>
  );
}
