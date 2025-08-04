// ============================================
// PERIOD TYPES
// ============================================

export type PeriodType = 'TEACHING' | 'BREAK' | 'LUNCH' | 'ASSEMBLY';

export interface Period {
  id: string;
  periodNumber: number;
  periodName: string;
  startTime: string;
  endTime: string;
  periodType: PeriodType;
  isActive: boolean;
  durationMinutes: number;
  notes?: string;
}

export interface CreatePeriodDto {
  periodNumber: number;
  periodName: string;
  startTime: string;
  endTime: string;
  periodType?: PeriodType;
  isActive?: boolean;
  durationMinutes?: number;
  notes?: string;
}

export interface UpdatePeriodDto {
  periodName?: string;
  startTime?: string;
  endTime?: string;
  periodType?: PeriodType;
  isActive?: boolean;
  durationMinutes?: number;
  notes?: string;
}

// ============================================
// CLASS SUBJECT ALLOCATION TYPES
// ============================================

export type AllocationStatus = 'ACTIVE' | 'INACTIVE';

export interface ClassSubjectAllocation {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  academicYear: string;
  periodsPerWeek: number;
  isLabSubject: boolean;
  consecutivePeriods: number;
  status: AllocationStatus;
}

export interface CreateAllocationDto {
  classId: string;
  subjectId: string;
  teacherId: string;
  academicYear: string;
  periodsPerWeek: number;
  isLabSubject?: boolean;
  consecutivePeriods?: number;
  status?: AllocationStatus;
}

export interface UpdateAllocationDto {
  teacherId?: string;
  periodsPerWeek?: number;
  isLabSubject?: boolean;
  consecutivePeriods?: number;
  status?: AllocationStatus;
}

// ============================================
// TIMETABLE TYPES
// ============================================

export type TimetableStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';
export type GenerationType = 'MANUAL' | 'AUTO_GENERATED';

export interface TimetableSlot {
  dayOfWeek: number;
  dayName?: string;
  periodNumber: number;
  periodId: string;
  periodName?: string;
  startTime?: string;
  endTime?: string;
  subjectId: string;
  subjectName?: string;
  teacherId: string;
  teacherName?: string;
  room?: string;
  isClassTeacherSlot?: boolean;
  isBreak?: boolean;
  notes?: string;
}

export interface AutoGenerationMetadata {
  algorithm: string;
  timestamp: string;
  executionTimeMs: number;
  conflictsResolved: number;
  constraints: any[];
  _id?: string;
}

export interface Timetable {
  id: string;
  classId: string;
  className?: string;
  academicYear: string;
  displayName: string;
  schedule: TimetableSlot[];
  status: TimetableStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  generationType: GenerationType;
  autoGenerationMetadata?: AutoGenerationMetadata;
  conflicts?: TimetableConflict[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimetableDto {
  classId: string;
  academicYear: string;
  displayName: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status?: TimetableStatus;
  generationType?: GenerationType;
  schedule?: TimetableSlot[];
}

export interface UpdateTimetableDto {
  displayName?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  status?: TimetableStatus;
  schedule?: TimetableSlot[];
}

export interface AddSlotDto {
  slot: TimetableSlot;
}

export interface UpdateSlotDto {
  slotIndex: number;
  slot: TimetableSlot;
}

export interface RemoveSlotDto {
  slotIndex: number;
}

export interface UpdateTimetableStatusDto {
  status: TimetableStatus;
}

export interface ApproveTimetableDto {
  notes?: string;
}

export interface AutoGenerateTimetableDto {
  classId: string;
  academicYear: string;
  saveAsDraft?: boolean;
}

// ============================================
// TIMETABLE CONFLICT TYPES
// ============================================

export type ConflictType = 'TEACHER_CONFLICT' | 'ROOM_CONFLICT' | 'CLASS_CONFLICT';
export type ConflictSeverity = 'ERROR' | 'WARNING';

export interface TimetableConflict {
  type: ConflictType;
  severity: ConflictSeverity;
  description: string;
  dayOfWeek: number;
  periodNumber: number;
  affectedSlots: number[];
}

export interface ConflictsResponse {
  conflicts: TimetableConflict[];
}

// ============================================
// TIMETABLE EXCEPTION TYPES
// ============================================

export type ExceptionType = 'SUBSTITUTION' | 'CANCELLATION' | 'RESCHEDULE';

export interface TimetableException {
  id: string;
  timetableId: string;
  classId: string;
  className?: string;
  exceptionDate: string;
  dayOfWeek: number;
  periodNumber: number;
  originalTeacherId: string;
  originalTeacherName?: string;
  originalSubjectId: string;
  originalSubjectName?: string;
  replacementTeacherId?: string;
  replacementTeacherName?: string;
  replacementSubjectId?: string;
  replacementSubjectName?: string;
  replacementRoom?: string;
  exceptionType: ExceptionType;
  reason: string;
  isApproved: boolean;
  notes?: string;
  createdAt: string;
}

export interface CreateExceptionDto {
  timetableId: string;
  classId: string;
  exceptionDate: string;
  dayOfWeek: number;
  periodNumber: number;
  originalTeacherId: string;
  originalSubjectId: string;
  replacementTeacherId?: string;
  replacementSubjectId?: string;
  replacementRoom?: string;
  exceptionType: ExceptionType;
  reason: string;
  notes?: string;
}

export interface UpdateExceptionDto {
  replacementTeacherId?: string;
  replacementSubjectId?: string;
  replacementRoom?: string;
  reason?: string;
  isApproved?: boolean;
  notes?: string;
}

export interface ApproveExceptionDto {
  notes?: string;
}

// ============================================
// SCHEDULE QUERY TYPES
// ============================================

export interface StudentSchedule {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  schedule: TimetableSlot[];
}

export interface TeacherScheduleSlot extends TimetableSlot {
  classId: string;
  className: string;
}

export interface TeacherScheduleDay {
  dayOfWeek: number;
  dayName: string;
  slots: TeacherScheduleSlot[];
}

export interface TeacherSchedule {
  teacherId: string;
  teacherName: string;
  academicYear: string;
  schedule: Array<{
    classId: string;
    className: string;
    slots: TeacherScheduleSlot[];
  }>;
  totalPeriods: number;
}

export interface GuardianScheduleSlot {
  dayOfWeek: number;
  dayName: string;
  periodNumber: number;
  periodId: string;
  periodName: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  isClassTeacherSlot: boolean;
  isBreak: boolean;
  notes: string;
}

export interface GuardianChildSchedule {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  academicYear: string;
  schedule: GuardianScheduleSlot[];
}

export interface GuardianSchedule {
  guardianId: string;
  guardianName: string;
  academicYear: string;
  children: GuardianChildSchedule[];
}

export interface ClassSchedule {
  classId: string;
  className: string;
  academicYear: string;
  schedule: TimetableSlot[];
}

// ============================================
// QUERY PARAMS
// ============================================

export interface TimetableQueryParams {
  classId?: string;
  academicYear?: string;
  status?: TimetableStatus;
}

export interface ExceptionQueryParams {
  timetableId?: string;
  classId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ScheduleQueryParams {
  date?: string;
  academicYear?: string;
}

