import { useState } from 'react'
import { TeacherAssignmentCard } from './TeacherAssignmentCard'
import type { TeacherResponse, Teacher } from '~/types/teacher'
import type { Class } from '~/types/class'
import { 
  useAssignTeacher, 
  useRemoveTeacher, 
  useAssignTempTeacher, 
  useRemoveTempTeacher 
} from '~/hooks/useClassQueries'
import { TeacherSelector } from '../common/TeacherSelector'

interface TeacherAssignmentSectionProps {
  classData: Class
  teachers: TeacherResponse[]
  isLoading?: boolean
}

export function TeacherAssignmentSection({
  classData,
  teachers,
  isLoading = false
}: TeacherAssignmentSectionProps) {
  const [mainTeacherLoading, setMainTeacherLoading] = useState(false)
  const [tempTeacherLoading, setTempTeacherLoading] = useState(false)
  const [selectedMainTeacherId, setSelectedMainTeacherId] = useState('')
  const [selectedTempTeacherId, setSelectedTempTeacherId] = useState('')

  // React Query mutations
  const assignTeacherMutation = useAssignTeacher();
  const removeTeacherMutation = useRemoveTeacher();
  const assignTempTeacherMutation = useAssignTempTeacher();
  const removeTempTeacherMutation = useRemoveTempTeacher();

  const handleTeacherAction = async (
    actionType: 'assign' | 'remove',
    teacherType: 'main' | 'temp',
    teacherId?: string
  ) => {
    if (!classData._id) return
    
    const setLoading = teacherType === 'main' 
      ? setMainTeacherLoading 
      : setTempTeacherLoading

    try {
      setLoading(true)
      
      if (actionType === 'assign') {
        if (!teacherId) return
        if (teacherType === 'main') {
          await assignTeacherMutation.mutateAsync({ classId: classData._id, teacherId });
          setSelectedMainTeacherId('');
        } else {
          await assignTempTeacherMutation.mutateAsync({ classId: classData._id, teacherId });
          setSelectedTempTeacherId('');
        }
      } else {
        if (teacherType === 'main') {
          await removeTeacherMutation.mutateAsync(classData._id);
        } else {
          await removeTempTeacherMutation.mutateAsync(classData._id);
        }
      }
    } catch (error) {
      console.error(`Failed to ${actionType} ${teacherType} teacher:`, error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableTeachers = (currentTeacher?: TeacherResponse) => {
    return teachers.filter(teacher => 
      teacher.id !== currentTeacher?.id &&
      teacher.id !== classData.classTempTeacher?._id &&
      teacher.id !== classData.classTeacher?._id
    )
  }

  if (!classData || !teachers) {
    return <div className="p-4 text-gray-500">Loading class information...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Teacher Assignments</h2>
      
      {/* Main Teacher Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Main Teacher
        </label>
        
        {classData.classTeacher ? (
          <TeacherAssignmentCard
            teacher={classData.classTeacher}
            onRemove={() => handleTeacherAction('remove', 'main')}
            isLoading={mainTeacherLoading || isLoading || removeTeacherMutation.isPending}
            variant="main"
          />
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <TeacherSelector
                value={selectedMainTeacherId}
                onChange={setSelectedMainTeacherId}
                placeholder="Select main teacher"
                className="w-full"
              />
            </div>
            {selectedMainTeacherId && (
              <button
                onClick={() => handleTeacherAction('assign', 'main', selectedMainTeacherId)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={mainTeacherLoading || isLoading}
              >
                {mainTeacherLoading ? 'Assigning...' : 'Assign'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Temporary Teacher Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Temporary Teacher
        </label>
        
        {classData.classTempTeacher ? (
          <TeacherAssignmentCard
            teacher={classData.classTempTeacher}
            onRemove={() => handleTeacherAction('remove', 'temp')}
            isLoading={tempTeacherLoading || isLoading || removeTempTeacherMutation.isPending}
            variant="temporary"
          />
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <TeacherSelector
                value={selectedTempTeacherId}
                onChange={setSelectedTempTeacherId}
                placeholder="Select temporary teacher"
                className="w-full"
              />
            </div>
            {selectedTempTeacherId && (
              <button
                onClick={() => handleTeacherAction('assign', 'temp', selectedTempTeacherId)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={tempTeacherLoading || isLoading}
              >
                {tempTeacherLoading ? 'Assigning...' : 'Assign'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
