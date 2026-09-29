"use client";
import { useEffect } from "react";
import { reportClientError } from "@/lib/report";

// Site-wide safety net. Anything that throws in the browser lands here
// instead of Next's blank "Application error" screen, and gets logged.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportClientError("app.error", error, { digest: error.digest, path: typeof window !== "undefined" ? window.location.pathname : "" });
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="section-label mb-4">Something went wrong</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">
        That didn&apos;t load the way it should have.
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        Your work is saved. Try the page again, or open your account to pick up where you left off.
        If it keeps happening, email{" "}
        <a href="mailto:hello@kingbags.co" className="text-ember font-semibold hover:underline">hello@kingbags.co</a>{" "}
        and a person will sort it out.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={reset} className="btn-ember !px-8 !py-3.5">Try again</button>
        <a href="/account" className="btn-outline !px-8 !py-3.5">Open my account</a>
      </div>
      {error.digest && <p className="text-[11px] text-ink-soft mt-8">Reference: {error.digest}</p>}
    </div>
  );
}
