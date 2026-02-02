import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { RegisterForm } from "@/components/auth/register-form";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative px-4">
        <div className="relative -mt-20">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
