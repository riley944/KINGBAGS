"use client";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Invisible: records first-touch UTM parameters on landing.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
