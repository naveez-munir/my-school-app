interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'employment', label: 'Employment Details' },
    { id: 'education', label: 'Education & Experience' },
    { id: 'documents', label: 'Documents' },
    { id: 'emergency', label: 'Emergency Contact' }
  ];

  return (
    <div className="flex border-b mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`px-4 py-2 font-medium ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
