import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import RequestCard from "../../components/requests/RequestCard";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const FILTER_OPTIONS = [
  { value: "none", label: "— Select filter —" },
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function WardenHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default "none" → list appears empty until warden picks a filter
  const [filter, setFilter] = useState("none");
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/requests");
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

  async function approve(id) {
    setSaving(true);
    try {
      await api.put(`/api/requests/${id}/approve`);
      toast.success("Approved");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve");
    } finally {
      setSaving(false);
    }
  }

  function openReject(req) {
    setRejecting(req);
    setRejectReason("");
  }

  async function submitReject() {
    if (!rejecting) return;
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/api/requests/${rejecting._id}/reject`, { reason: rejectReason.trim() });
      toast.success("Rejected");
      setRejecting(null);
      setRejectReason("");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject");
    } finally {
      setSaving(false);
    }
  }

  const showEmpty = filter === "none";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Request History</div>
          <div className="text-sm text-gray-600">
            All student outing requests. Select a filter to view.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            id="warden-history-filter"
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
        <div className="text-sm text-gray-600">Loading...</div>
      ) : showEmpty ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center gap-3">
          <div className="text-4xl opacity-50">📋</div>
          <div className="text-lg font-bold text-gray-900">No filter selected</div>
          <div className="text-sm text-gray-600">
            Use the dropdown above to view requests.
          </div>
        </Card>
      ) : filtered.length ? (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              rightSlot={
                r.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => approve(r._id)}
                      disabled={saving}
                      className="px-3 py-1.5"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => openReject(r)}
                      disabled={saving}
                      className="px-3 py-1.5"
                    >
                      Reject
                    </Button>
                  </div>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <Card className="p-16 flex flex-col items-center justify-center text-center gap-3">
          <div className="text-4xl opacity-50">🔍</div>
          <div className="text-lg font-bold text-gray-900">No requests found</div>
          <div className="text-sm text-gray-600">No {filter} requests to show.</div>
        </Card>
      )}

      {/* Reject modal */}
      <Modal
        open={!!rejecting}
        title="Reject request — reason required"
        onClose={() => (saving ? null : setRejecting(null))}
      >
        <div className="space-y-4">
          <Input
            label="Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRejecting(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={submitReject} disabled={saving}>
              {saving ? "Saving..." : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
