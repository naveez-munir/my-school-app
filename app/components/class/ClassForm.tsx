import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronsUpDown, X } from 'lucide-react';
import type { Teacher } from '~/types/teacher';
import type { Subject } from '~/types/subject';
import type { Class, CreateClassDto } from '~/types/class';

interface ClassFormProps {
  initialData?: Class;
  onSubmit: (data: CreateClassDto) => void;
  teachers: Teacher[];
  subjects: Subject[];
  isLoading: boolean;
}

export function ClassForm({
  initialData,
  onSubmit,
  teachers,
  subjects,
  isLoading
}: ClassFormProps) {
  const [formData, setFormData] = useState<CreateClassDto>({
    className: initialData?.className || '',
    classSection: initialData?.classSection || '',
    classGradeLevel: initialData?.classGradeLevel || '',
    classTeacher: initialData?.classTeacher?._id || '',
    classTempTeacher: initialData?.classTempTeacher?._id || '',
    classSubjects: initialData?.classSubjects?.map(subject => subject._id) || []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateClassDto, string>>>({});

  // Get selected subjects details for tags
  const selectedSubjectsDetails = subjects.filter(subject => 
    formData.classSubjects?.includes(subject._id)
  );

  // Get available subjects (not selected)
  const availableSubjects = subjects.filter(subject => 
    !formData.classSubjects?.includes(subject._id)
  );

  const handleChange = (field: keyof CreateClassDto, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    const updatedSubjects = formData.classSubjects?.filter(id => id !== subjectId) || [];
    handleChange('classSubjects', updatedSubjects);
  };

  const handleAddSubject = (subjectId: string) => {
    const updatedSubjects = [...(formData.classSubjects || []), subjectId];
    handleChange('classSubjects', updatedSubjects);
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateClassDto, string>> = {};
    if (!formData.className.trim()) {
      newErrors.className = 'Class name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Name*
            </label>
            <input
              type="text"
              value={formData.className}
              onChange={(e) => handleChange('className', e.target.value)}
              className={`mt-1 block w-full rounded-md border ${
                errors.className ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
              placeholder="Enter class name"
            />
            {errors.className && (
              <p className="mt-1 text-sm text-red-600">{errors.className}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <input
              type="text"
              value={formData.classSection}
              onChange={(e) => handleChange('classSection', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Enter section"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade Level
            </label>
            <input
              type="text"
              value={formData.classGradeLevel}
              onChange={(e) => handleChange('classGradeLevel', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Enter grade level"
            />
          </div>
        </div>

        {/* Right Column - Teachers */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Teacher
            </label>
            <Listbox
              value={formData.classTeacher}
              onChange={(value) => handleChange('classTeacher', value)}
            >
              <div className="relative">
                <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="block truncate">
                    {teachers.find(t => t._id === formData.classTeacher)?.firstName || 'Select Teacher'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {teachers.map((teacher) => (
                    <ListboxOption
                      key={teacher._id}
                      value={teacher._id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {teacher.firstName}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temporary Teacher
            </label>
            <Listbox
              value={formData.classTempTeacher}
              onChange={(value) => handleChange('classTempTeacher', value)}
            >
              <div className="relative">
                <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="block truncate">
                    {teachers.find(t => t._id === formData.classTempTeacher)?.firstName || 'Select Temporary Teacher'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {teachers.map((teacher) => (
                    <ListboxOption
                      key={teacher._id}
                      value={teacher._id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {teacher.firstName}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Subjects Section - Full Width */}
        <div className="md:col-span-2 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Subjects
          </label>
          
          {/* Selected Subjects Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedSubjectsDetails.map((subject) => (
              <div
                key={subject._id}
                className="inline-flex items-center bg-blue-50 text-blue-700 rounded-md px-2 py-1 text-sm"
              >
                <span>{subject.subjectName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(subject._id)}
                  className="ml-1 hover:text-blue-900 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Subject Selection Dropdown */}
          {availableSubjects.length > 0 && (
            <Listbox
              value=""
              onChange={handleAddSubject}
            >
              <div className="relative mt-1">
                <ListboxButton className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="block truncate text-gray-500">
                    Add more subjects...
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                  </span>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {availableSubjects.map((subject) => (
                    <ListboxOption
                      key={subject._id}
                      value={subject._id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {subject.subjectName}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          )}

          {/* Empty state when no subjects are available */}
          {availableSubjects.length === 0 && subjects.length > 0 && (
            <p className="text-sm text-gray-500">All subjects have been selected</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
}
