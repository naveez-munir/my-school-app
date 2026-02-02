import type { Route } from "./+types/not-found";
import { NotFound } from "~/components/common/NotFound";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 - Page Not Found" },
    { name: "description", content: "Page not found" },
  ];
}

export default function NotFoundRoute() {
  return <NotFound />;
}
