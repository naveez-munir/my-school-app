import { useParams } from 'react-router'
import type { Route } from "../+types";
import { DailyDiaryDetail } from '~/components/dailyDiary/DailyDiaryDetail';
import { DailyDiaryDashboard } from '~/components/dailyDiary/DailyDiaryDashboard';
import { EditDailyDiary } from '~/components/dailyDiary/EditDailyDiary';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function DailyDiary() {
  const { id, action } = useParams();
  if (id && action === "edit") {
    return <EditDailyDiary />;
  }

  if (id && !action) {
    return <DailyDiaryDetail />;
  }
  return <DailyDiaryDashboard />;
}
