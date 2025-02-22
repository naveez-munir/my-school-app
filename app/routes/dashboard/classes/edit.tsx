
import { CreateEditClass } from "~/components/class/CreateEditClass";
import type { Route } from "../+types";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Edit class" },
    { name: "description", content: "Edit class information" },
  ];
}

export default function ClassEdit() {
  return (
    <CreateEditClass />
  );
}
