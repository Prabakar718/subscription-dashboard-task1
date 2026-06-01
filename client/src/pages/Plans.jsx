import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";
import Loader from "../reusecomponents/Loader";
import toast from "react-hot-toast";

const TIER_STYLES = {
  Starter:    { gradient: "from-slate-500 to-slate-600",   badge: "bg-slate-500/20 text-slate-300",   popular: false },
  Pro:        { gradient: "from-indigo-500 to-indigo-700", badge: "bg-indigo-500/20 text-indigo-300", popular: true  },
  Business:   { gradient: "from-violet-500 to-violet-700", badge: "bg-violet-500/20 text-violet-300", popular: false },
  Enterprise: { gradient: "from-amber-500 to-amber-700",   badge: "bg-amber-500/20 text-amber-300",   popular: false },
};

// ── Simulated Payment Modal ───────────────────────────────────
function PaymentModal({ plan, user, onSuccess, onCancel }) {
  const [step, setStep]       = useState("form"); // form | processing | success
  const [card, setCard]       = useState({ number: "4111 1111 1111 1111", expiry: "12/26", cvv: "123", name: user?.name || "" });

  const handlePay = (e) => {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => onSuccess(), 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">SubsManager Pay</p>
            <p className="text-white/70 text-xs">{plan.name} Plan — ${plan.price}</p>
          </div>
          <div className="text-white/80 text-xs bg-white/10 px-2 py-1 rounded-full">🔒 Test Mode</div>
        </div>

        <div className="p-6">
          {step === "form" && (
            <form onSubmit={handlePay} className="space-y-3">
              <p className="text-slate-400 text-xs mb-4">
                Test card: <span className="text-white font-mono">4111 1111 1111 1111</span>
              </p>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Cardholder Name</label>
                <input
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                <input
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="4111 1111 1111 1111"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Expiry</label>
                  <input
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CVV</label>
                  <input
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Pay ${plan.price}
                </button>
              </div>
            </form>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Processing payment...</p>
              <p className="text-slate-400 text-sm mt-1">Please wait</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
              <p className="text-emerald-400 font-bold text-lg">Payment Successful!</p>
              <p className="text-slate-400 text-sm mt-1">Activating your plan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Plans Page ───────────────────────────────────────────
export default function Plans() {
  const [plans, setPlans]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [subscribing, setSubscribing]   = useState(null);
  const [activePlanId, setActivePlanId] = useState(null);
  const [activePlanPrice, setActivePlanPrice] = useState(null);
  const [paymentPlan, setPaymentPlan]   = useState(null); // plan being paid for

  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.theme);
  const isDark = mode === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await api.get("/plans");
        setPlans(plansRes.data);
        if (isAuthenticated) {
          const subRes = await api.get("/my-subscription").catch(() => ({ data: null }));
          if (subRes.data?.plan_id) {
            setActivePlanId(subRes.data.plan_id._id || subRes.data.plan_id);
            setActivePlanPrice(subRes.data.plan_id.price);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleSubscribeClick = (plan) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setPaymentPlan(plan);   // open payment modal
  };

  const handlePaymentSuccess = async () => {
    setPaymentPlan(null);
    setSubscribing(paymentPlan?._id);
    try {
      await api.post(`/subscribe/${paymentPlan._id}`);
      toast.success(`🎉 Subscribed to ${paymentPlan.name} plan!`);
      setActivePlanId(paymentPlan._id);
      setActivePlanPrice(paymentPlan.price);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setSubscribing(null);
    }
  };

  const handlePaymentCancel = () => {
    setPaymentPlan(null);
    toast("Payment cancelled", { icon: "ℹ️" });
  };

  if (loading) return <Loader />;

  const cardBg   = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const subColor = isDark ? "text-slate-400" : "text-slate-500";
  const headingColor = isDark ? "text-white" : "text-slate-900";

  return (
    <div className="py-4">
      {/* Payment Modal */}
      {paymentPlan && (
        <PaymentModal
          plan={paymentPlan}
          user={user}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20 mb-4">
          PRICING
        </span>
        <h1 className={`text-4xl font-bold mb-3 ${headingColor}`}>
          Choose Your Plan
        </h1>
        <p className={`text-lg max-w-xl mx-auto ${subColor}`}>
          Start free, scale as you grow. Secure payment simulation included.
        </p>
        <div className="inline-flex items-center gap-2 mt-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full">
          <span>🔒</span>
          <span>Test Mode — Simulated payment gateway</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const style       = TIER_STYLES[plan.name] || TIER_STYLES.Starter;
          const isCurrent   = activePlanId === plan._id;
          const isUpgrade   = activePlanPrice !== null && plan.price > activePlanPrice;
          const isDowngrade = activePlanPrice !== null && plan.price < activePlanPrice;

          let btnLabel = "Get Started";
          if (subscribing === plan._id) btnLabel = "Activating...";
          else if (isCurrent)           btnLabel = "✓ Current Plan";
          else if (isUpgrade)           btnLabel = "⬆ Upgrade";
          else if (isDowngrade)         btnLabel = "⬇ Downgrade";
          else if (activePlanId)        btnLabel = "Switch Plan";

          return (
            <div
              key={plan._id}
              className={`relative border rounded-2xl overflow-hidden flex flex-col transition-all duration-200
                ${cardBg}
                ${style.popular && !isCurrent ? "border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]" : ""}
                ${isCurrent ? "ring-2 ring-emerald-500 border-emerald-500" : ""}
                ${!style.popular && !isCurrent ? (isDark ? "hover:border-slate-500" : "hover:border-slate-400") : ""}
              `}
            >
              {/* Top banner */}
              {isCurrent && (
                <div className="bg-emerald-600 text-white text-xs font-semibold text-center py-1">
                  YOUR CURRENT PLAN
                </div>
              )}
              {style.popular && !isCurrent && (
                <div className="bg-indigo-600 text-white text-xs font-semibold text-center py-1">
                  MOST POPULAR
                </div>
              )}
              {isUpgrade && !isCurrent && (
                <div className="bg-violet-600 text-white text-xs font-semibold text-center py-1">
                  UPGRADE AVAILABLE
                </div>
              )}

              {/* Card header */}
              <div className={`bg-gradient-to-br ${style.gradient} p-6 ${isCurrent || style.popular || isUpgrade ? "pt-8" : ""}`}>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {plan.name}
                </span>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60 text-sm ml-1">/{plan.duration}d</span>
                </div>
                <p className="text-white/70 text-xs mt-1">
                  {plan.duration === 365 ? "Annual billing" : "Monthly billing"}
                </p>
              </div>

              {/* Features */}
              <div className="p-6 flex flex-col flex-1">
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribeClick(plan)}
                  disabled={isCurrent || subscribing === plan._id}
                  className={`w-full font-medium py-2.5 rounded-lg transition-colors text-sm
                    ${isCurrent
                      ? "bg-emerald-600/20 text-emerald-400 cursor-default border border-emerald-600/30"
                      : isUpgrade
                        ? "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                        : style.popular
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                          : isDark
                            ? "bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-800 disabled:opacity-50"
                    }`}
                >
                  {subscribing === plan._id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Activating...
                    </span>
                  ) : btnLabel}
                </button>

                {!isCurrent && (
                  <p className={`text-center text-xs mt-2 ${subColor}`}>
                    🔒 Secured payment
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isAuthenticated && (
        <p className={`text-center text-sm mt-8 ${subColor}`}>
          <a href="/login" className="text-indigo-400 hover:underline">Sign in</a> to subscribe to a plan
        </p>
      )}
    </div>
  );
}
