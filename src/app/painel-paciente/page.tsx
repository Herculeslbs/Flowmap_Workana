"use client"; // marca toda a página como Client Component

import { useState, Suspense } from "react";
import PainelPacienteComponent from "./PainelPacienteComponent";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PainelPacienteComponent />
    </Suspense>
  );
}

