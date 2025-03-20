import { useState, useEffect, useCallback } from 'react';
import { ExamResultsTable } from './ExamResultsTable';
import { ExamResultForm } from './ExamResultForm';
import { ExamResultDetail } from './ExamResultDetail';
import { 
  useExamResults, 
  useExamResult,
  useCreateExamResult,
  useDeleteExamResult, 
  useGenerateClassRanks,
  useClassResults 
} from '~/hooks/useExamResultQueries';
import type {
  CreateExamResultRequest,
  ExamResultQueryParams,
  ExamResultSummary,
  DetailedExamResult,
  ExamOption,
  StudentOption
} from '~/types/examResult';

// This should come from an API or another hook
import { useExams } from '~/hooks/useExamQueries';
import { useStudents } from '~/hooks/useStudentQueries';
import { ClassSelector } from '~/components/common/ClassSelector';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { StudentSelector } from '~/components/common/StudentSelector';

export function ExamResultSection() {
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // State for selected examination and class views
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'student' | 'class'>('student');
  const [selectedResultId, setSelectedResultId] = useState<string>('');
  
  // State for filters
  const [filters, setFilters] = useState<ExamResultQueryParams>({});
  
  // React Query hooks
  const { 
    data: examResults = [], 
    isLoading: isLoadingResults 
  } = useExamResults(filters);
  
  const {
    data: classResults = [],
    isLoading: isLoadingClassResults,
    refetch: refetchClassResults
  } = useClassResults(selectedExamId);
  
  const {
    data: resultDetail
  } = useExamResult(selectedResultId);
  
  const createExamResultMutation = useCreateExamResult();
  const deleteExamResultMutation = useDeleteExamResult();
  const generateRanksMutation = useGenerateClassRanks();
  
  // Fetch exams and students from hooks
  const { data: exams = [] } = useExams();
  const { data: students = [] } = useStudents();
  
  // Transform API results to summary format for table
  const transformResults = useCallback(() => {
    if (viewMode === 'student') {
      return examResults.map(result => ({
        id: result.id,
        examName: result.exam.type,
        examType: result.exam.type,
        studentName: result.student.name,
        rollNumber: result.student.rollNumber,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade || '-',
        rank: result.rank
      }));
    } else {
      return classResults.map(result => ({
        id: result.id,
        examName: result.exam.type,
        examType: result.exam.type,
        studentName: result.student.name,
        rollNumber: result.student.rollNumber,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade || '-',
        rank: result.rank
      }));
    }
  }, [examResults, classResults, viewMode]);
  
  const [resultSummaries, setResultSummaries] = useState<ExamResultSummary[]>([]);
  
  // Update summaries when data changes - with proper dependencies
  useEffect(() => {
    setResultSummaries(transformResults());
  }, []);
  
  // Create exam result
  const handleCreateResult = async (data: CreateExamResultRequest) => {
    try {
      await createExamResultMutation.mutateAsync(data);
      setIsFormModalOpen(false);
      
      // Refresh appropriate view
      if (viewMode === 'class' && selectedExamId) {
        refetchClassResults();
      }
    } catch (err) {
      console.error("Error creating exam result:", err);
    }
  };
  
  // Delete result
  const handleDeleteResult = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam result?')) {
      try {
        await deleteExamResultMutation.mutateAsync(id);
        
        // Refresh class results if in class view
        if (viewMode === 'class' && selectedExamId) {
          refetchClassResults();
        }
      } catch (err) {
        console.error("Error deleting exam result:", err);
      }
    }
  };
  
  // Generate ranks for a class
  const handleGenerateRanks = async (examId: string) => {
    try {
      await generateRanksMutation.mutateAsync(examId);
      refetchClassResults();
    } catch (err) {
      console.error("Error generating ranks:", err);
    }
  };
  
  // View result details
  const handleViewResult = (result: ExamResultSummary) => {
    setSelectedResultId(result.id);
    setIsDetailModalOpen(true);
  };
  
  // Handle filter changes
  const handleFilterChange = (field: keyof ExamResultQueryParams, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!value) {
        delete newFilters[field];
      } else {
        newFilters[field] = value;
      }
      return newFilters;
    });
    
    // Update selected IDs for class/student views
    if (field === 'examId') {
      setSelectedExamId(value || '');
      if (value) {
        setViewMode('class');
      } else if (selectedStudentId) {
        setViewMode('student');
      }
    } else if (field === 'studentId') {
      setSelectedStudentId(value || '');
      if (value) {
        setViewMode('student');
      } else if (selectedExamId) {
        setViewMode('class');
      }
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setSelectedExamId('');
    setSelectedStudentId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Exam Results Management
        </h2>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Result
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Exam
            </label>
            <select
              value={filters.examId || ''}
              onChange={(e) => handleFilterChange('examId', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.class.className} ({exam.examType.name} - {exam.academicYear})
                </option>
              ))}
            </select>
          </div>
          <ClassSelector 
           value={filters.classId || ''}
           onChange={(value) => handleFilterChange('classId', value)}
          />
          <AcademicYearSelector 
           value={filters.academicYear || ''}
           onChange={(value) => handleFilterChange('academicYear', value)}
           label='Academic Year'
          />
          
          <StudentSelector 
           classId={filters.classId || ''}
           value={filters.studentId || ''}
           onChange={(value) => handleFilterChange('studentId', value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type
            </label>
            <select
              value={filters.examType || ''}
              onChange={(e) => handleFilterChange('examType', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All Types</option>
              {/* Get unique exam types from exams */}
              {Array.from(new Set(exams.map(e => e.examType))).map(type => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {viewMode === 'student' 
              ? (selectedStudentId 
                ? `Results for ${students.find(s => s.id === selectedStudentId)?.name || 'Student'}` 
                : 'All Student Results')
              : (selectedExamId 
                ? `Class Results for ${exams.find(e => e.id === selectedExamId)?.examType.name || 'Exam'}` 
                : 'All Exam Results')
            }
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1 rounded ${
                viewMode === 'student' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Student
            </button>
            <button
              onClick={() => {
                setViewMode('class');
                if (selectedExamId) {
                  refetchClassResults();
                }
              }}
              className={`px-3 py-1 rounded ${
                viewMode === 'class' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Class
            </button>
          </div>
        </div>

        {(isLoadingResults || isLoadingClassResults) ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading results...</p>
          </div>
        ) : (
          <ExamResultsTable
            data={resultSummaries}
            onView={handleViewResult}
            onDelete={handleDeleteResult}
            onGenerateRanks={viewMode === 'class' ? handleGenerateRanks : undefined}
            isClassView={viewMode === 'class'}
          />
        )}
      </div>

      <ExamResultForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateResult}
        exams={exams}
        students={students as StudentOption[]}
        isSubmitting={createExamResultMutation.isPending}
      />

      <ExamResultDetail
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedResultId('');
        }}
        result={resultDetail as DetailedExamResult || null}
      />
    </div>
  );
}
