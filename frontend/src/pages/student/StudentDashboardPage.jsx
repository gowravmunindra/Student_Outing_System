import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import RequestCard from "../../components/requests/RequestCard";

export default function StudentDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/requests/my");
      setRequests(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Only the single most recent request shown on dashboard
  const latest = requests[0] ?? null;

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const r of requests) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [requests]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Student Dashboard</div>
          <div className="text-sm text-gray-600">Track your outing requests and their status.</div>
        </div>
        <Link
          to="/student/request"
          className="glass-button-primary rounded-xl px-5 py-2.5 text-sm"
        >
          + New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-6 bg-black/5 border-black/5">
          <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold flex items-center justify-between">
            Pending <span className="w-2 h-2 rounded-full bg-gray-500"></span>
          </div>
          <div className="mt-3 text-4xl font-black tracking-tighter text-gray-700">{counts.pending}</div>
        </Card>
        <Card className="p-6 bg-white/60 border-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold flex items-center justify-between">
            Approved <span className="w-2 h-2 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.8)]"></span>
          </div>
          <div className="mt-3 text-4xl font-black tracking-tighter text-gray-900">{counts.approved}</div>
        </Card>
        <Card className="p-6 bg-black/5 border-black/5">
          <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold flex items-center justify-between">
            Rejected <span className="w-2 h-2 rounded-full bg-gray-600"></span>
          </div>
          <div className="mt-3 text-4xl font-black tracking-tighter text-gray-700">{counts.rejected}</div>
        </Card>
      </div>

      {/* Latest request only */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold tracking-tight text-gray-900">Latest Request</div>
          <div className="flex items-center gap-4">
            <Link
              to="/student/history"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View all history &rarr;
            </Link>
            <button
              onClick={load}
              className="glass-button-secondary rounded-lg px-4 py-2 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : latest ? (
          <RequestCard request={latest} />
        ) : (
          <div className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-gray-600 bg-black/5">
            No requests yet.{" "}
            <Link
              to="/student/request"
              className="font-medium text-gray-900 hover:underline transition-all"
            >
              Create your first request
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
