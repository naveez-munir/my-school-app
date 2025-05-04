import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCreateStudentLeave } from '~/hooks/useStudentLeaveQueries';
import { LeaveType } from '~/types/studentLeave';
import toast from 'react-hot-toast';
import { useClasses } from '~/hooks/useClassQueries';
import { ClassSelector } from '~/components/common/ClassSelector';
import { StudentSelector } from '~/components/common/StudentSelector';

export function CreateStudentLeaveForm() {
  const navigate = useNavigate();
  const { mutate: createLeave, isPending } = useCreateStudentLeave();
  const { data: classes = [] } = useClasses();
  
  const [formData, setFormData] = useState({
    studentId: '',
    leaveType: LeaveType.MEDICAL,
    startDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    supportingDocumentUrl: '',
    affectedClasses: [] as string[],
  });

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Update affected classes when selected classes change
    const selectedClassIds = Object.keys(selectedClasses).filter(cls => selectedClasses[cls]);
    setFormData(prev => ({ ...prev, affectedClasses: selectedClassIds }));
  }, [selectedClasses]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId) {
      toast.error('Please select a student');
      return;
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      toast.error('End date cannot be earlier than start date');
      return;
    }
    
    createLeave(formData, {
      onSuccess: () => {
        toast.success('Leave request created successfully');
        navigate('/student-leaves');
      },
      onError: (error) => {
        toast.error(`Failed to create leave request: ${error.message}`);
      },
    });
  };
  
  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };
  
  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create Leave Request</h1>
        <button 
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Leave Request Details</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ClassSelector
              value={selectedClass}
              onChange={setSelectedClass}
              label="Class"
              required
            />
            
            <StudentSelector
              value={formData.studentId}
              onChange={(studentId) => setFormData({ ...formData, studentId })}
              classId={selectedClass}
              label="Student"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select 
              id="leaveType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.leaveType} 
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
            >
              <option value={LeaveType.MEDICAL}>Medical</option>
              <option value={LeaveType.FAMILY_EMERGENCY}>Family Emergency</option>
              <option value={LeaveType.PLANNED_ABSENCE}>Planned Absence</option>
              <option value={LeaveType.OTHER}>Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="endDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Leave</label>
            <textarea
              id="reason"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Please provide details about the reason for leave"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="supportingDocumentUrl" className="block text-sm font-medium text-gray-700">
              Supporting Document URL (Optional)
            </label>
            <input
              type="text"
              id="supportingDocumentUrl"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter document URL"
              value={formData.supportingDocumentUrl}
              onChange={(e) => setFormData({ ...formData, supportingDocumentUrl: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Affected Classes</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {classes.map(cls => (
                <div key={cls.id} className="flex items-center">
                  <input
                    id={`class-${cls.id}`}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!selectedClasses[cls.id]}
                    onChange={() => handleClassToggle(cls.id)}
                  />
                  <label htmlFor={`class-${cls.id}`} className="ml-2 text-sm text-gray-700">
                    {cls.className}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
