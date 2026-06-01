import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../auth/authSlice";
import { toggleTheme } from "../theme/themeSlice";

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { mode }   = useSelector((s) => s.theme);
  const role       = user?.role || localStorage.getItem("role");
  const isDark     = mode === "dark";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLink = `text-sm transition-colors ${isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`;

  return (
    <nav
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
      className="border-b px-6 py-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-500 tracking-tight">
          SubsManager
        </Link>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link to="/plans"     className={navLink}>Plans</Link>
              <Link to="/dashboard" className={navLink}>Dashboard</Link>
              {role === "admin" && (
                <Link to="/admin/subscriptions" className={navLink}>Admin</Link>
              )}
              <Link to="/profile"   className={navLink}>Profile</Link>

              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                title="Toggle theme"
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors
                  ${isDark ? "bg-slate-700 hover:bg-slate-600 text-yellow-300" : "bg-slate-200 hover:bg-slate-300 text-slate-700"}`}
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              {/* User badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ color: "var(--text)" }} className="hidden sm:block max-w-[100px] truncate text-xs font-medium">
                  {user?.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Theme toggle (unauthenticated) */}
              <button
                onClick={() => dispatch(toggleTheme())}
                title="Toggle theme"
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors
                  ${isDark ? "bg-slate-700 hover:bg-slate-600 text-yellow-300" : "bg-slate-200 hover:bg-slate-300 text-slate-700"}`}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
              <Link to="/login"    className={navLink}>Login</Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
