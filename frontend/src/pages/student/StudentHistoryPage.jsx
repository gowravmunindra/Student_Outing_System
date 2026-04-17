import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import RequestCard from "../../components/requests/RequestCard";

const FILTER_OPTIONS = [
  { value: "none", label: "— Select filter —" },
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function StudentHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default to "none" so the history looks empty until the user picks a filter
  const [filter, setFilter] = useState("none");

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

  const filtered = useMemo(() => {
    if (filter === "none") return [];
    if (filter === "all") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const showEmpty = filter === "none";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Request History</div>
          <div className="text-sm text-gray-600">
            Select a filter to view your outing requests.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            id="student-history-filter"
            className="rounded-lg border border-black/10 bg-white/50 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:border-black/30 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white text-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={load}
            className="glass-button-secondary rounded-lg px-4 py-2 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-sm text-gray-400">Loading...</div>
      ) : showEmpty ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center gap-3">
          <div className="text-4xl opacity-50">📋</div>
          <div className="text-lg font-bold text-gray-900">No filter selected</div>
          <div className="text-sm text-gray-600">
            Use the dropdown above to view your requests.
          </div>
        </Card>
      ) : filtered.length ? (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <RequestCard key={r._id} request={r} />
          ))}
        </div>
      ) : (
        <Card className="p-16 flex flex-col items-center justify-center text-center gap-3">
          <div className="text-4xl opacity-50">🔍</div>
          <div className="text-lg font-bold text-gray-900">No requests found</div>
          <div className="text-sm text-gray-600">
            No {filter} requests to show.
          </div>
        </Card>
      )}
    </div>
  );
}
