import { ClassSection } from "~/components/class/ClassSection";
import type { Route } from "../+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Class Management" },
    { name: "description", content: "Manage school classes" },
  ];
}

export default function Classes() {

  return (
    <ClassSection />
  );
}
//Note we can not add Layout in the function name here 
