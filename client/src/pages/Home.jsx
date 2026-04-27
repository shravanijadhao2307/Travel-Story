import { useState, useEffect, useRef } from "react";
import img1 from "../assets/images/home_01.jpg";
import img2 from "../assets/images/home_02.jpg";
import img3 from "../assets/images/home_03.jpg";
import img4 from "../assets/images/home_04.jpg";
import img5 from "../assets/images/home_05.jpg";
import img6 from "../assets/images/home_06.jpg";
import img7 from "../assets/images/home_07.jpg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 0,
    tag: "🌏 Asia",
    title: "Lost in the Streets of Kyoto",
    author: "Priya Sharma",
    desc: "Narrow alleys, lantern light, and matcha at every turn — a solo traveller's dream captured frame by frame.",
    food: "Matcha ice cream, Ramen, Takoyaki",
    image: img1,
  },
  {
    id: 1,
    tag: "🏔️ Europe",
    title: "Sunrise Over the Dolomites",
    author: "Marco Bianchi",
    desc: "Hiking at 4am with nothing but a headlamp and hope — rewarded by the most breathtaking golden hour of my life.",
    food: "Canederli, Strudel, Speck",
    image: img2,
  },

  {
    id: 2,
    tag: "🌊 South Asia",
    title: "Hidden Lagoons of Sri Lanka",
    author: "Asel Fernando",
    desc: "A rented tuk-tuk, no map, and a lagoon so blue it looked photoshopped — real travel is always unplanned.",
    food: "Kottu Roti, Hoppers, King Coconut",
    image: img3,
  },
  {
    id: 3,
    tag: "🌵 Americas",
    title: "Desert Silence in Patagonia",
    author: "Lucia Mendez",
    desc: "Days without phone signal, nights under the Milky Way — Patagonia strips away everything unnecessary.",
    food: "Asado, Empanadas, Mate",
    image: img4,
  },
];

const DURATION = 5000;

export default function Home() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startRef = useRef(null);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(((idx % slides.length) + slides.length) % slides.length);
      setAnimating(false);
    }, 400);
    resetProgress();
  };

  const resetProgress = () => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(progressRef.current);
    setProgress(0);
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      resetProgress();
    }, DURATION);
  };

  useEffect(() => {
    startRef.current = performance.now();
    resetProgress();
    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(progressRef.current);
    };
  }, []);

  const slide = slides[current];

  return (
    <div className="relative min-h-screen bg-[#080b10] text-white overflow-hidden font-sans">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        .slide-enter { animation: slideIn 0.5s ease forwards; }
        .slide-exit { animation: slideOut 0.4s ease forwards; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b10] via-[#080b10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b10]/90 via-transparent to-[#080b10]/30" />
      </div>

      {/* ── Navbar ── */}
      <nav className="font-body relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧭</span>
          <span className="font-display text-xl font-bold tracking-tight">
            Travel<span className="text-amber-400">Story</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60 font-medium">
          {["Explore", "Stories", "Destinations", "Community"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/register")}
            className="font-body text-sm font-medium text-white/80 border border-white/20 hover:border-white/40 hover:text-white rounded-full px-5 py-2 transition-all duration-200 backdrop-blur-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 rounded-full px-5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-400/30 active:scale-95"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <div className="relative z-10 px-8 pt-12 pb-32 max-w-2xl">
        <div
          key={current}
          className={`font-body ${animating ? "slide-exit" : "slide-enter"}`}
        >
          {/* Tag */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1 mb-6">
            {slide.tag}
          </span>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-4 text-white">
            {slide.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-amber-400/30 flex items-center justify-center text-xs text-amber-300 font-medium">
              {slide.author[0]}
            </div>
            <span className="text-sm text-white/50">by</span>
            <span className="text-sm text-white/80 font-medium">
              {slide.author}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-white/55 leading-relaxed mb-6 max-w-lg font-light">
            {slide.desc}
          </p>

          {/* Food tag */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-lg">🍽️</span>
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Local Eats:
            </span>
            <span className="text-sm text-white/65">{slide.food}</span>
          </div>

          {/* CTA */}
          <button className="font-body inline-flex items-center gap-2 text-sm font-medium text-white bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/35 rounded-full px-6 py-3 transition-all duration-200 backdrop-blur-sm">
            Read Full Story
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M7 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Slide Thumbnails (bottom right) ── */}
      <div className="font-body absolute bottom-10 right-8 z-20 flex gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              i === current
                ? "border-amber-400 scale-105"
                : "border-white/10 opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            {i === current && (
              <div className="absolute inset-0 bg-amber-400/20" />
            )}
          </button>
        ))}
      </div>

      {/* ── Dot Indicators ── */}
      <div className="absolute bottom-10 left-8 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-amber-400"
                : "w-2 h-2 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* ── Progress Bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
        <div
          className="h-full bg-amber-400 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Arrow Controls ── */}
      <div className="absolute bottom-20 left-8 z-20 flex gap-2">
        <button
          onClick={() => goTo(current - 1)}
          className="w-9 h-9 rounded-full bg-white/8 border border-white/15 flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400/40 transition-all duration-200"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="w-9 h-9 rounded-full bg-white/8 border border-white/15 flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400/40 transition-all duration-200"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2l5 5-5 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Stats Strip ── */}
      {/* <div className="font-body absolute bottom-0 left-0 right-0 z-10">
        <div className="flex items-center justify-center gap-12 py-4 bg-white/[0.03] border-t border-white/8 backdrop-blur-sm">
          {[
            { label: "Stories Shared", value: "12,400+" },
            { label: "Countries Covered", value: "94" },
            { label: "Active Travellers", value: "38K+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-base font-semibold text-amber-400">{stat.value}</div>
              <div className="text-xs text-white/35 mt-0.5 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
