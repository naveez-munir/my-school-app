import type { Route } from "./+types";
import { SubjectSection } from "~/components/subjects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Subject Management" },
    { name: "description", content: "Manage school subjects and curriculum" },
  ];
}

export default function Courses() {

  return (
    <SubjectSection/>
  );
}
