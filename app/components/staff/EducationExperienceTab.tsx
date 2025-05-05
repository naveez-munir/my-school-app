import React from 'react';
import { Plus } from 'lucide-react';
import { type EducationHistory, type Experience } from '~/types/staff';
import { EducationItem } from './EducationItem';
import { ExperienceItem } from './ExperienceItem';

interface EducationExperienceTabProps {
  educationHistory: EducationHistory[];
  setEducationHistory: React.Dispatch<React.SetStateAction<EducationHistory[]>>;
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  isSubmitting: boolean;
  staffId?: string;
}

export function EducationExperienceTab({
  educationHistory,
  setEducationHistory,
  experience,
  setExperience,
  isSubmitting,
  staffId = ""
}: EducationExperienceTabProps) {
  const handleAddEducation = () => {
    setEducationHistory([...educationHistory, {
      degree: '',
      institution: '',
      year: new Date().getFullYear(),
      certificateUrl: ''
    }]);
  };

  const handleAddExperience = () => {
    setExperience([...experience, {
      institution: '',
      position: '',
      fromDate: new Date(),
      toDate: undefined,
      description: '',
      experienceLatterUrl: ''
    }]);
  };

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium">Education History</h4>
          <button
            type="button"
            onClick={handleAddEducation}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Education
          </button>
        </div>
        
        {educationHistory.length === 0 ? (
          <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
            No education history added.
          </div>
        ) : (
          educationHistory.map((education, index) => (
            <EducationItem
              key={index}
              index={index}
              education={education}
              educationHistory={educationHistory}
              setEducationHistory={setEducationHistory}
              isSubmitting={isSubmitting}
              staffId={staffId}
            />
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium">Work Experience</h4>
          <button
            type="button"
            onClick={handleAddExperience}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Experience
          </button>
        </div>
        
        {experience.length === 0 ? (
          <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
            No work experience added.
          </div>
        ) : (
          experience.map((exp, index) => (
            <ExperienceItem
              key={index}
              index={index}
              experience={exp}
              allExperience={experience}
              setExperience={setExperience}
              isSubmitting={isSubmitting}
              staffId={staffId}
            />
          ))
        )}
      </div>
    </div>
  );
}
