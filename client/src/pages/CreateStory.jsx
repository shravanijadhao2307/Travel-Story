import { useState } from "react";
import { createStory } from "../services/storyService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaTimes,
  FaVideo,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";

export default function CreateStory() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    travelDate: "",
    images: [],
    videos: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(null); // "images" | "videos" | null
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    applyFiles(name, files);
  };

  // const applyFiles = (name, files) => {
  //   const fileArray = Array.from(files);
  //   setForm(prev => ({ ...prev, [name]: files }));

  //   if (name === "images") {
  //     const previews = fileArray.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
  //     setImagePreviews(previews);
  //   } else {
  //     const previews = fileArray.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
  //     setVideoPreviews(previews);
  //   }
  // };

  const applyFiles = (name, files) => {
    const fileArray = Array.from(files);

    setForm((prev) => {
      const existingFiles = Array.from(prev[name] || []);
      const combined = [...existingFiles, ...fileArray].slice(0, 5); // limit to 5

      return {
        ...prev,
        [name]: combined,
      };
    });

    if (name === "images") {
      const previews = fileArray.map((f) => ({
        url: URL.createObjectURL(f),
        name: f.name,
      }));

      setImagePreviews((prev) => [...prev, ...previews].slice(0, 5));
    } else {
      const previews = fileArray.map((f) => ({
        url: URL.createObjectURL(f),
        name: f.name,
      }));

      setVideoPreviews((prev) => [...prev, ...previews].slice(0, 2));
    }
  };

  // const removeImage = (idx) => {
  //   setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  // };

  const removeImage = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));

    setForm((prev) => {
      const updatedFiles = Array.from(prev.images).filter((_, i) => i !== idx);
      return { ...prev, images: updatedFiles };
    });
  };

  const removeVideo = (idx) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e, name) => {
    e.preventDefault();
    setDragOver(null);
    applyFiles(name, e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location_name", form.location);
      formData.append("travel_date", form.travelDate);
      for (let i = 0; i < form.images.length; i++)
        formData.append("images", form.images[i]);
      for (let i = 0; i < form.videos.length; i++)
        formData.append("videos", form.videos[i]);
      await createStory(formData);
      toast.success("Story created 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to create story");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filled = [
    form.title,
    form.description,
    form.location,
    form.travelDate,
  ].filter(Boolean).length;
  const progress = Math.round((filled / 4) * 100);

  return (
    <div className="min-h-screen bg-[#080b10] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus {
          border-color: rgba(251,191,36,0.5);
          background: rgba(255,255,255,0.07);
        }
        .input-field:hover { border-color: rgba(255,255,255,0.18); }

        textarea.input-field { resize: none; min-height: 130px; }

        input[type="date"].input-field::-webkit-calendar-picker-indicator {
          filter: invert(0.4);
          cursor: pointer;
        }

        .drop-zone {
          border: 2px dashed rgba(255,255,255,0.12);
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .drop-zone.active {
          border-color: rgba(251,191,36,0.5);
          background: rgba(251,191,36,0.05);
        }
        .drop-zone:hover {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.05);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.10s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.15s ease both; }
        .fade-up-4 { animation: fadeUp 0.5s 0.20s ease both; }
        .fade-up-5 { animation: fadeUp 0.5s 0.25s ease both; }
        .fade-up-6 { animation: fadeUp 0.5s 0.30s ease both; }
        .fade-up-7 { animation: fadeUp 0.5s 0.35s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(8,11,16,0.92)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="font-body flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors duration-200 group"
          >
            <FaArrowLeft
              size={13}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🧭</span>
            <span className="font-display text-lg font-bold text-white">
              Travel<span className="text-amber-400">Story</span>
            </span>
          </div>
        </div>

        <button
          form="story-form"
          type="submit"
          disabled={isSubmitting}
          className="font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 py-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
        >
          {isSubmitting ? "Publishing..." : "Publish Story 🚀"}
        </button>
      </nav>

      {/* ── Main layout ── */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* ── LEFT: Form ── */}
        <div className="col-span-12 lg:col-span-8">
          {/* Page header */}
          <div className="fade-up mb-6">
            <span className="font-body inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1 mb-3">
              ✈️ New Story
            </span>
            <h1 className="font-display text-4xl font-black text-white leading-tight">
              Share Your
              <span className="text-amber-400 italic"> Journey</span>
            </h1>
            <p className="font-body text-sm text-white/40 mt-2 font-light">
              Tell the world where you've been and what made it unforgettable.
            </p>
          </div>

          <form id="story-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="fade-up-1">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Story Title *
              </label>
              <input
                name="title"
                className="input-field text-base"
                placeholder="e.g. Lost in the streets of Kyoto..."
                onChange={handleChange}
                value={form.title}
                required
              />
            </div>

            {/* Description */}
            <div className="fade-up-2">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Your Experience *
              </label>
              <textarea
                name="description"
                className="input-field"
                placeholder="Describe your journey — the food, the people, the moments that stayed with you..."
                onChange={handleChange}
                value={form.description}
                required
              />
              <p className="font-body text-xs text-white/25 mt-1.5 text-right">
                {form.description.length} characters
              </p>
            </div>

            {/* Location + Date row */}
            <div className="fade-up-3 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                  Location *
                </label>
                <div className="relative">
                  {/* <FaMapMarkerAlt size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" /> */}
                  <input
                    name="location"
                    className="input-field pl-9"
                    placeholder="City, Country"
                    onChange={handleChange}
                    value={form.location}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                  Travel Date *
                </label>
                <div className="relative">
                  {/* <FaCalendarAlt size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" /> */}
                  <input
                    type="date"
                    name="travelDate"
                    className="input-field pl-9"
                    onChange={handleChange}
                    value={form.travelDate}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="fade-up-4">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Photos
              </label>
              <div
                className={`drop-zone p-6 text-center ${dragOver === "images" ? "active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver("images");
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(e, "images")}
                onClick={() => document.getElementById("image-input").click()}
              >
                <FaImage size={22} className="mx-auto text-white/20 mb-2" />
                <p className="font-body text-sm text-white/40">
                  Drag & drop photos or{" "}
                  <span className="text-amber-400 cursor-pointer">browse</span>
                </p>
                <p className="font-body text-xs text-white/20 mt-1">
                  JPG, PNG, WEBP supported
                </p>
                <input
                  id="image-input"
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-square"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <FaTimes size={11} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="fade-up-5">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Videos
              </label>
              <div
                className={`drop-zone p-6 text-center ${dragOver === "videos" ? "active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver("videos");
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(e, "videos")}
                onClick={() => document.getElementById("video-input").click()}
              >
                <FaVideo size={22} className="mx-auto text-white/20 mb-2" />
                <p className="font-body text-sm text-white/40">
                  Drag & drop videos or{" "}
                  <span className="text-amber-400 cursor-pointer">browse</span>
                </p>
                <p className="font-body text-xs text-white/20 mt-1">
                  MP4, MOV, AVI supported
                </p>
                <input
                  id="video-input"
                  type="file"
                  name="videos"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Video previews */}
              {videoPreviews.length > 0 && (
                <div className="space-y-2 mt-3">
                  {videoPreviews.map((vid, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <FaVideo size={14} className="text-amber-400 shrink-0" />
                      <span className="font-body text-sm text-white/60 truncate flex-1">
                        {vid.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVideo(idx)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile submit */}
            <div className="fade-up-6 lg:hidden pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-full py-3 transition-all duration-200 active:scale-95"
              >
                {isSubmitting ? "Publishing..." : "Publish Story 🚀"}
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT: Sidebar tips ── */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          {/* Progress card */}
          <div
            className="fade-up rounded-2xl p-5 sticky top-20"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p className="font-body text-xs text-white/35 uppercase tracking-wider mb-3">
              Story Completion
            </p>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-display text-3xl font-bold text-amber-400">
                {progress}%
              </span>
              <span className="font-body text-xs text-white/30 mb-1">
                complete
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {[
                { label: "Story title", done: !!form.title },
                { label: "Experience description", done: !!form.description },
                { label: "Location", done: !!form.location },
                { label: "Travel date", done: !!form.travelDate },
                { label: "Photos added", done: imagePreviews.length > 0 },
                { label: "Videos added", done: videoPreviews.length > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${item.done ? "bg-amber-400" : "border border-white/15"}`}
                  >
                    {item.done && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4L3 5.5L6.5 2"
                          stroke="#080b10"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`font-body text-xs transition-colors duration-200 ${item.done ? "text-white/70" : "text-white/30"}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Writing tips */}
          <div
            className="fade-up-1 rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="font-body text-xs text-white/35 uppercase tracking-wider mb-3">
              ✍️ Story Tips
            </p>
            <div className="space-y-3">
              {[
                {
                  emoji: "🎯",
                  tip: "Be specific — name the street, the dish, the moment.",
                },
                { emoji: "❤️", tip: "Share what surprised or moved you most." },
                {
                  emoji: "📸",
                  tip: "Add photos to make your story come alive.",
                },
                {
                  emoji: "🗺️",
                  tip: "Include the exact location for better discovery.",
                },
              ].map(({ emoji, tip }) => (
                <div key={tip} className="flex gap-2.5">
                  <span className="text-base shrink-0">{emoji}</span>
                  <p className="font-body text-xs text-white/40 leading-relaxed font-light">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Inspiration */}
          <div
            className="fade-up-2 rounded-2xl overflow-hidden relative"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop"
              alt="Travel inspiration"
              className="w-full h-36 object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="font-display text-sm font-bold text-white leading-snug italic">
                "Every journey deserves to be remembered."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
[];
