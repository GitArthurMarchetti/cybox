'use client'

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Kept in sync with DEMO_READ_ONLY in src/lib/demo.ts (that module is server-only).
export const DEMO_MESSAGE = "Demo mode is read-only. Create an account to save your own changes.";

const DemoContext = createContext(false);

export function DemoProvider({ demo, children }: { demo: boolean; children: ReactNode }) {
  useEffect(() => {
    if (!demo) return;
    try {
      if (sessionStorage.getItem("cybox-demo-welcome")) return;
      sessionStorage.setItem("cybox-demo-welcome", "1");
    } catch {
      /* storage unavailable: just show the toast */
    }
    toast("Welcome to the Cybox demo", {
      description: "Explore sample rooms, categories and assets. Nothing you do here is saved.",
      duration: 6000,
    });
  }, [demo]);

  return <DemoContext.Provider value={demo}>{children}</DemoContext.Provider>;
}

/**
 * `isDemo` tells components they are showing sample data.
 * `blockIfDemo()` shows a friendly notice and returns true when the action must not run.
 * Server actions refuse demo writes anyway; this just gives a clear message up front.
 */
export function useDemo() {
  const isDemo = useContext(DemoContext);
  const router = useRouter();

  const blockIfDemo = useCallback(() => {
    if (!isDemo) return false;
    toast("Demo mode", {
      description: DEMO_MESSAGE,
      action: { label: "Create account", onClick: () => router.push("/cadastro") },
    });
    return true;
  }, [isDemo, router]);

  return { isDemo, blockIfDemo };
}
