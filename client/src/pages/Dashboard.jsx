import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";
import Loader from "../reusecomponents/Loader";

const statusStyles = {
  active:    { bar: "bg-emerald-500", badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
  expired:   { bar: "bg-red-500",     badge: "bg-red-500/20 text-red-400 border-red-500/30",             dot: "bg-red-400"     },
  cancelled: { bar: "bg-slate-500",   badge: "bg-slate-500/20 text-slate-400 border-slate-500/30",       dot: "bg-slate-400"   },
};

function daysLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function progressPercent(start, end) {
  const total = new Date(end) - new Date(start);
  const elapsed = new Date() - new Date(start);
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [subscription, setSubscription] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/my-subscription")
      .then((r) => setSubscription(r.data))
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const st = subscription ? (statusStyles[subscription.status] || statusStyles.expired) : null;
  const left = subscription ? daysLeft(subscription.end_date) : 0;
  const progress = subscription ? progressPercent(subscription.start_date, subscription.end_date) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* User Info Card */}
      {user && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-lg truncate">{user.name}</p>
            <p className="text-slate-400 text-sm truncate">{user.email}</p>
          </div>
          <span className="shrink-0 text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full capitalize">
            {user.role}
          </span>
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Current Subscription</h2>
          {subscription && (
            <span className={`flex items-center gap-1.5 text-xs border px-3 py-1 rounded-full capitalize ${st.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              {subscription.status}
            </span>
          )}
        </div>

        <div className="p-6">
          {!subscription ? (
            /* No subscription */
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
              <p className="text-white font-semibold mb-1">No Active Subscription</p>
              <p className="text-slate-400 text-sm mb-6">Choose a plan to unlock all features.</p>
              <Link
                to="/plans"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg transition-colors inline-block font-medium"
              >
                Browse Plans
              </Link>
            </div>
          ) : (
            /* Active subscription */
            <div className="space-y-5">
              {/* Plan name + price */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{subscription.plan_id?.name} Plan</h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    ${subscription.plan_id?.price} &nbsp;·&nbsp; {subscription.plan_id?.duration} days
                  </p>
                </div>
                <Link
                  to="/plans"
                  className="shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Upgrade Plan
                </Link>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Plan usage</span>
                  <span>{left} day{left !== 1 ? "s" : ""} remaining</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${st.bar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Start Date</p>
                  <p className="text-white text-sm font-medium">
                    {new Date(subscription.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="bg-slate-900 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">End Date</p>
                  <p className="text-white text-sm font-medium">
                    {new Date(subscription.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wide">Included Features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {subscription.plan_id?.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/plans" className="bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-4 transition-colors group">
          <p className="text-white font-medium group-hover:text-indigo-400 transition-colors">📋 View Plans</p>
          <p className="text-slate-400 text-sm mt-0.5">Browse all available plans</p>
        </Link>
        <Link to="/profile" className="bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-4 transition-colors group">
          <p className="text-white font-medium group-hover:text-indigo-400 transition-colors">👤 My Profile</p>
          <p className="text-slate-400 text-sm mt-0.5">Update your account details</p>
        </Link>
      </div>
    </div>
  );
}
