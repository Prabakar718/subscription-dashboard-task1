import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../auth/authSlice";
import api from "../services/api";
import toast from "react-hot-toast";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
      <span>⚠</span> {msg}
    </p>
  );
}

export default function Register() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { mode }  = useSelector((s) => s.theme);
  const isDark    = mode === "dark";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const inputClass = (field) =>
    `w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors
     ${isDark ? "bg-slate-900 text-white placeholder-slate-500" : "bg-slate-100 text-slate-900 placeholder-slate-400"}
     border ${errors[field]
       ? "border-red-500 focus:border-red-400"
       : touchedFields[field]
         ? "border-emerald-500 focus:border-emerald-400"
         : isDark
           ? "border-slate-600 focus:border-indigo-500"
           : "border-slate-300 focus:border-indigo-500"}`;

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      dispatch(loginSuccess(res.data));
      toast.success("Account created! Welcome 🎉");
      // Pass credentials to login page (for auto-fill demo)
      navigate("/plans");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const cardBg    = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const labelColor = isDark ? "text-slate-300" : "text-slate-700";
  const headingColor = isDark ? "text-white" : "text-slate-900";
  const subColor  = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className={`border rounded-2xl p-8 w-full max-w-md shadow-xl ${cardBg}`}>

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold mb-1 ${headingColor}`}>Create account</h1>
          <p className={`text-sm ${subColor}`}>Start your subscription journey today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${labelColor}`}>Full Name</label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className={inputClass("name")}
            />
            <FieldError msg={errors.name?.message} />
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${labelColor}`}>Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={inputClass("email")}
            />
            <FieldError msg={errors.email?.message} />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${labelColor}`}>Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Min. 6 characters"
              className={inputClass("password")}
            />
            <FieldError msg={errors.password?.message} />
            {/* Password strength hint */}
            {!errors.password && (
              <p className={`text-xs mt-1 ${subColor}`}>Use at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <p className={`text-sm text-center mt-6 ${subColor}`}>
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
