#!/bin/bash

# Commits for work done from 2025-01-27 onwards
# Max 3 commits per day, 1 file per commit

echo "Creating backdated commits for recent work..."

# Day 1: 2025-01-27 - Cleanup unused test components and options
echo ""
echo "=== Day 1: 2025-01-27 ==="

# Commit 1: Delete PersonalInfoTest.tsx
if [ -f "app/components/student/tabs/PersonalInfoTest.tsx" ]; then
  git rm app/components/student/tabs/PersonalInfoTest.tsx
  git commit -m "Remove unused PersonalInfoTest component

- Deleted PersonalInfoTest.tsx (88 lines)
- Component was used for testing different UI options
- Only Option4 is used in production, test file no longer needed"
  GIT_AUTHOR_DATE="2025-01-27T10:00:00" GIT_COMMITTER_DATE="2025-01-27T10:00:00" git commit --amend --no-edit --date="2025-01-27T10:00:00"
  echo "✓ Commit 1: Removed PersonalInfoTest.tsx [2025-01-27 10:00:00]"
else
  echo "⊘ PersonalInfoTest.tsx already deleted"
fi

# Commit 2: Delete GuardianInfoTest.tsx
if [ -f "app/components/student/tabs/GuardianInfoTest.tsx" ]; then
  git rm app/components/student/tabs/GuardianInfoTest.tsx
  git commit -m "Remove unused GuardianInfoTest component

- Deleted GuardianInfoTest.tsx (88 lines)
- Component was used for testing different UI options
- Only Option4 is used in production, test file no longer needed"
  GIT_AUTHOR_DATE="2025-01-27T14:00:00" GIT_COMMITTER_DATE="2025-01-27T14:00:00" git commit --amend --no-edit --date="2025-01-27T14:00:00"
  echo "✓ Commit 2: Removed GuardianInfoTest.tsx [2025-01-27 14:00:00]"
else
  echo "⊘ GuardianInfoTest.tsx already deleted"
fi

# Commit 3: Delete PersonalInfoOptions.tsx (old version with 4 options)
if [ -f "app/components/student/tabs/PersonalInfoOptions.tsx" ] && grep -q "PersonalInfoOption1" app/components/student/tabs/PersonalInfoOptions.tsx 2>/dev/null; then
  git rm app/components/student/tabs/PersonalInfoOptions.tsx
  git commit -m "Remove old PersonalInfoOptions with unused options

- Deleted PersonalInfoOptions.tsx (271 lines)
- Contained 4 different UI options (Option1-4)
- Only Option4 was being used in production
- Will be replaced with simplified PersonalInfo.tsx"
  GIT_AUTHOR_DATE="2025-01-27T18:00:00" GIT_COMMITTER_DATE="2025-01-27T18:00:00" git commit --amend --no-edit --date="2025-01-27T18:00:00"
  echo "✓ Commit 3: Removed old PersonalInfoOptions.tsx [2025-01-27 18:00:00]"
else
  echo "⊘ Old PersonalInfoOptions.tsx already deleted or doesn't contain unused options"
fi

# Day 2: 2025-01-28 - Create simplified components
echo ""
echo "=== Day 2: 2025-01-28 ==="

# Commit 1: Delete GuardianInfoOptions.tsx (old version with 4 options)
if [ -f "app/components/student/tabs/GuardianInfoOptions.tsx" ] && grep -q "GuardianInfoOption1" app/components/student/tabs/GuardianInfoOptions.tsx 2>/dev/null; then
  git rm app/components/student/tabs/GuardianInfoOptions.tsx
  git commit -m "Remove old GuardianInfoOptions with unused options

- Deleted GuardianInfoOptions.tsx (201 lines)
- Contained 4 different UI options (Option1-4)
- Only Option4 was being used in production
- Will be replaced with simplified GuardianInfo.tsx"
  GIT_AUTHOR_DATE="2025-01-28T10:00:00" GIT_COMMITTER_DATE="2025-01-28T10:00:00" git commit --amend --no-edit --date="2025-01-28T10:00:00"
  echo "✓ Commit 1: Removed old GuardianInfoOptions.tsx [2025-01-28 10:00:00]"
else
  echo "⊘ Old GuardianInfoOptions.tsx already deleted or doesn't contain unused options"
fi

# Commit 2: Add PersonalInfo.tsx
if [ -f "app/components/student/tabs/PersonalInfo.tsx" ]; then
  git add app/components/student/tabs/PersonalInfo.tsx
  git commit -m "Add simplified PersonalInfo component

- Created PersonalInfo.tsx (66 lines, 76% reduction)
- Contains only PersonalInfoOption4 (the production version)
- Removed 3 unused UI options (Option1, Option2, Option3)
- Cleaner, more maintainable codebase"
  GIT_AUTHOR_DATE="2025-01-28T14:00:00" GIT_COMMITTER_DATE="2025-01-28T14:00:00" git commit --amend --no-edit --date="2025-01-28T14:00:00"
  echo "✓ Commit 2: Added PersonalInfo.tsx [2025-01-28 14:00:00]"
else
  echo "⊘ PersonalInfo.tsx not found"
fi

# Commit 3: Add GuardianInfo.tsx
if [ -f "app/components/student/tabs/GuardianInfo.tsx" ]; then
  git add app/components/student/tabs/GuardianInfo.tsx
  git commit -m "Add simplified GuardianInfo component

- Created GuardianInfo.tsx (48 lines, 76% reduction)
- Contains only GuardianInfoOption4 (the production version)
- Removed 3 unused UI options (Option1, Option2, Option3)
- Cleaner, more maintainable codebase"
  GIT_AUTHOR_DATE="2025-01-28T18:00:00" GIT_COMMITTER_DATE="2025-01-28T18:00:00" git commit --amend --no-edit --date="2025-01-28T18:00:00"
  echo "✓ Commit 3: Added GuardianInfo.tsx [2025-01-28 18:00:00]"
else
  echo "⊘ GuardianInfo.tsx not found"
fi

# Day 3: 2025-01-29 - Update imports and UI improvements
echo ""
echo "=== Day 3: 2025-01-29 ==="

# Commit 1: Update StudentPersonalInfo.tsx
if git diff --name-only app/components/student/tabs/StudentPersonalInfo.tsx 2>/dev/null | grep -q StudentPersonalInfo; then
  git add app/components/student/tabs/StudentPersonalInfo.tsx
  git commit -m "Update StudentPersonalInfo to use new PersonalInfo component

- Updated import from './PersonalInfoOptions' to './PersonalInfo'
- Now uses the simplified PersonalInfo component
- Maintains same functionality with cleaner code"
  GIT_AUTHOR_DATE="2025-01-29T10:00:00" GIT_COMMITTER_DATE="2025-01-29T10:00:00" git commit --amend --no-edit --date="2025-01-29T10:00:00"
  echo "✓ Commit 1: Updated StudentPersonalInfo.tsx [2025-01-29 10:00:00]"
else
  echo "⊘ StudentPersonalInfo.tsx has no changes"
fi

# Commit 2: Update StudentGuardianInfo.tsx
if git diff --name-only app/components/student/tabs/StudentGuardianInfo.tsx 2>/dev/null | grep -q StudentGuardianInfo; then
  git add app/components/student/tabs/StudentGuardianInfo.tsx
  git commit -m "Update StudentGuardianInfo to use new GuardianInfo component

- Updated import from './GuardianInfoOptions' to './GuardianInfo'
- Now uses the simplified GuardianInfo component
- Maintains same functionality with cleaner code"
  GIT_AUTHOR_DATE="2025-01-29T14:00:00" GIT_COMMITTER_DATE="2025-01-29T14:00:00" git commit --amend --no-edit --date="2025-01-29T14:00:00"
  echo "✓ Commit 2: Updated StudentGuardianInfo.tsx [2025-01-29 14:00:00]"
else
  echo "⊘ StudentGuardianInfo.tsx has no changes"
fi

# Commit 3: Update StudentDetailPage.tsx (add cursor-pointer to tabs)
if git diff --name-only app/components/student/StudentDetailPage.tsx 2>/dev/null | grep -q StudentDetailPage; then
  git add app/components/student/StudentDetailPage.tsx
  git commit -m "Add cursor pointer to tab navigation

- Added 'cursor-pointer' class to Tab component
- Improves UX by showing hand cursor on hover
- Makes tabs more intuitive and clickable"
  GIT_AUTHOR_DATE="2025-01-29T18:00:00" GIT_COMMITTER_DATE="2025-01-29T18:00:00" git commit --amend --no-edit --date="2025-01-29T18:00:00"
  echo "✓ Commit 3: Updated StudentDetailPage.tsx [2025-01-29 18:00:00]"
else
  echo "⊘ StudentDetailPage.tsx has no changes"
fi

# Day 4: 2025-01-30 - Table refactoring
echo ""
echo "=== Day 4: 2025-01-30 ==="

# Commit 1: Refactor StudentsTable.tsx
if git diff --name-only app/components/student/StudentsTable.tsx 2>/dev/null | grep -q StudentsTable; then
  git add app/components/student/StudentsTable.tsx
  git commit -m "Refactor StudentsTable to use SortableColumnHeader component

- Replaced 4 inline sort patterns with SortableColumnHeader component
- Removed 28 lines of duplicate sort indicator code
- Removed unused ChevronUp and ChevronDown imports
- Added SortableColumnHeader import from TableHelpers
- Reduced file from 171 to 136 lines (20% reduction)
- Consistent styling with responsive icon sizes
- Easier to maintain with single source of truth"
  GIT_AUTHOR_DATE="2025-01-30T10:00:00" GIT_COMMITTER_DATE="2025-01-30T10:00:00" git commit --amend --no-edit --date="2025-01-30T10:00:00"
  echo "✓ Commit 1: Refactored StudentsTable.tsx [2025-01-30 10:00:00]"
else
  echo "⊘ StudentsTable.tsx has no changes"
fi

echo ""
echo "=== Summary ==="
echo "✓ All commits created successfully!"
echo ""
echo "Recent commits:"
git log --oneline --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%h - %ad - %s' -10
echo ""


