import type { Route } from "../+types";
import { CreateDailyDiary } from '~/components/dailyDiary/CreateDailyDiary';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daily diary Management" },
    { name: "description", content: "Manage school Daily Diary" },
  ];
}

export default function DailyDiaryNew() {
  return <CreateDailyDiary />;
}
