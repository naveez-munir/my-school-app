import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { CreateExamDto, UpdateExamDto, SubjectSchedule } from '~/types/exam';
import { useExam, useCreateExam, useUpdateExam } from '~/hooks/useExamQueries';
import { checkTimeConflicts } from '~/utils/examValidation';
import ExamFormHeader from './components/ExamFormHeader';
import ExamDetails from './components/ExamDetails';
import TimeConflictsWarning from './components/TimeConflictsWarning';
import SubjectsList from './components/SubjectsList';
import FormActions from './components/FormActions';

const ExamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  // React Query hooks
  const { 
    data: currentExam, 
    isLoading: examLoading 
  } = useExam(id || '');
  
  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();

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
  const [timeConflicts, setTimeConflicts] = useState<{
    hasConflicts: boolean;
    conflicts: any[];
  }>({ hasConflicts: false, conflicts: [] });

  // Set form data when editing
  useEffect(() => {
    if (isEditMode && currentExam) {
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

  // Handle form input changes for main exam details
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

  // Update subject schedules
  const handleSubjectsChange = (updatedSubjects: SubjectSchedule[]) => {
    setFormData(prev => ({
      ...prev,
      subjects: updatedSubjects
    }));
    
    // Check for time conflicts
    const conflicts = checkTimeConflicts(updatedSubjects);
    setTimeConflicts(conflicts);
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
    
    // Check for time conflicts
    if (timeConflicts.hasConflicts) {
      errors['timeConflicts'] = 'There are time conflicts between subjects';
    }
    
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
        await updateExamMutation.mutateAsync({ 
          id, 
          data: formData as UpdateExamDto 
        });
      } else {
        await createExamMutation.mutateAsync(formData as CreateExamDto);
      }

      navigate('/dashboard/exams');
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/exams');
  };

  // Determine if the component is in a loading state
  const isLoading = (isEditMode && examLoading) || 
                   createExamMutation.isPending || 
                   updateExamMutation.isPending;

  if (isEditMode && examLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <ExamFormHeader isEditMode={isEditMode} />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <ExamDetails 
          formData={formData}
          formErrors={formErrors}
          onInputChange={handleInputChange}
        />
        
        {timeConflicts.hasConflicts && (
          <TimeConflictsWarning conflicts={timeConflicts.conflicts} />
        )}
        
        <SubjectsList
          subjects={formData.subjects as SubjectSchedule[]}
          formErrors={formErrors}
          examPeriod={{
            startDate: formData.startDate as Date,
            endDate: formData.endDate as Date
          }}
          onChange={handleSubjectsChange}
        />
        
        <FormActions
          isEditMode={isEditMode}
          isSubmitting={createExamMutation.isPending || updateExamMutation.isPending}
          isValid={!timeConflicts.hasConflicts}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
};

export default ExamForm;
