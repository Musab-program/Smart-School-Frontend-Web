"use client";
// File: app/layout.tsx
import type { Metadata } from "next";
// import { Cairo } from "next/font/google";
import "./globals.css";
import { MainProviders } from "./providers";
import { GlobalClickSpark } from "@/components/global-click-spark";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body className={`Cairo`}>
        <GlobalClickSpark sparkColor="#84cc16" sparkCount={10} sparkRadius={20} />
        <MainProviders>{children}</MainProviders>
      </body>
    </html>
  );
}