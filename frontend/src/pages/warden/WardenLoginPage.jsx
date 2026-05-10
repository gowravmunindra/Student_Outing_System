import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

// ─── Demo credentials (matches the seeded warden in the DB) ───────────────────
const DEMO_NAME = "Demo Warden";
const DEMO_PASSWORD = "Demo@1234";
// ──────────────────────────────────────────────────────────────────────────────

export default function WardenLoginPage() {
  const { loginWarden } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginWarden(name, password);
      toast.success("Welcome, warden!");
      navigate("/warden", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  function autoFill() {
    setName(DEMO_NAME);
    setPassword(DEMO_PASSWORD);
    toast("Demo credentials filled in!", { icon: "✨" });
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-md px-4 py-10">

        {/* ── Demo Credentials Banner ── */}
        <div className="mt-10 mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-500 text-lg">🔑</span>
            <span className="text-sm font-semibold text-amber-800">Demo Access — Warden</span>
          </div>
          <p className="text-xs text-amber-700 mb-3 leading-relaxed">
            This is a portfolio / demo deployment. Registration is disabled to protect the database.
            Use the credentials below to explore all warden features.
          </p>
          <div className="rounded-xl bg-white/70 border border-amber-100 px-4 py-3 font-mono text-xs space-y-1 text-gray-800">
            <div><span className="text-amber-600 font-semibold">Name&nbsp;&nbsp;&nbsp;&nbsp;:</span> {DEMO_NAME}</div>
            <div><span className="text-amber-600 font-semibold">Password:</span> {DEMO_PASSWORD}</div>
          </div>
          <button
            type="button"
            onClick={autoFill}
            className="mt-3 w-full rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold text-xs py-2 transition-all duration-200 active:scale-95"
          >
            ⚡ Auto-fill Credentials
          </button>
        </div>

        {/* ── Login Form ── */}
        <Card className="p-8">
          <div className="text-2xl font-bold tracking-tight text-gray-900">Warden Login</div>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </form>
          <div className="mt-6 text-xs text-gray-400 text-center">
            New warden registration is disabled for this demo.
          </div>
        </Card>
      </div>
    </div>
  );
}

