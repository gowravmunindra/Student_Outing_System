import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-full">
      <div className="border-b border-black/5 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            Student Outing
          </div>
          {user ? (
            <button
              onClick={() => navigate("/app")}
              className="glass-button-primary rounded-full px-5 py-2 text-sm"
            >
              Go to Dashboard
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Manage Outings <span className="opacity-50">Seamlessly</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A minimal, fast, and elegant way to request permissions and manage student outings securely.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
          <Card className="p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">Student Access</div>
            <div className="mt-3 text-gray-600 leading-relaxed min-h-[48px]">
              Request outing permission, monitor status, and track historical approvals.
            </div>
            <div className="mt-8 flex gap-3">
              <Link
                to="/student/login"
                className="glass-button-primary w-full text-center rounded-xl px-5 py-3 text-sm flex items-center justify-center gap-2"
              >
                Student Login
                <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>
          </Card>

          <Card className="p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">Warden Access</div>
            <div className="mt-3 text-gray-600 leading-relaxed min-h-[48px]">
              Review upcoming requests, manage approvals, and onboard new students easily.
            </div>
            <div className="mt-8">
              <Link
                to="/warden/login"
                className="glass-button-secondary w-full text-center rounded-xl px-5 py-3 text-sm flex items-center justify-center gap-2"
              >
                Warden Login
                <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

