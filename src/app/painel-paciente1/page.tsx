"use client"; // marca toda a página como Client Component

import { useState, Suspense } from "react";
import PainelPacienteComponent1 from "./PainelPacienteComponent1";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PainelPacienteComponent1 />
    </Suspense>
  );
}

