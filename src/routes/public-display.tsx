import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ScanLine, ShieldAlert, Sparkles, UsersRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DisplayState = Database["public"]["Tables"]["public_display_state"]["Row"];

export const Route = createFileRoute("/public-display")({
  head: () => ({ meta: [
    { title: "Welcome · BPS Golden Gate" },
    { name: "description", content: "Read-only public display for the Golden Gate at Birla Public School, Pilani." },
    { property: "og:title", content: "Welcome · BPS Golden Gate" },
    { property: "og:description", content: "A welcoming live gate display for Birla Public School, Pilani." },
     { property: "og:type", content: "website" },
     { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PublicDisplay,
});

const fallback: DisplayState = { id: 1, mode: "idle", headline: "WELCOME TO BIRLA PUBLIC SCHOOL, PILANI", detail: "Please proceed to the security desk for entry or exit.", safe_name: null, updated_at: new Date().toISOString() };

function PublicDisplay() {
  const [state, setState] = useState<DisplayState>(fallback);
  useEffect(() => {
    let active = true;
    void supabase.from("public_display_state").select("*").eq("id", 1).maybeSingle().then(({ data }) => { if (active && data) setState(data); });
    const channel = supabase.channel("public-display-live").on("postgres_changes", { event: "UPDATE", schema: "public", table: "public_display_state", filter: "id=eq.1" }, (payload) => { if (active) setState(payload.new as DisplayState); }).subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, []);
  useEffect(() => {
    if (state.mode === "idle") return;
    const timeout = window.setTimeout(() => setState(fallback), 12000);
    return () => window.clearTimeout(timeout);
  }, [state]);
  const isIdle = state.mode === "idle";
  const tone = state.mode === "access_denied" || state.mode === "invalid_qr" ? "bg-brand-red" : state.mode === "student_out" || state.mode === "visitor_out" ? "bg-brand-blue" : "bg-ink";
  const Icon = state.mode === "student_scan" ? ScanLine : state.mode === "visitor_registration" ? UsersRound : state.mode === "access_denied" || state.mode === "invalid_qr" ? ShieldAlert : state.mode === "student_in" || state.mode === "visitor_in" ? CheckCircle2 : Sparkles;
  return <main className={`min-h-screen ${tone} flex items-center justify-center overflow-hidden p-8 text-primary-foreground transition-colors duration-700`}>
     <div className="absolute inset-x-0 top-0 h-2 bg-brand-gold" />
    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
      <div className="flex items-center gap-3"><div className="grid size-14 place-items-center rounded-2xl bg-brand-gold text-lg font-bold text-ink shadow-soft">BPS</div><div className="text-left"><p className="text-sm font-bold tracking-wide">BIRLA PUBLIC SCHOOL</p><p className="text-xs text-primary-foreground/60">PILANI · GOLDEN GATE</p></div></div>
      <div className="mt-20 grid size-20 place-items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10"><Icon className="size-9 text-brand-gold" /></div>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-brand-gold">{isIdle ? "Golden Gate" : state.mode.replaceAll("_", " ")}</p>
      <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">{isIdle ? <>WELCOME TO<br />BIRLA PUBLIC SCHOOL, PILANI</> : state.headline}</h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-primary-foreground/70 sm:text-xl">{state.detail}</p>
      <div className="mt-16 flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-5 py-3 text-sm text-primary-foreground/70"><span className="size-2 animate-pulse rounded-full bg-brand-green" />Live gate display</div>
    </div>
  </main>;
}
