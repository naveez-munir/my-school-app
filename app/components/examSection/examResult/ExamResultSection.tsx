import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { ExamResultsTable } from './ExamResultsTable';
import { ExamResultForm } from './ExamResultForm';
import { ExamResultDetail } from './ExamResultDetail';
import { ResultCardPrint } from './ResultCardPrint';
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
  DetailedExamResult
} from '~/types/examResult';

import { useExams, useMyTeachingExams } from '~/hooks/useExamQueries';
import { ClassSelector } from '~/components/common/ClassSelector';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { StudentSelector } from '~/components/common/StudentSelector';
import { ExamStatusSelector } from '~/components/common/ExamStatusSelector';
import { ExamSelector } from '~/components/common/ExamSelector';
import { ExamTypeSelector } from '~/components/common/ExamTypeSelector';
import { getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);
  
  // Get user role
  const userRole = getUserRole();
  const isTeacher = userRole?.role === UserRoleEnum.TEACHER;

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

  const isAdmin = userRole?.role === UserRoleEnum.TENANT_ADMIN;
  const shouldFetchTeachingExams = isTeacher && !isAdmin;

  const { data: allExams = [] } = useExams({}, { enabled: !shouldFetchTeachingExams });
  const { data: teachingExams = [] } = useMyTeachingExams({ enabled: shouldFetchTeachingExams });
  const exams = shouldFetchTeachingExams ? teachingExams : allExams;

  // Transform API results to summary format for table using useMemo
  const resultSummaries = useMemo(() => {
    if (viewMode === 'student') {
      return examResults.map(result => ({
        id: result.id,
        examName: result.exam.type || 'N/A',
        examType: result.exam.type || 'N/A',
        studentName: result.student.name || 'N/A',
        rollNumber: result.student.rollNumber || 'N/A',
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade || '-',
        rank: result.rank
      }));
    } else {
      return classResults.map(result => ({
        id: result.id,
        examName: result.exam.type || 'N/A',
        examType: result.exam.type || 'N/A',
        studentName: result.student.name || 'N/A',
        rollNumber: result.student.rollNumber || 'N/A',
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        grade: result.grade || '-',
        rank: result.rank
      }));
    }
  }, [examResults, classResults, viewMode]);
  
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

  // Print result card
  const handlePrintResult = (result: ExamResultSummary) => {
    setSelectedResultId(result.id);
    setTimeout(() => {
      window.print();
    }, 100);
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
    <>
      {resultDetail && <ResultCardPrint result={resultDetail} />}

    <div className="space-y-3 sm:space-y-4 lg:space-y-6 screen-only">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-4 lg:mb-6">
        <h2 className="text-responsive-base font-semibold text-gray-700">
          Exam Results Management
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            to="/dashboard/exams/results/bulk-entry"
            className="flex-1 sm:flex-none bg-green-600 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 text-center"
          >
            Bulk Entry
          </Link>
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="flex-1 sm:flex-none bg-blue-600 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Result
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Filter Toggle Button - Mobile Only */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full flex items-center justify-between p-3 text-left border-b border-gray-200"
        >
          <span className="text-xs font-medium text-gray-700">
            Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
          </span>
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Filters Container */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block p-3 sm:p-4`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <ExamSelector
              exams={exams}
              value={filters.examId || ''}
              onChange={(value) => handleFilterChange('examId', value)}
              label="Filter by Exam"
              placeholder="All Exams"
            />

            <ClassSelector
              value={filters.classId || ''}
              onChange={(value) => handleFilterChange('classId', value)}
              label="Class"
            />

            <AcademicYearSelector
              value={filters.academicYear || ''}
              onChange={(value) => handleFilterChange('academicYear', value)}
              label="Academic Year"
            />

            <StudentSelector
              classId={filters.classId || ''}
              value={filters.studentId || ''}
              onChange={(value) => handleFilterChange('studentId', value)}
              label="Student"
            />

            <ExamTypeSelector
              examTypes={Array.from(new Set(exams.map(e => e.examType)))}
              value={filters.examType || ''}
              onChange={(value) => handleFilterChange('examType', value)}
              label="Exam Type"
              placeholder="All Types"
            />

            <ExamStatusSelector
              value={filters.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              label="Exam Status"
              placeholder="All Status"
            />

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-700 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-gray-300 h-[34px] sm:h-[38px]"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900">
            {viewMode === 'student'
              ? (selectedStudentId
                ? `Results for Student`
                : 'All Student Results')
              : (selectedExamId
                ? `Class Results for ${exams.find(e => e.id === selectedExamId)?.examType.name || 'Exam'}`
                : 'All Exam Results')
            }
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('student')}
              className={`text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded ${
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
              className={`text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded ${
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
            onPrint={handlePrintResult}
            isClassView={viewMode === 'class'}
          />
        )}
      </div>

      <ExamResultForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateResult}
        exams={exams}
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
    </>
  );
}
