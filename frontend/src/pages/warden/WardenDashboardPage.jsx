import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import RequestCard from "../../components/requests/RequestCard";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function WardenDashboardPage() {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // Always load ALL requests so counts are accurate
      const { data } = await api.get("/api/requests");
      setAllRequests(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const r of allRequests) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [allRequests]);

  // Latest single request (most recent overall)
  const latest = allRequests[0] ?? null;

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

  async function reject() {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Warden Dashboard</div>
          <div className="text-sm text-gray-600">Overview of student outing requests.</div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/warden/history"
            className="glass-button-primary rounded-xl px-5 py-2.5 text-sm"
          >
            View All History &rarr;
          </Link>
          <button
            onClick={load}
            className="glass-button-secondary rounded-lg px-4 py-2.5 text-sm"
          >
            Refresh
          </button>
        </div>
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

      {/* Latest single request */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold tracking-tight text-gray-900">Latest Request</div>
          <Link
            to="/warden/history"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            View all history &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : latest ? (
          <RequestCard
            request={latest}
            rightSlot={
              latest.status === "pending" ? (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => approve(latest._id)}
                    disabled={saving}
                    className="px-3 py-1.5"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openReject(latest)}
                    disabled={saving}
                    className="px-3 py-1.5"
                  >
                    Reject
                  </Button>
                </div>
              ) : null
            }
          />
        ) : (
          <div className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-gray-600 bg-black/5">
            No requests yet.
          </div>
        )}
      </Card>

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
            <Button variant="danger" onClick={reject} disabled={saving}>
              {saving ? "Saving..." : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
