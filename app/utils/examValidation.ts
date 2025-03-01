// src/utils/examValidation.ts

import type { SubjectSchedule } from '~/types/exam';

/**
 * Checks for time conflicts between any number of exam subjects on the same date
 * @param subjects Array of subject schedules to check
 * @returns Object with validation result and any conflicting subjects
 */
export const checkTimeConflicts = (subjects: SubjectSchedule[]) => {
  // Group subjects by date for easier comparison
  const subjectsByDate: Record<string, SubjectSchedule[]> = {};
  
  // First, group subjects by date
  subjects.forEach(subject => {
    if (!subject.examDate) return; // Skip if no date set
    const dateString = new Date(subject.examDate).toDateString();
    if (!subjectsByDate[dateString]) {
      subjectsByDate[dateString] = [];
    }
    subjectsByDate[dateString].push(subject);
  });
  
  const conflicts: Array<{
    subject1: string;
    subject2: string;
    date: string;
    time1: string;
    time2: string;
  }> = [];
  
  // For each date with multiple subjects, check for conflicts
  Object.entries(subjectsByDate).forEach(([dateString, dateSubjects]) => {
    // Skip dates with only one subject (no conflict possible)
    if (dateSubjects.length < 2) return;
    
    // Check each subject against all others on this date
    for (let i = 0; i < dateSubjects.length; i++) {
      for (let j = i + 1; j < dateSubjects.length; j++) {
        const subject1 = dateSubjects[i];
        const subject2 = dateSubjects[j];
        
        // Skip if either subject doesn't have a valid time
        if (!subject1.startTime || !subject1.endTime || !subject2.startTime || !subject2.endTime) {
          continue;
        }
        
        // Parse times to compare them
        const [startHour1, startMin1] = subject1.startTime.split(':').map(Number);
        const [endHour1, endMin1] = subject1.endTime.split(':').map(Number);
        const [startHour2, startMin2] = subject2.startTime.split(':').map(Number);
        const [endHour2, endMin2] = subject2.endTime.split(':').map(Number);
        
        // Convert to minutes for easier comparison
        const start1 = startHour1 * 60 + (startMin1 || 0);
        const end1 = endHour1 * 60 + (endMin1 || 0);
        const start2 = startHour2 * 60 + (startMin2 || 0);
        const end2 = endHour2 * 60 + (endMin2 || 0);
        
        // Check for overlap - four possible conflict cases:
        // 1. subject1 starts during subject2
        // 2. subject1 ends during subject2
        // 3. subject2 starts during subject1
        // 4. subject2 ends during subject1
        // Also catch edge cases for exact same start or end times
        if (
          (start1 >= start2 && start1 < end2) || // case 1
          (end1 > start2 && end1 <= end2) ||     // case 2
          (start2 >= start1 && start2 < end1) || // case 3
          (end2 > start1 && end2 <= end1) ||     // case 4
          (start1 === start2 && end1 === end2)    // exact same time slot
        ) {
          // Skip if subjects are the same or either is missing
          if (!subject1.subject || !subject2.subject || subject1.subject === subject2.subject) {
            continue;
          }
          
          conflicts.push({
            subject1: subject1.subject,
            subject2: subject2.subject,
            date: dateString,
            time1: `${subject1.startTime} - ${subject1.endTime}`,
            time2: `${subject2.startTime} - ${subject2.endTime}`,
          });
        }
      }
    }
  });

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    // Adding a count of conflicts for easier handling
    conflictCount: conflicts.length
  };
};

/**
 * Gets a formatted name for a subject ID by looking it up in the subjects array
 * @param subjectId The ID of the subject to look up
 * @param subjectsArray Array of subject objects to search in
 * @returns Formatted subject name or the original ID if not found
 */
export const getSubjectName = (subjectId: string, subjectsArray: any[]) => {
  const subject = subjectsArray.find(s => s._id === subjectId);
  return subject 
    ? `${subject.subjectName || subject.name} (${subject.subjectCode || subject.code})` 
    : subjectId;
};
