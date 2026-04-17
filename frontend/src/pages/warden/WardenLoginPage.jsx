import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function WardenLoginPage() {
  const { loginWarden } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginWarden(name, password);
      toast.success("Welcome, warden!");
      navigate("/warden", { replace: true });
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
          <div className="text-2xl font-bold tracking-tight text-gray-900">Warden Login</div>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-600">
            Need a warden account?{" "}
            <Link className="font-medium text-gray-900 hover:underline" to="/warden/register">
              Register
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

