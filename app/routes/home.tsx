import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthData } from "~/utils/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "School Management System" },
    { name: "description", content: "Welcome to School Management System" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = getAuthData();

    if (!authData?.token) {
      // No token, redirect to login
      navigate('/login', { replace: true });
    } else {
      // Has token, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Show nothing while redirecting
  return null;
}
