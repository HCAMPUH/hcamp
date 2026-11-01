"use client"

import { AccessibilityWidget, AccessKitProvider } from "@access-kit/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import type React from "react"
import { z } from "zod"

import { useTranslatedZod } from "@/hooks/useTranslatedZod"
import { setupLibraries } from "@/lib/general-helpers"

// Setup libraries in client environment
// eslint-disable-next-line unicorn/no-top-level-side-effects
setupLibraries()

const queryClient = new QueryClient()

export function ClientProviders({
  children,
}: {
  readonly children: React.ReactNode
}) {
  useTranslatedZod(z)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      // forcedTheme="light"
    >
      <AccessKitProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <AccessibilityWidget
            initialPosition="center-right"
            style={{
              primary: "var(--color-primary)",
              tabBackground: "var(--color-primary)",
              tabIcon: "var(--color-primary-foreground)",
              panelBackground: "var(--color-background)",
              panelText: "var(--color-foreground)",
              border: "var(--color-border)",
              mutedText: "var(--color-muted-foreground)",
              icon: "var(--color-muted-foreground)",
            }}
          />
        </QueryClientProvider>
      </AccessKitProvider>
    </ThemeProvider>
  )
}
