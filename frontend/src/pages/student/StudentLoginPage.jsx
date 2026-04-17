import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function StudentLoginPage() {
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentId, setStudentId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginStudent({ name, rollNo, studentId });
      toast.success("Welcome!");
      navigate("/student", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="p-8 mt-10">
          <div className="text-2xl font-bold tracking-tight text-gray-900">Student Login</div>
          <div className="mt-2 text-sm text-gray-600">
            Login using your name, roll number, and the unique ID provided by the warden.
          </div>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input label="Roll No" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
            <Input
              label="Unique Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. SOS-21CS101-19-7F3A1C"
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-600">
            Don’t have an ID? Ask your warden to register you.
          </div>
        </Card>
      </div>
    </div>
  );
}

