import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";

// ─── Demo credentials (matches the seeded warden in the DB) ───────────────────
const DEMO_NAME = "Demo Warden";
const DEMO_PASSWORD = "Demo@1234";
// ──────────────────────────────────────────────────────────────────────────────

// NOTE: Warden self-registration is intentionally disabled for this demo
// deployment to protect the database. The registerWarden logic and API still
// exist in authController.js and AuthContext — only this UI entry-point is
// restricted. To re-enable, restore the form from git history.

export default function WardenRegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-md px-4 py-10">

        {/* ── Registration Disabled Notice ── */}
        <div className="mt-10 mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 text-lg">🚫</span>
            <span className="text-sm font-semibold text-red-800">Registration Disabled</span>
          </div>
          <p className="text-xs text-red-700 leading-relaxed">
            Warden self-registration is turned off for this demo deployment to prevent
            unwanted data from being written to the database. Please use the demo account instead.
          </p>
        </div>

        {/* ── Demo Credentials Card ── */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-500 text-xl">🔑</span>
            <div className="text-xl font-bold tracking-tight text-gray-900">Demo Warden Account</div>
          </div>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            Use these credentials on the login page to explore all warden features — including
            approving requests, managing students, and viewing history.
          </p>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 font-mono text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-700 font-semibold text-xs uppercase tracking-wide">Name</span>
              <span className="text-gray-900 font-medium">{DEMO_NAME}</span>
            </div>
            <div className="border-t border-amber-100" />
            <div className="flex items-center justify-between">
              <span className="text-amber-700 font-semibold text-xs uppercase tracking-wide">Password</span>
              <span className="text-gray-900 font-medium">{DEMO_PASSWORD}</span>
            </div>
          </div>

          <Link
            to="/warden/login"
            className="mt-6 block w-full text-center glass-button-primary rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200"
          >
            Go to Warden Login →
          </Link>

          <div className="mt-4 text-center text-xs text-gray-400">
            Student access? {" "}
            <Link className="font-medium text-gray-600 hover:underline" to="/student/login">
              Student Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}


