import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCamera,
  FaTimes,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";

export default function EditProfile() {
  const { user, updateUser } = useAuth();

  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: null,
  });

  // const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const [avatarPreview, setAvatarPreview] = useState(
    user?.profile_pic
      ? `http://localhost:5000/uploads/${user.profile_pic}`
      : null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && (!user || storedUser._id !== user._id)) {
    updateUser(storedUser);
  }
}, []);

  useEffect(() => {
     console.log("USER DATA:", user);
    if (user?.id) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        avatar: null,
      });

      setAvatarPreview(
        user.profile_pic
          ? `http://localhost:5000/uploads/${user.profile_pic}`
          : null,
      );
    }
  }, [user?.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyAvatar = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setForm((prev) => ({ ...prev, avatar: file }));
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e) => {
    applyAvatar(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyAvatar(e.dataTransfer.files[0]);
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setForm((prev) => ({ ...prev, avatar: null }));
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("USER:", user);

    const userId = user?._id || user?.id;

    if (!userId) {
      console.error("User ID missing:", user);
      toast.error("User not found. Please login again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("bio", form.bio);

      //  console.log("USER OBJECT:", user);
      // console.log("USER ID:", userId);
      // console.log(
      //   "FINAL URL:",
      //   `http://localhost:5000/api/users/update/${userId}`,
      // );

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/update/${userId}`, // ✅ FIXED
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("API RESPONSE USER:", res.data.user);
      // updateUser(res.data.user);
      updateUser({
        ...user,
        ...res.data.user,
      });
      toast.success("Profile updated ✨");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to update profile");
    }
  };

  const filled = [form.name, form.bio, avatarPreview].filter(Boolean).length;
  const progress = Math.round((filled / 3) * 100);

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

        {/* <button
          form="edit-profile-form"
          type="submit"
          disabled={isSubmitting}
          className="font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-5 py-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
        >
          {isSubmitting ? "Saving..." : "Save Changes ✨"}
        </button> */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 🔥 ADD THIS BUTTON HERE */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-full py-3"
          >
            {isSubmitting ? "Saving..." : "Save Changes ✨"}
          </button>
        </form>
      </nav>

      {/* ── Main layout ── */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* ── LEFT: Form ── */}
        <div className="col-span-12 lg:col-span-8">
          {/* Page header */}
          <div className="fade-up mb-6">
            <span className="font-body inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1 mb-3">
              👤 Edit Profile
            </span>
            <h1 className="font-display text-4xl font-black text-white leading-tight">
              Update Your
              <span className="text-amber-400 italic"> Identity</span>
            </h1>
            <p className="font-body text-sm text-white/40 mt-2 font-light">
              Let the world know the traveller behind the stories.
            </p>
          </div>

          <form
            id="edit-profile-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Avatar Upload */}
            <div className="fade-up-1">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Profile Photo
              </label>

              {avatarPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-400/40">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={16} className="text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="font-body text-sm text-white/60">
                      Looking great!
                    </p>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="font-body text-xs text-amber-400 hover:text-amber-300 mt-1 transition-colors"
                    >
                      Change photo →
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`drop-zone p-6 text-center ${dragOver ? "active" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <FaCamera size={22} className="mx-auto text-white/20 mb-2" />
                  <p className="font-body text-sm text-white/40">
                    Drag & drop your photo or{" "}
                    <span className="text-amber-400 cursor-pointer">
                      browse
                    </span>
                  </p>
                  <p className="font-body text-xs text-white/20 mt-1">
                    JPG, PNG, WEBP supported
                  </p>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div className="fade-up-2">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Display Name *
              </label>
              <div className="relative">
                <input
                  name="name"
                  className="input-field"
                  placeholder="e.g. Alex Wanderer"
                  onChange={handleChange}
                  value={form.name}
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="fade-up-3">
              <label className="block font-body text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                className="input-field"
                placeholder="Tell fellow travellers who you are — where you've been, what drives you to explore..."
                onChange={handleChange}
                value={form.bio}
              />
              <p className="font-body text-xs text-white/25 mt-1.5 text-right">
                {form.bio.length} characters
              </p>
            </div>

            {/* Mobile submit */}
            <div className="fade-up-4 lg:hidden pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-full py-3 transition-all duration-200 active:scale-95"
              >
                {isSubmitting ? "Saving..." : "Save Changes ✨"}
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT: Sidebar ── */}
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
              Profile Completion
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
                { label: "Display name", done: !!form.name },
                { label: "Bio written", done: !!form.bio },
                { label: "Photo uploaded", done: !!avatarPreview },
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

          {/* Profile tips */}
          <div
            className="fade-up-1 rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="font-body text-xs text-white/35 uppercase tracking-wider mb-3">
              ✍️ Profile Tips
            </p>
            <div className="space-y-3">
              {[
                {
                  emoji: "🌍",
                  tip: "Mention the regions you love to explore most.",
                },
                {
                  emoji: "📸",
                  tip: "A clear face photo builds trust with readers.",
                },
                {
                  emoji: "✈️",
                  tip: "Share how many countries you've visited.",
                },
                {
                  emoji: "💬",
                  tip: "Keep your bio warm — write how you'd speak.",
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

          {/* Inspiration image */}
          <div
            className="fade-up-2 rounded-2xl overflow-hidden relative"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop"
              alt="Travel inspiration"
              className="w-full h-36 object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="font-display text-sm font-bold text-white leading-snug italic">
                "Your story begins with who you are."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
