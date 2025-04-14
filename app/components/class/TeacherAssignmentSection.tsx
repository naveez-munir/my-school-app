import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { TeacherAssignmentCard } from './TeacherAssignmentCard'
import type { TeacherResponse, Teacher } from '~/types/teacher'
import type { Class } from '~/types/class'
import { 
  useAssignTeacher, 
  useRemoveTeacher, 
  useAssignTempTeacher, 
  useRemoveTempTeacher 
} from '~/hooks/useClassQueries'
import { TeacherSelector } from '../common/TeacherSelector';
import { useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '~/utils/error'

interface TeacherAssignmentSectionProps {
  classData: Class
  teachers: TeacherResponse[]
  isLoading?: boolean
  onRefresh?: () => void
}

export function TeacherAssignmentSection({
  classData,
  teachers,
  isLoading = false,
  onRefresh
}: TeacherAssignmentSectionProps) {
  const queryClient = useQueryClient();
  const [mainTeacherLoading, setMainTeacherLoading] = useState(false)
  const [tempTeacherLoading, setTempTeacherLoading] = useState(false)
  const [selectedMainTeacherId, setSelectedMainTeacherId] = useState('')
  const [selectedTempTeacherId, setSelectedTempTeacherId] = useState('')

  const assignTeacherMutation = useAssignTeacher();
  const removeTeacherMutation = useRemoveTeacher();
  const assignTempTeacherMutation = useAssignTempTeacher();
  const removeTempTeacherMutation = useRemoveTempTeacher();


  const handleTeacherAction = async (
    actionType: 'assign' | 'remove',
    teacherType: 'main' | 'temp',
    teacherId?: string
  ) => {
    if (!classData._id) return;
    
    const setLoading = teacherType === 'main' ? setMainTeacherLoading : setTempTeacherLoading;
    const actionText = actionType === 'assign' ? 'assigned to' : 'removed from';
    const teacherTypeText = teacherType === 'main' ? 'Main' : 'Temporary';
    const resetSelectedId = teacherType === 'main' ? setSelectedMainTeacherId : setSelectedTempTeacherId;
    
    try {
      setLoading(true);

      const mutations = {
        main: {
          assign: () => assignTeacherMutation.mutateAsync({ classId: classData._id, teacherId: teacherId! }),
          remove: () => removeTeacherMutation.mutateAsync(classData._id)
        },
        temp: {
          assign: () => assignTempTeacherMutation.mutateAsync({ classId: classData._id, teacherId: teacherId! }),
          remove: () => removeTempTeacherMutation.mutateAsync(classData._id)
        }
      };
      
      if (actionType === 'assign' && !teacherId) return;

      const result = await mutations[teacherType][actionType]();
      console.log('Mutation result:', result);

      if (actionType === 'assign') {
        resetSelectedId('');
      }

      toast.success(`${teacherTypeText} teacher ${actionText} ${classData.className}`);
      queryClient.invalidateQueries({queryKey: ['teachers']});
      if (onRefresh) {
        onRefresh();
      }

    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!classData) {
    return <div className="p-4 text-gray-500">Loading class information...</div>
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Teacher Assignments</h2>
      
      {/* Main Teacher Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Main Class Teacher
          </label>
          {classData.classTeacher && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Primary Instructor
            </span>
          )}
        </div>
        
        {classData.classTeacher ? (
          <TeacherAssignmentCard
            teacher={classData.classTeacher}
            onRemove={() => handleTeacherAction('remove', 'main')}
            isLoading={mainTeacherLoading || isLoading || removeTeacherMutation.isPending}
            variant="main"
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <TeacherSelector
                  value={selectedMainTeacherId}
                  onChange={setSelectedMainTeacherId}
                  placeholder="Select a main teacher for this class"
                  className="w-full"
                />
              </div>
              <div>
                <button
                  onClick={() => handleTeacherAction('assign', 'main', selectedMainTeacherId)}
                  className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    selectedMainTeacherId 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedMainTeacherId || mainTeacherLoading || isLoading}
                >
                  {mainTeacherLoading ? 'Assigning...' : 'Assign as Main Teacher'}
                </button>
              </div>
            </div>
            {!selectedMainTeacherId && (
              <p className="mt-3 text-sm text-gray-500">
                Select a teacher to assign as the main teacher for this class.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Temporary Teacher Section */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Temporary Teacher
          </label>
          {classData.classTempTeacher && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
              Substitute Instructor
            </span>
          )}
        </div>
        
        {classData.classTempTeacher ? (
          <TeacherAssignmentCard
            teacher={classData.classTempTeacher}
            onRemove={() => handleTeacherAction('remove', 'temp')}
            isLoading={tempTeacherLoading || isLoading || removeTempTeacherMutation.isPending}
            variant="temporary"
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <TeacherSelector
                  value={selectedTempTeacherId}
                  onChange={setSelectedTempTeacherId}
                  placeholder="Select a temporary substitute teacher"
                  className="w-full"
                />
              </div>
              <div>
                <button
                  onClick={() => handleTeacherAction('assign', 'temp', selectedTempTeacherId)}
                  className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    selectedTempTeacherId 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedTempTeacherId || tempTeacherLoading || isLoading}
                >
                  {tempTeacherLoading ? 'Assigning...' : 'Assign as Temporary Teacher'}
                </button>
              </div>
            </div>
            {!selectedTempTeacherId && (
              <p className="mt-3 text-sm text-gray-500">
                Assign a temporary teacher who will substitute when the main teacher is unavailable.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
