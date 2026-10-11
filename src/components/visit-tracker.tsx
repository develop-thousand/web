"use client";

import { useEffect } from "react";

let visitRequested = false;

export function VisitTracker() {
  useEffect(() => {
    if (visitRequested) return;
    visitRequested = true;

    void fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {
      visitRequested = false;
    });
  }, []);

  return null;
}
