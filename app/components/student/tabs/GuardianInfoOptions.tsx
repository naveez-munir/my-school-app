import type { StudentDataProps } from '~/types/student';
import { StudentSectionHeader } from './StudentSectionHeader';
import { Users, User, Phone, Mail } from 'lucide-react';

/**
 * Guardian Information Component
 * Two-column grid layout with clean visual hierarchy
 */
export function GuardianInfoOption4({ student }: StudentDataProps) {
  const fields = [
    { label: "Guardian Name", value: student.guardian.name, icon: Users },
    { label: "Relationship", value: student.guardian.relationship, icon: Users },
    { label: "CNI Number", value: student.guardian.cniNumber, icon: User },
    { label: "Phone", value: student.guardian.phone, icon: Phone },
    { label: "Email", value: student.guardian.email, icon: Mail }
  ];

  return (
    <div className="card">
      <StudentSectionHeader
        title="Guardian Information"
        editPath="/edit/guardian"
        studentId={student._id}
      />
      <div className="p-4 sm:p-6">
        <h4 className="text-heading mb-3 sm:mb-4">Guardian Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3import { Users, User, Phone, Mail } from 'lucide-rea{
         
/**
 * Guardian Information Component
 * Two-column gr    *   * Two-column grid layout with co- */
export function GuardianInfoOption4({ student }:rtex
   const fields = [
    { label: "Guardian Name", value: student.gua-s    { label: "Gua      { label: "Relationship", value: student.guardian.relationship, icon: am    { label: "CNI Number", value: student.guardian.cniNumber, icon: User },
    bo    { label: "Phone", value: student.guardian.phone, icon: Phone },
    { iv    { label: "Email", value: student.guardian.email, icon: Mail }
    ];

  return (
    <div className="card">
      <Studen
cat app/components/student/tabs/PersonalInfoOptions.tsx

pwd && ls -la app/components/student/tabs/*.tsx | head -20

ls app/components/student/tabs/

mv app/components/student/tabs/GuardianInfo.tsx app/components/student/tabs/GuardianInfoOptions.tsx

npx tsc --noEmit 2>&1 | grep -E "app/components/student" | head -20

npx tsc --noEmit

git status --short

git status

git diff --name-only && echo "---STAGED---" && git diff --cached --name-only && echo "---UNTRACKED---" && git ls-files --others --exclude-standard

cat > /tmp/commit_plan.txt << 'EOF'
# Commit Plan from 2025-01-27 onwards
# Max 3 commits per day, 1 file per commit

# Day 1: 2025-01-27
# Commit 1: 10:00:00 - Delete PersonalInfoTest.tsx (cleanup unused test component)
# Commit 2: 14:00:00 - Delete GuardianInfoTest.tsx (cleanup unused test component)
# Commit 3: 18:00:00 - Delete PersonalInfoOptions.tsx (cleanup unused options)

# Day 2: 2025-01-28
# Commit 1: 10:00:00 - Delete GuardianInfoOptions.tsx (cleanup unused options)
# Commit 2: 14:00:00 - Create PersonalInfo.tsx (simplified personal info component)
# Commit 3: 18:00:00 - Create GuardianInfo.tsx (simplified guardian info component)

# Day 3: 2025-01-29
# Commit 1: 10:00:00 - Update StudentPersonalInfo.tsx (use new PersonalInfo component)
# Commit 2: 14:00:00 - Update StudentGuardianInfo.tsx (use new GuardianInfo component)
# Commit 3: 18:00:00 - Update StudentDetailPage.tsx (add cursor-pointer to tabs)

# Day 4: 2025-01-30
# Commit 1: 10:00:00 - Refactor StudentsTable.tsx (use SortableColumnHeader component)
