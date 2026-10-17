import { useEffect, useState } from "react";
import { authEnabled, supabase } from "@/lib/supabase";

const MIN_PASSWORD = 8;

// Gate: renders children only for a signed-in user; otherwise the login, register and reset screens.
export default function AuthGate({ children }) {
  return authEnabled ? <Gate>{children}</Gate> : children;
}

function Gate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      // Arrived from a password reset email: ask for the new password before entering.
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <AuthShell title="Login not configured">
        <p className="muted">
          Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment, then rebuild.
        </p>
      </AuthShell>
    );
  }
  if (session === undefined) return null;
  if (recovering) return <NewPassword onDone={() => setRecovering(false)} />;
  if (!session) return <SignIn />;
  return children;
}

function AuthShell({ title, sub, children }) {
  return (
    <main className="auth">
      <section className="panel auth-box">
        <div className="eyebrow">Strengths Exploration Hub</div>
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
        {children}
      </section>
    </main>
  );
}

function SignIn() {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }

  const switchTo = (m) => {
    setMode(m);
    setMsg(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const redirect = window.location.origin;
    let error;
    if (mode === "signin") {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    } else if (mode === "signup") {
      ({ error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirect } }));
      if (!error) setMsg({ ok: true, text: "Check your email to confirm your account, then sign in." });
    } else {
      ({ error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirect }));
      // Same message whether or not the email exists, so accounts cannot be discovered.
      if (!error) setMsg({ ok: true, text: "If an account exists for that email, a reset link is on its way." });
    }
    if (error) setMsg({ ok: false, text: error.message });
    setBusy(false);
  };

  const titles = {
    signin: ["Sign in", "Welcome back. Sign in to explore your strengths."],
    signup: ["Create your account", "Register with your email and a password."],
    forgot: ["Reset your password", "Enter your email and we will send you a reset link."],
  };

  return (
    <AuthShell title={titles[mode][0]} sub={titles[mode][1]}>
      <form className="form" onSubmit={submit}>
        <label>
          Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== "forgot" && (
          <label>
            Password
            <input
              type="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        {msg && <p className={msg.ok ? "status" : "auth-error"}>{msg.text}</p>}
        <button className="btn primary" disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>
      <div className="auth-links">
        {mode === "signin" ? (
          <>
            <button className="link" onClick={() => switchTo("forgot")}>Forgot password?</button>
            <button className="link" onClick={() => switchTo("signup")}>Create an account</button>
          </>
        ) : (
          <button className="link" onClick={() => switchTo("signin")}>Back to sign in</button>
        )}
      </div>
    </AuthShell>
  );
}

function NewPassword({ onDone }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else onDone();
  };

  return (
    <AuthShell title="Choose a new password" sub={`Use at least ${MIN_PASSWORD} characters.`}>
      <form className="form" onSubmit={submit}>
        <label>
          New password
          <input
            type="password"
            required
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn primary" disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
    </AuthShell>
  );
}
