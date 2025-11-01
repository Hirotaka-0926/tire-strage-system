"use client";

import { useEffect } from "react";

// Globally mitigates mobile on-screen keyboard overlap with inputs.
// - Adds temporary bottom padding equal to keyboard height using visualViewport
// - Ensures focused input fields are scrolled into view
export default function MobileViewportFix() {
  useEffect(() => {
    const vv =
      typeof window !== "undefined"
        ? (window as any).visualViewport
        : undefined;

    const updateBottomInset = () => {
      try {
        const viewportHeight = vv?.height ?? window.innerHeight;
        const bottomInset = Math.max(0, window.innerHeight - viewportHeight);
        document.documentElement.style.setProperty(
          "--kb-safe-bottom",
          `${bottomInset}px`
        );
        // Apply padding only when keyboard likely visible
        document.body.style.paddingBottom =
          bottomInset > 0 ? `${bottomInset}px` : "";
      } catch {
        // no-op
      }
    };

    const scrollFocusedIntoView = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isFocusable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.getAttribute("contenteditable") === "true";
      if (!isFocusable) return;
      // Delay slightly to let keyboard animate and layout settle
      setTimeout(() => {
        try {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        } catch {
          // ignore
        }
      }, 50);
    };

    updateBottomInset();
    vv?.addEventListener?.("resize", updateBottomInset);
    vv?.addEventListener?.("scroll", updateBottomInset);
    window.addEventListener("orientationchange", updateBottomInset);
    window.addEventListener("focusin", scrollFocusedIntoView);

    return () => {
      vv?.removeEventListener?.("resize", updateBottomInset);
      vv?.removeEventListener?.("scroll", updateBottomInset);
      window.removeEventListener("orientationchange", updateBottomInset);
      window.removeEventListener("focusin", scrollFocusedIntoView);
      // Clear padding to avoid persistent offset after navigation
      try {
        document.body.style.paddingBottom = "";
        document.documentElement.style.removeProperty("--kb-safe-bottom");
      } catch {
        // no-op
      }
    };
  }, []);

  return null;
}
