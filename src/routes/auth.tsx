import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in · BPS GateFlow" },
    { name: "description", content: "Secure staff sign-in for BPS GateFlow." },
    { property: "og:title", content: "Sign in · BPS GateFlow" },
    { property: "og:description", content: "Secure staff sign-in for BPS GateFlow." },
     { property: "og:type", content: "website" },
     { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) void navigate({ to: "/" });
    });
    return () => { active = false; };
  }, [navigate]);

  async function signIn() {
    if (!email.trim() || !password) {
      setMessage("Enter the staff email and password to continue.");
      return;
    }
    setBusy(true); setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setMessage("That sign-in could not be completed. Check the details and try again."); return; }
    await navigate({ to: "/" });
  }

  async function signInGoogle() {
    setBusy(true); setMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setBusy(false); setMessage("Google sign-in is not available right now."); }
  }

  return (
    <main className="app-shell flex min-h-screen items-center justify-center p-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-ink p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-sky/25 blur-3xl" />
          <div className="relative flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-brand-gold font-bold text-ink">BPS</div><div><p className="font-semibold">GateFlow</p><p className="text-xs text-primary-foreground/60">Golden Gate · Pilani</p></div></div>
          <div className="relative max-w-md"><p className="label-caps text-brand-gold">Birla Public School, Pilani</p><h1 className="mt-4 text-4xl font-bold leading-tight">A calmer gate for every arrival and departure.</h1><p className="mt-5 text-base leading-7 text-primary-foreground/70">One fast, trusted place for student movements, visitor groups, and a welcoming public screen.</p></div>
          <div className="relative grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4"><ShieldCheck className="size-5 text-brand-gold" /><p className="mt-3 font-semibold">Two access levels</p><p className="mt-1 text-xs text-primary-foreground/60">Admin and Gate System</p></div><div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4"><Building2 className="size-5 text-brand-sky" /><p className="mt-3 font-semibold">Golden Gate ready</p><p className="mt-1 text-xs text-primary-foreground/60">Built for quick desk operation</p></div></div>
        </section>
        <section className="p-7 sm:p-10">
          <div className="flex items-center justify-between"><div><p className="label-caps">Staff access</p><h2 className="mt-2 text-2xl font-bold text-ink">Welcome to GateFlow</h2></div><Link to="/public-display" target="_blank" className="text-sm font-semibold text-primary hover:underline">Public display <ArrowRight className="ml-1 inline size-4" /></Link></div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in with your Admin or shared Gate System account.</p>
          <div className="mt-8 space-y-4"><div><label className="label-caps" htmlFor="email">Staff email</label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@bpspilani.edu.in" className="mt-2 h-12" /></div><div><label className="label-caps" htmlFor="password">Password</label><div className="relative mt-2"><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void signIn(); }} placeholder="Enter password" className="h-12 pr-10" /><LockKeyhole className="absolute right-3 top-3.5 size-4 text-muted-foreground" /></div></div></div>
          {message && <p className="mt-4 rounded-xl bg-brand-red/10 px-4 py-3 text-sm font-medium text-brand-red">{message}</p>}
          <Button onClick={() => void signIn()} disabled={busy} className="mt-6 h-12 w-full bg-brand-blue hover:bg-brand-blue/90">{busy ? "Signing in…" : "Sign in to GateFlow"}<ArrowRight className="size-4" /></Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
          <Button variant="outline" onClick={() => void signInGoogle()} disabled={busy} className="h-12 w-full">Continue with Google</Button>
          <p className="mt-7 text-center text-xs leading-5 text-muted-foreground">Accounts are managed by the school. Students, parents, visitors, staff, and workers do not need accounts.</p>
        </section>
      </div>
    </main>
  );
}
