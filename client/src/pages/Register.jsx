import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";
import RegisterVideo from "../assets/videos/register_vdo.mp4";

// ── Replace this with your own travel video in assets ──
// import travelVideo from "../assets/videos/travel-bg.mp4";
// For now using a free travel video from a public CDN:
const VIDEO_SRC = RegisterVideo;
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

const checkStrength = (password) => {
  if (!password || password.length < 6) return "Weak";
  if (password.match(/^(?=.*[A-Z])(?=.*[0-9])/)) return "Strong";
  return "Medium";
};

const strengthConfig = {
  Weak: { color: "text-red-400", bar: "w-1/3 bg-red-400" },
  Medium: { color: "text-amber-400", bar: "w-2/3 bg-amber-400" },
  Strong: { color: "text-emerald-400", bar: "w-full bg-emerald-400" },
};

const stats = [
  { value: "12K+", label: "Stories Shared" },
  { value: "94", label: "Countries" },
  { value: "38K+", label: "Travellers" },
];

const highlights = [
  "🍜 Share local food experiences",
  "📸 Upload photos & videos",
  "🗺️ Discover hidden destinations",
  "🤝 Connect with fellow explorers",
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Registration successful 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const sConfig = strengthConfig[strength] || strengthConfig["Weak"];

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#080b10]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.28); }
        .input-field:focus {
          border-color: rgba(251,191,36,0.55);
          background: rgba(255,255,255,0.09);
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-left  { animation: fadeLeft  0.7s ease both; }
        .anim-right { animation: fadeRight 0.7s ease both; }
        .anim-up-1  { animation: fadeUp 0.55s 0.10s ease both; }
        .anim-up-2  { animation: fadeUp 0.55s 0.18s ease both; }
        .anim-up-3  { animation: fadeUp 0.55s 0.26s ease both; }
        .anim-up-4  { animation: fadeUp 0.55s 0.34s ease both; }
        .anim-up-5  { animation: fadeUp 0.55s 0.42s ease both; }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.55);
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 300;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
        }
        .highlight-item:hover { color: rgba(255,255,255,0.9); }
        .highlight-item:last-child { border-bottom: none; }
      `}</style>

      {/* ── Video Background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-[#080b10]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080b10]/30 via-[#080b10]/50 to-[#080b10]/88" />

      {/* ── Logo ── */}
      <div className="absolute top-6 left-8 z-20 flex items-center gap-2">
        <span className="text-2xl">🧭</span>
        <Link
          to="/"
          className="font-display text-xl font-bold text-white tracking-tight"
        >
          Travel<span className="text-amber-400">Story</span>
        </Link>
      </div>

      {/* ── Back to Home ── */}
      <div className="absolute top-16 left-8 z-20">
        <Link
          to="/"
          className="font-body flex items-center gap-2 text-sm text-white/55 hover:text-amber-400 transition-colors duration-200 group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="group-hover:-translate-x-1 transition-transform duration-200"
          >
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* ══════════════════════════════════════════
          LEFT — Bold travel copy
      ══════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col justify-center w-1/2 px-12 lg:px-20 pt-24 pb-12">
        <div className="anim-left max-w-lg">
          <span className="font-body inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1 mb-6">
            ✈️ &nbsp;Join the Community
          </span>

          <h1 className="font-display text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
            The World
            <br />
            is Your
            <br />
            <span className="text-amber-400 italic">Story.</span>
          </h1>

          <p className="font-body text-base text-white/50 font-light leading-relaxed mb-10 max-w-sm">
            Every journey has a tale worth telling. Share your adventures,
            discover hidden gems, and inspire the next generation of explorers.
          </p>

          <div className="mb-10">
            {highlights.map((item, i) => (
              <div key={i} className="highlight-item">
                {item}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-10">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-2xl font-bold text-amber-400">
                  {s.value}
                </div>
                <div className="font-body text-xs text-white/35 tracking-wide mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Register form
      ══════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col justify-center items-end w-1/2 px-8 lg:px-16 py-24">
        <div
          className="anim-right w-full max-w-md rounded-2xl p-8"
          style={{
            background: "rgba(8,11,16,0.80)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Create your account
            </h2>
            <p className="font-body text-sm text-white/40 mt-1 font-light">
              Start sharing your travel stories today
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="font-body space-y-4"
          >
            {/* Full Name */}
            <div className="anim-up-1">
              <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wider uppercase">
                Full Name
              </label>
              <input
                {...register("name")}
                className="input-field"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="anim-up-2">
              <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wider uppercase">
                Email
              </label>
              <input
                {...register("email")}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="anim-up-3">
              <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="input-field pr-10"
                  placeholder="Create a password"
                  onChange={(e) => setStrength(checkStrength(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/65 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={13} />
                  ) : (
                    <FaEye size={13} />
                  )}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${sConfig.bar}`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${sConfig.color}`}>
                    Strength: {strength}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="anim-up-4">
              <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wider uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="input-field pr-10"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/65 transition-colors"
                >
                  {showConfirm ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="anim-up-5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-medium text-sm text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
              >
                {isSubmitting ? "Creating account..." : "Create Account 🚀"}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="font-body text-xs text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="font-body text-sm text-center text-white/40">
            Already exploring?{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>

        <p className="font-body text-center text-xs text-white/20 mt-4 w-full max-w-md">
          🔒 Your data is safe · No spam ever
        </p>
      </div>
    </div>
  );
}
