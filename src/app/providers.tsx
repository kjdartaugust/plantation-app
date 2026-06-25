"use client";

import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/lib/store";
import { ConfirmProvider } from "@/components/confirm";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
