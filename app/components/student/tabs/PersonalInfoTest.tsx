import { useState } from 'react';
import type { StudentDataProps } from '~/types/student';
import {
  PersonalInfoOption1,
  PersonalInfoOption2,
  PersonalInfoOption3,
  PersonalInfoOption4
} from './PersonalInfoOptions';

export function PersonalInfoTest({ student }: StudentDataProps) {
  const [selectedOption, setSelectedOption] = useState<1 | 2 | 3 | 4>(1);

  const options = [
    {
      id: 1,
      name: 'Option 1: Card Grid (4 Columns)',
      description: 'Very spacious, colorful cards, great for scanning',
      component: PersonalInfoOption1
    },
    {
      id: 2,
      name: 'Option 2: Sidebar + Content',
      description: 'Key info on left, details on right, like StudentOverview',
      component: PersonalInfoOption2
    },
    {
      id: 3,
      name: 'Option 3: Horizontal List',
      description: 'Clean list items, best readability, mobile friendly',
      component: PersonalInfoOption3
    },
    {
      id: 4,
      name: 'Option 4: Two-Column Grid ⭐',
      description: 'Balanced layout, organized sections, RECOMMENDED',
      component: PersonalInfoOption4
    }
  ];

  const CurrentComponent = options.find(opt => opt.id === selectedOption)?.component || PersonalInfoOption4;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Option Selector */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-page-title mb-3 sm:mb-4">PersonalInfo Layout Options - Test View</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id as 1 | 2 | 3 | 4)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === option.id
                  ? 'border-blue-600 bg-blue-100'
                  : 'border-gray-300 bg-white hover:border-blue-400'
              }`}
            >
              <p className="text-heading">{option.name}</p>
              <p className="text-body-secondary mt-1">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-3 sm:mt-4 p-3 bg-white rounded border border-gray-200">
          <p className="text-body">
            <strong>Current:</strong> {options.find(opt => opt.id === selectedOption)?.name}
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
        <p className="text-heading text-gray-600 mb-3 sm:mb-4">PREVIEW:</p>
        <CurrentComponent student={student} />
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <p className="text-body text-gray-700">
          <strong>Instructions:</strong> Click on any option above to preview it. After reviewing all options, let me know which one you prefer and I'll update the StudentPersonalInfo component with that layout.
        </p>
      </div>
    </div>
  );
}

