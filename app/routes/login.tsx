import type { Route } from "./+types/home";
import { SignIn } from "~/components/auth/SignIn";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login page" },
    { name: "description", content: "login page!" },
  ];
}

export default function Home() {
  return <SignIn />;
}
