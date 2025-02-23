import { useState } from 'react'
import { TeacherSelect } from './TeacherSelect'
import { TeacherAssignmentCard } from './TeacherAssignmentCard'
import type { TeacherResponse } from '~/types/teacher'
import type { Class } from '~/types/class'
import { useAppDispatch } from '~/store/hooks'
import {
  assignTeacher,
  removeTeacher,
  assignTempTeacher,
  removeTempTeacher
} from '~/store/features/classSlice'

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
  const dispatch = useAppDispatch()
  const [mainTeacherLoading, setMainTeacherLoading] = useState(false)
  const [tempTeacherLoading, setTempTeacherLoading] = useState(false)

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
        const action = teacherType === 'main' ? assignTeacher : assignTempTeacher
        await dispatch(action({ classId: classData._id, teacherId })).unwrap()
      } else {
        const action = teacherType === 'main' ? removeTeacher : removeTempTeacher
        await dispatch(action(classData._id)).unwrap()
      }
    } catch (error) {
      console.error(`Failed to ${actionType} ${teacherType} teacher:`, error)
    } finally {
      setLoading(false)
    }
  }
  //TODO need to handle the filter logic and make it functional
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
            isLoading={mainTeacherLoading || isLoading}
            variant="main"
          />
        ) : (
          <TeacherSelect
            value=""
            onChange={(teacherId) => handleTeacherAction('assign', 'main', teacherId)}
            teachers={teachers}
            isLoading={mainTeacherLoading || isLoading}
            placeholder="Select main teacher"
          />
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
            isLoading={tempTeacherLoading || isLoading}
            variant="temporary"
          />
        ) : (
          <TeacherSelect
            value=""
            onChange={(teacherId) => handleTeacherAction('assign', 'temp', teacherId)}
            teachers={teachers}
            isLoading={tempTeacherLoading || isLoading}
            placeholder="Select temporary teacher"
          />
        )}
      </div>
    </div>
  )
}
