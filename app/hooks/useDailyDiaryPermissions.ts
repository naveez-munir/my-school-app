import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { classApi } from '~/services/classApi';
import { getUserId, getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import { useTeacherProfile } from '~/hooks/useTeacherQueries';
import type { DailyDiaryResponse, SubjectTaskResponse } from '~/types/dailyDiary';

export const useDailyDiaryPermissions = (diary: DailyDiaryResponse | null | undefined) => {
  const currentUserId = getUserId();
  const userRole = getUserRole();
  const isTeacherRole = userRole?.role === UserRoleEnum.TEACHER;

  const { data: classData } = useQuery({
    queryKey: ['classes', diary?.classId.id],
    queryFn: () => classApi.getById(diary!.classId.id),
    enabled: !!diary?.classId.id
  });

  const { data: currentTeacher } = useTeacherProfile(isTeacherRole);

  const permissions = useMemo(() => {
    if (!diary || !currentUserId || !classData) {
      return {
        canCreateDiary: false,
        canEditDiary: false,
        canDeleteDiary: false,
        canAddSubjectTask: false,
        canEditTask: (task: SubjectTaskResponse) => false,
        canDeleteTask: (task: SubjectTaskResponse) => false,
        isClassTeacher: false
      };
    }

    if (!currentTeacher) {
      return {
        canCreateDiary: false,
        canEditDiary: false,
        canDeleteDiary: false,
        canAddSubjectTask: false,
        canEditTask: (task: SubjectTaskResponse) => false,
        canDeleteTask: (task: SubjectTaskResponse) => false,
        isClassTeacher: false
      };
    }

    const isClassTeacher =
      classData.classTeacher?._id === currentTeacher._id ||
      classData.classTempTeacher?._id === currentTeacher._id;

    return {
      canCreateDiary: isClassTeacher,
      canEditDiary: isClassTeacher,
      canDeleteDiary: isClassTeacher,
      canAddSubjectTask: true,
      canEditTask: (task: SubjectTaskResponse) => {
        return isClassTeacher || task.addedBy === currentUserId;
      },
      canDeleteTask: (task: SubjectTaskResponse) => {
        return isClassTeacher || task.addedBy === currentUserId;
      },
      isClassTeacher
    };
  }, [diary, currentUserId, classData, currentTeacher]);

  return permissions;
};
