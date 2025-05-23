import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando login...</div>}>
      <LoginClient />
    </Suspense>
  );
}