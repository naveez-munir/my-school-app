import React, { useState, useEffect } from 'react';
import type { 
  CreateExamDto, 
  UpdateExamDto, 
  SubjectSchedule 
} from '~/types/exam';
import api from '~/services/api';
import { useNavigate, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { clearCurrentExam, createExam, fetchExamById, updateExam } from '~/store/features/examSlice';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';

const fetchExamTypes = async () => {
  const response = await api.get('/exam-types');
  return response.data;
};

const fetchClasses = async () => {
  const response = await api.get('/classes');
  return response.data;
};

const fetchSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data;
};

const ExamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { currentExam, loading } = useAppSelector((state) => state.exams);
  
  // Data from API
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [formLoading, setFormLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<CreateExamDto | UpdateExamDto>({
    examType: '',
    classId: '',
    academicYear: '',
    startDate: new Date(),
    endDate: new Date(),
    description: '',
    subjects: [{
      subject: '',
      examDate: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      maxMarks: 100,
      passingMarks: 35
    }]
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load data from APIs
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setFormLoading(true);
        const [examTypesData, classesData, subjectsData] = await Promise.all([
          fetchExamTypes(),
          fetchClasses(),
          fetchSubjects()
        ]);
        
        setExamTypes(examTypesData);
        setClasses(classesData);
        setSubjects(subjectsData);
        
        if (isEditMode && id) {
          await dispatch(fetchExamById(id));
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setFormLoading(false);
      }
    };
    
    loadFormData();
    
    // Cleanup
    return () => {
      dispatch(clearCurrentExam());
    };
  }, [dispatch, id, isEditMode]);

  // Set form data when editing
  useEffect(() => {
    if (isEditMode && currentExam) {
      // Map exam response to form data structure
      setFormData({
        examType: currentExam.examType.id,
        classId: currentExam.class.id,
        academicYear: currentExam.academicYear,
        startDate: new Date(currentExam.startDate),
        endDate: new Date(currentExam.endDate),
        description: currentExam.description || '',
        subjects: currentExam.subjects.map(subject => ({
          subject: subject.subject.id,
          examDate: new Date(subject.examDate),
          startTime: subject.startTime,
          endTime: subject.endTime,
          maxMarks: subject.maxMarks,
          passingMarks: subject.passingMarks
        }))
      });
    }
  }, [currentExam, isEditMode]);

  // Handle form input changes
  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle subject form changes
  const handleSubjectChange = (index: number, field: keyof SubjectSchedule, value: any) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects as SubjectSchedule[]];
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: value
      };
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });
    
    // Clear error for this field
    const errorKey = `subjects[${index}].${field}`;
    if (formErrors[errorKey]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add a new subject
  const handleAddSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [
        ...(prev.subjects as SubjectSchedule[]),
        {
          subject: '',
          examDate: new Date(),
          startTime: '09:00',
          endTime: '11:00',
          maxMarks: 100,
          passingMarks: 35
        }
      ]
    }));
  };

  // Remove a subject
  const handleRemoveSubject = (index: number) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects as SubjectSchedule[]];
      updatedSubjects.splice(index, 1);
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });
  };

  // Validate the form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Check required fields
    if (!formData.examType) errors['examType'] = 'Exam type is required';
    if (!formData.classId) errors['classId'] = 'Class is required';
    if (!formData.academicYear) errors['academicYear'] = 'Academic year is required';
    
    // Validate dates
    const startDate = new Date(formData.startDate as Date);
    const endDate = new Date(formData.endDate as Date);
    
    if (startDate > endDate) {
      errors['endDate'] = 'End date must be after start date';
    }
    
    // Validate subjects
    const subjects = formData.subjects as SubjectSchedule[];
    
    if (!subjects.length) {
      errors['subjects'] = 'At least one subject is required';
    }
    
    subjects.forEach((subject, index) => {
      if (!subject.subject) {
        errors[`subjects[${index}].subject`] = 'Subject is required';
      }
      
      const examDate = new Date(subject.examDate as Date);
      if (examDate < startDate || examDate > endDate) {
        errors[`subjects[${index}].examDate`] = 'Exam date must be within the exam period';
      }
      
      if (!subject.startTime) {
        errors[`subjects[${index}].startTime`] = 'Start time is required';
      }
      
      if (!subject.endTime) {
        errors[`subjects[${index}].endTime`] = 'End time is required';
      }
      
      if (subject.maxMarks <= 0) {
        errors[`subjects[${index}].maxMarks`] = 'Max marks must be greater than 0';
      }
      
      if (subject.passingMarks <= 0) {
        errors[`subjects[${index}].passingMarks`] = 'Passing marks must be greater than 0';
      }
      
      if (subject.passingMarks > subject.maxMarks) {
        errors[`subjects[${index}].passingMarks`] = 'Passing marks cannot exceed max marks';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode && id) {
        await dispatch(updateExam({ id, data: formData as UpdateExamDto }));
      } else {
        await dispatch(createExam(formData as CreateExamDto));
      }
      
      navigate('/exams');
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleCancel = () => {
    navigate('/exams');
  };

  if (loading || formLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Exam' : 'Create New Exam'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
              <select
                value={formData.examType}
                onChange={(e) => handleInputChange('examType', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${formErrors.examType ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
              >
                <option value="">Select Exam Type</option>
                {examTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {formErrors.examType && (
                <p className="mt-1 text-sm text-red-500">{formErrors.examType}</p>
              )}
            </div>
            
            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => handleInputChange('classId', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${formErrors.classId ? 'border-red-300' : 'border-gray-300'} px-3 py-2`}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} {cls.classSection}
                  </option>
                ))}
              </select>
              {formErrors.classId && (
                <p className="mt-1 text-sm text-red-500">{formErrors.classId}</p>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Academic Year */}
            <div>
              <TextInput
                label="Academic Year *"
                value={formData.academicYear as string}
                onChange={(value) => handleInputChange('academicYear', value)}
                placeholder="e.g., 2024-2025"
                error={formErrors.academicYear}
              />
            </div>
            
            {/* Start Date */}
            <div>
              <DateInput
                label="Start Date *"
                value={formData.startDate as string}
                onChange={(value) => handleInputChange('startDate', value)}
                error={formErrors.startDate}
              />
            </div>
            
            {/* End Date */}
            <div>
              <DateInput
                label="End Date *"
                value={formData.endDate as string}
                onChange={(value) => handleInputChange('endDate', value)}
                error={formErrors.endDate}
              />
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Provide any additional details about the exam..."
            />
          </div>
        </div>
        
        {/* Subjects Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Subjects *</h2>
            <button
              type="button"
              onClick={handleAddSubject}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm"
            >
              + Add Subject
            </button>
          </div>
          
          {formErrors.subjects && (
            <p className="mb-4 text-sm text-red-500">{formErrors.subjects}</p>
          )}
          
          {(formData.subjects as SubjectSchedule[]).map((subject, index) => (
            <div key={index} className="mb-6 p-4 border rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Subject {index + 1}</h3>
                {(formData.subjects as SubjectSchedule[]).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    value={subject.subject}
                    onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors[`subjects[${index}].subject`] ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2`}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subj) => (
                      <option key={subj._id} value={subj._id}>
                        {subj.subjectName} ({subj.subjectCode})
                      </option>
                    ))}
                  </select>
                  {formErrors[`subjects[${index}].subject`] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].subject`]}</p>
                  )}
                </div>
                
                {/* Exam Date */}
                <div>
                  <DateInput
                    label="Exam Date *"
                    value={subject.examDate as string}
                    onChange={(value) => handleSubjectChange(index, 'examDate', value)}
                    error={formErrors[`subjects[${index}].examDate`]}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-4">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={subject.startTime}
                    onChange={(e) => handleSubjectChange(index, 'startTime', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors[`subjects[${index}].startTime`] ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2`}
                  />
                  {formErrors[`subjects[${index}].startTime`] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].startTime`]}</p>
                  )}
                </div>
                
                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    value={subject.endTime}
                    onChange={(e) => handleSubjectChange(index, 'endTime', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors[`subjects[${index}].endTime`] ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2`}
                  />
                  {formErrors[`subjects[${index}].endTime`] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].endTime`]}</p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Max Marks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks *</label>
                  <input
                    type="number"
                    value={subject.maxMarks}
                    onChange={(e) => handleSubjectChange(index, 'maxMarks', parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors[`subjects[${index}].maxMarks`] ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2`}
                  />
                  {formErrors[`subjects[${index}].maxMarks`] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].maxMarks`]}</p>
                  )}
                </div>
                
                {/* Passing Marks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks *</label>
                  <input
                    type="number"
                    value={subject.passingMarks}
                    onChange={(e) => handleSubjectChange(index, 'passingMarks', parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors[`subjects[${index}].passingMarks`] ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2`}
                  />
                  {formErrors[`subjects[${index}].passingMarks`] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[`subjects[${index}].passingMarks`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            {isEditMode ? 'Update Exam' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
