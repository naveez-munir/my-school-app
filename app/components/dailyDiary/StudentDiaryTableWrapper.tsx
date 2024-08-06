import { DailyDiaryTable } from './DailyDiaryTable';
import type { DailyDiaryResponse } from '~/types/dailyDiary';

interface StudentDiaryTableWrapperProps {
  data: DailyDiaryResponse[];
  globalFilter: string;
  onView: (diary: DailyDiaryResponse) => void;
}
export function StudentDiaryTableWrapper({
  data,
  globalFilter,
  onView
}: StudentDiaryTableWrapperProps) {
  return (
    <DailyDiaryTable
      data={data}
      globalFilter={globalFilter}
      onView={onView}
      readOnly={true}
    />
  );
}
