import type { Route } from "./+types";
import { SubjectSection } from "~/components/subjects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Management" },
    { name: "description", content: "Manage school courses and curriculum" },
  ];
}

export default function Courses() {

  return (
    <SubjectSection/>
  );
}
