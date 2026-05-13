import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/home_06.jpg"; 

// Replace with your own image: import loginBg from "../assets/images/login-bg.jpg";
const BG_IMAGE =
  loginBg;

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const quotes = [
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
];

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

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
          padding: 11px 14px;
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
        .input-field:hover { border-color: rgba(255,255,255,0.22); }

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
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        .anim-left   { animation: fadeLeft  0.7s ease both; }
        .anim-right  { animation: fadeRight 0.7s ease both; }
        .anim-up-1   { animation: fadeUp 0.55s 0.10s ease both; }
        .anim-up-2   { animation: fadeUp 0.55s 0.20s ease both; }
        .anim-up-3   { animation: fadeUp 0.55s 0.30s ease both; }
        .anim-up-4   { animation: fadeUp 0.55s 0.40s ease both; }
        .pulse-slow  { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt="Travel background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#080b10]/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b10]/30 via-[#080b10]/55 to-[#080b10]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10]/80 via-transparent to-[#080b10]/30" />
      </div>

      {/* ── Logo ── */}
      <div className="absolute top-6 left-8 z-20 flex items-center gap-2">
        <span className="text-2xl">🧭</span>
        <Link to="/" className="font-display text-xl font-bold text-white tracking-tight">
          Travel<span className="text-amber-400">Story</span>
        </Link>
      </div>

      {/* ── Back to Home ── */}
      <div className="absolute top-16 left-8 z-20">
        <Link
          to="/"
          className="font-body flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors duration-200 group"
        >
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="group-hover:-translate-x-1 transition-transform duration-200"
          >
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* ══════════════════════════════════════════
          LEFT — Inspirational travel copy
      ══════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col justify-center w-1/2 px-12 lg:px-20 pt-24 pb-12">
        <div className="anim-left max-w-lg">

          {/* Eyebrow */}
          {/* <span className="font-body inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1 mb-8">
            🌍 &nbsp;Welcome Back Explorer
          </span> */}

          {/* Big headline */}
          <h1 className="font-display text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
            Your Next
            <br />
            Adventure
            <br />
            <span className="text-amber-400 italic">Awaits.</span>
          </h1>

          <p className="font-body text-base text-white/50 font-light leading-relaxed mb-12 max-w-sm">
            Log back in and continue where you left off. New stories, new destinations,
            and a community of explorers waiting for you.
          </p>

          {/* Quote card */}
          <div
            className="rounded-2xl p-6 max-w-sm pulse-slow"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="text-amber-400 text-3xl font-display leading-none mb-3">"</div>
            <p className="font-body text-sm text-white/70 font-light leading-relaxed italic mb-4">
              {randomQuote.text}
            </p>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-body text-xs text-white/35 tracking-wide">
                — {randomQuote.author}
              </span>
            </div>
          </div>

          {/* Destination pills */}
          <div className="flex flex-wrap gap-2 mt-10">
            {["🗼 Paris", "🌸 Kyoto", "🏔️ Patagonia", "🌊 Maldives", "🌵 Sahara"].map((place) => (
              <span
                key={place}
                className="font-body text-xs text-white/45 border border-white/10 rounded-full px-3 py-1.5 hover:border-amber-400/40 hover:text-amber-400 transition-all duration-200 cursor-default"
              >
                {place}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Login form
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
          {/* Card header */}
          <div className="mb-8 flex" gap-7>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4">
              🗺️
            </div>
            <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Welcome back
            </h2>
            <p className="font-body text-sm text-white/40 mt-1 font-light">
              Sign in to continue your journey
            </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="font-body space-y-5">

            {/* Email */}
            <div className="anim-up-1">
              <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wider uppercase">
                Email
              </label>
              <input
                {...register("email")}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="anim-up-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-white/50 tracking-wider uppercase">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/65 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="anim-up-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-amber-400 rounded"
              />
              <label
                htmlFor="remember"
                className="text-xs text-white/40 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <div className="anim-up-4 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-medium text-sm text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
              >
                {isSubmitting ? "Signing in..." : "Log In →"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="font-body text-xs text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Register link */}
          <p className="font-body text-sm text-center text-white/40">
            New to Travel Story?{" "}
            <Link
              to="/register"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Trust badge */}
        <p className="font-body text-center text-xs text-white/20 mt-4 w-full max-w-md">
          🔒 Secured login · Your privacy is our priority
        </p>
      </div>
    </div>
  );
}
