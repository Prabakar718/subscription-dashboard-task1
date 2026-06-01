import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../reusecomponents/Loader";

const statusStyles = {
  active:    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  expired:   "bg-red-500/20 text-red-400 border border-red-500/30",
  cancelled: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

const FILTERS = ["all", "active", "expired", "cancelled"];

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("all");
  const [search, setSearch]               = useState("");

  useEffect(() => {
    api.get("/admin/subscriptions")
      .then((r) => setSubscriptions(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subscriptions.filter((s) => {
    const matchStatus = filter === "all" || s.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.user_id?.name?.toLowerCase().includes(q) ||
      s.user_id?.email?.toLowerCase().includes(q) ||
      s.plan_id?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all:       subscriptions.length,
    active:    subscriptions.filter((s) => s.status === "active").length,
    expired:   subscriptions.filter((s) => s.status === "expired").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Subscriptions</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage and monitor all user subscriptions</p>
        </div>
        <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-sm px-4 py-1.5 rounded-full">
          {subscriptions.length} total
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",     value: counts.all,       color: "text-white",        bg: "bg-slate-800" },
          { label: "Active",    value: counts.active,    color: "text-emerald-400",  bg: "bg-emerald-500/10" },
          { label: "Expired",   value: counts.expired,   color: "text-red-400",      bg: "bg-red-500/10" },
          { label: "Cancelled", value: counts.cancelled, color: "text-slate-400",    bg: "bg-slate-700/50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} border border-slate-700 rounded-xl p-4`}>
            <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-4 py-1.5 rounded-lg capitalize transition-colors
                ${filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"}`}
            >
              {f} {f !== "all" && <span className="ml-1 opacity-60">({counts[f]})</span>}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name, email or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:ml-auto bg-slate-800 border border-slate-700 rounded-lg px-4 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/60">
                <th className="text-left text-slate-400 font-medium px-6 py-3.5">User</th>
                <th className="text-left text-slate-400 font-medium px-6 py-3.5">Plan</th>
                <th className="text-left text-slate-400 font-medium px-6 py-3.5">Price</th>
                <th className="text-left text-slate-400 font-medium px-6 py-3.5">Start Date</th>
                <th className="text-left text-slate-400 font-medium px-6 py-3.5">End Date</th>
                <th className="text-left text-slate-400 font-medium px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-16">
                    <div className="text-3xl mb-2">🔍</div>
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub._id} className="border-b border-slate-700/40 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                          {sub.user_id?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{sub.user_id?.name || "—"}</p>
                          <p className="text-slate-400 text-xs">{sub.user_id?.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-200 font-medium">{sub.plan_id?.name || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">${sub.plan_id?.price ?? "—"}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(sub.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(sub.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusStyles[sub.status] || statusStyles.expired}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
