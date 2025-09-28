// File: app/provider/providers.tsx
"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

export function MainProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}