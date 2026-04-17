import { NavLink, Outlet, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "block rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
          isActive ? "bg-black text-white shadow-[0_0_15px_rgba(0,0,0,0.15)]" : "text-gray-500 hover:bg-black/5 hover:text-black"
        )
      }
      end
    >
      {children}
    </NavLink>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/", { replace: true });
  }

  const isStudent = user?.role === "student";

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-40 border-b border-black/5 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            Student Outing
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden text-sm text-gray-500 sm:flex items-center gap-2">
              <span className="text-gray-900 font-medium">{user?.name}</span> 
              <span className="text-gray-300">|</span> 
              <span className="uppercase tracking-wider text-xs">{user?.role}</span>
            </div>
            <button
              onClick={onLogout}
              className="glass-button-secondary rounded-full px-5 py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[260px_1fr]">
        <aside className="glass-panel p-4 h-fit sticky top-24">
          {isStudent ? (
            <div className="space-y-1">
              <Item to="/student">Dashboard</Item>
              <Item to="/student/request">New Request</Item>
              <Item to="/student/history">History</Item>
            </div>
          ) : (
            <div className="space-y-1">
              <Item to="/warden">Dashboard</Item>
              <Item to="/warden/history">History</Item>
              <Item to="/warden/students">Register Student</Item>
            </div>
          )}
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

