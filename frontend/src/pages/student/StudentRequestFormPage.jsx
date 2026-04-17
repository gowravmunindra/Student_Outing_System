import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function StudentRequestFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    branch: "",
    rollNo: "",
    outingDate: "",
    outTime: "",
    returnDate: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function setField(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/requests", form);
      toast.success("Request submitted");
      navigate("/student/history", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">New Outing Request</div>
        <div className="text-sm text-gray-600">Fill in all fields. Status starts as pending.</div>
      </div>

      <Card className="p-6">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <Input
            label="Branch"
            value={form.branch}
            onChange={(e) => setField("branch", e.target.value)}
          />
          <Input
            label="Roll No"
            value={form.rollNo}
            onChange={(e) => setField("rollNo", e.target.value)}
          />
          <Input
            label="Outing Date"
            type="date"
            value={form.outingDate}
            onChange={(e) => setField("outingDate", e.target.value)}
          />
          <Input
            label="Out Time"
            type="time"
            value={form.outTime}
            onChange={(e) => setField("outTime", e.target.value)}
          />
          <Input
            label="Return Date"
            type="date"
            value={form.returnDate}
            onChange={(e) => setField("returnDate", e.target.value)}
          />
          <label className="md:col-span-2 block">
            <div className="mb-1.5 text-sm font-medium text-gray-800">Reason</div>
            <textarea
              className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
              rows={4}
              value={form.reason}
              onChange={(e) => setField("reason", e.target.value)}
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting} className="w-full md:w-auto">
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

