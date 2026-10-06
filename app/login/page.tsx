import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Sign in" };
export default function Page() {
  return <section className="bg-cream px-4 py-16"><Suspense><AuthForm mode="login" /></Suspense></section>;
}
