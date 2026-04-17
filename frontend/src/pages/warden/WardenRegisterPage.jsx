import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function WardenRegisterPage() {
  const navigate = useNavigate();
  const { user, registerWarden } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  function setField(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerWarden(form);
      toast.success("Warden account created");
      navigate("/warden", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (user) {
    navigate("/app", { replace: true });
    return null;
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="p-8 mt-10">
          <div className="text-2xl font-bold tracking-tight text-gray-900">Warden Register</div>
          <div className="mt-2 text-sm text-gray-600">Create a warden account.</div>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <Input label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
            <Input label="Email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creating..." : "Register"}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="font-medium text-gray-900 hover:underline" to="/warden/login">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

