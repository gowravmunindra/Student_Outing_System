import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

export default function WardenStudentRegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", branch: "", rollNo: "", age: "" });
  const [created, setCreated] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [search, setSearch] = useState("");

  // Delete confirmation modal state
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function setField(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        branch: form.branch.trim(),
        rollNo: form.rollNo.trim(),
        age: Number(form.age),
      };
      const { data } = await api.post("/api/student-id", payload);
      setCreated(data);
      toast.success("Student registered & ID generated");
      setForm({ name: "", email: "", branch: "", rollNo: "", age: "" });
      await loadStudents(search);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to register student");
    } finally {
      setSubmitting(false);
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  async function loadStudents(q = "") {
    setLoadingStudents(true);
    try {
      const query = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
      const { data } = await api.get(`/api/student-id${query}`);
      setStudents(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load registered students");
    } finally {
      setLoadingStudents(false);
    }
  }

  async function confirmDelete() {
    if (!deletingStudent) return;
    setDeleting(true);
    try {
      await api.delete(`/api/student-id/${deletingStudent._id}`);
      toast.success(`${deletingStudent.name} removed from system`);
      setDeletingStudent(null);
      await loadStudents(search);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete student");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Register Student</div>
        <div className="text-sm text-gray-600">
          Enter student details. A unique ID is generated using roll number and age.
        </div>
      </div>

      {/* Registration form */}
      <Card className="p-6">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <Input label="Email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          <Input label="Branch" value={form.branch} onChange={(e) => setField("branch", e.target.value)} />
          <Input label="Roll No" value={form.rollNo} onChange={(e) => setField("rollNo", e.target.value)} />
          <Input label="Age" type="number" value={form.age} onChange={(e) => setField("age", e.target.value)} />
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Generating..." : "Register + Generate ID"}
            </Button>
          </div>
        </form>
      </Card>

      {created ? (
        <Card className="p-6 border-black/10 bg-black/5">
          <div className="text-sm font-semibold text-gray-900">Generated Unique ID</div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-lg bg-white/80 px-4 py-2 font-mono text-sm border border-black/10 text-gray-900 tracking-wider">
              {created.studentId}
            </div>
            <Button variant="secondary" onClick={() => copy(created.studentId)}>
              Copy
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {created.name} &bull; {created.branch} &bull; Roll No:{" "}
            <span className="font-medium text-gray-900">{created.rollNo}</span> &bull; Age:{" "}
            <span className="font-medium text-gray-900">{created.age}</span>
          </div>
        </Card>
      ) : null}

      {/* Registered students table */}
      <Card className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-bold tracking-tight text-gray-900 mb-1">Registered Students</div>
            <div className="text-xs text-gray-600">
              View all saved student details. You can delete a student when they leave the hostel.
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              className="min-w-[220px]"
              placeholder="Search by name, roll no, id…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadStudents(search)}
            />
            <Button variant="secondary" onClick={() => loadStudents(search)}>
              Search
            </Button>
          </div>
        </div>

        {loadingStudents ? (
          <div className="text-sm text-gray-400">Loading students...</div>
        ) : students.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-gray-600">
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Roll No</th>
                  <th className="px-3 py-3 font-medium">Branch</th>
                  <th className="px-3 py-3 font-medium">Age</th>
                  <th className="px-3 py-3 font-medium">Email</th>
                  <th className="px-3 py-3 font-medium">Unique ID</th>
                  <th className="px-3 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b border-black/5 text-gray-800 hover:bg-black/5 transition-colors">
                    <td className="px-3 py-4">{s.name}</td>
                    <td className="px-3 py-4">{s.rollNo}</td>
                    <td className="px-3 py-4">{s.branch}</td>
                    <td className="px-3 py-4">{s.age}</td>
                    <td className="px-3 py-4">{s.email}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-black/5 px-2 py-1 rounded border border-black/10">{s.studentId}</span>
                        <button
                          type="button"
                          onClick={() => copy(s.studentId)}
                          className="rounded border border-black/10 px-2 py-1.5 text-xs hover:bg-black/10 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setDeletingStudent(s)}
                        className="rounded border border-red-500/30 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 hover:border-red-500/50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500 py-4 text-center">No registered students found.</div>
        )}
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deletingStudent}
        title="Remove student from system?"
        onClose={() => (deleting ? null : setDeletingStudent(null))}
      >
        {deletingStudent && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-bold text-black">{deletingStudent.name}</span> (
              {deletingStudent.rollNo})? This will revoke their login access and cannot be undone.
            </p>
            <div className="rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-xs text-red-800 leading-relaxed">
              ⚠️ Warning: All of their past and pending outing requests will also be permanently deleted from the system.
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeletingStudent(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Removing..." : "Yes, Remove Student"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
