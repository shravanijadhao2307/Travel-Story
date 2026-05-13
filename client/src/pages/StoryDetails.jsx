import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStoryById } from "../services/storyService";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaHeart, FaRegHeart,
  FaRegComment, FaShare, FaBookmark, FaRegBookmark,
  FaArrowLeft, FaExpand, FaTimes, FaChevronLeft, FaChevronRight,
  FaPlay
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

// ── helpers ──────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

const AVATAR_COLORS = ["bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-rose-500", "bg-violet-500"];
function getAvatarColor(name = "") {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

// ── Lightbox ─────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const location = useLocation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <FaTimes size={22} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-sm text-white/50">
        {idx + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <FaChevronLeft size={14} />
        </button>
      )}

      {/* Image */}
      <img
        src={images[idx]}
        alt={`Photo ${idx + 1}`}
        className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-10"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <FaChevronRight size={14} />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              className={`w-12 h-8 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-amber-400 opacity-100" : "border-transparent opacity-40 hover:opacity-70"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Image Gallery ─────────────────────────────────────
function ImageGallery({ images, onOpen }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative group rounded-2xl overflow-hidden cursor-pointer mb-6" onClick={() => onOpen(0)}>
        <img src={images[0]} alt="Story" className="w-full max-h-[480px] object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <FaExpand size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 mb-6 rounded-2xl overflow-hidden">
        {images.map((img, i) => (
          <div key={i} className="relative group cursor-pointer aspect-square" onClick={() => onOpen(i)}>
            <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
              <FaExpand size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-3 gap-2 mb-6 rounded-2xl overflow-hidden">
        <div className="relative group cursor-pointer col-span-2 aspect-video" onClick={() => onOpen(0)}>
          <img src={images[0]} alt="Photo 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
        </div>
        <div className="flex flex-col gap-2">
          {images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative group cursor-pointer flex-1" onClick={() => onOpen(i + 1)}>
              <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4+ images
  return (
    <div className="grid grid-cols-4 gap-2 mb-6 rounded-2xl overflow-hidden">
      <div className="relative group cursor-pointer col-span-2 row-span-2 aspect-square" onClick={() => onOpen(0)}>
        <img src={images[0]} alt="Photo 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
      </div>
      {images.slice(1, 4).map((img, i) => (
        <div key={i} className="relative group cursor-pointer aspect-square" onClick={() => onOpen(i + 1)}>
          <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
          {i === 2 && images.length > 4 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-white">+{images.length - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────
export default function StoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [liked, setLiked]         = useState(false);
  const [saved, setSaved]         = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [lightbox, setLightbox]   = useState({ open: false, index: 0 });
  const [comment, setComment]     = useState("");
  const [comments, setComments]   = useState([]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await getStoryById(id);
        setStory(res.data);
        setLikeCount(res.data.likes || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { text: comment, time: "Just now", author: "You" }]);
    setComment("");
  };

  // Build image URLs from DB response
  // Adjust the path based on how your backend serves images

  
  // const getImageUrl = (imgPath) => {
  //   if (!imgPath) return null;
  //   if (imgPath.startsWith("http")) return imgPath;
  //   return `http://localhost:5000/${imgPath.replace(/\\/g, "/")}`;
  // };

  const getImageUrl = (img) => {
  if (!img) return null;

  // If it's an object extract path
  const raw = typeof img === "object" ? (img.path || img.url || img.filename || "") : String(img);

  // Remove PostgreSQL array curly braces and quotes if present
  const clean = raw
    .replace(/^\{/, "")      // remove leading {
    .replace(/\}$/, "")      // remove trailing }
    .replace(/^"/, "")       // remove leading "
    .replace(/"$/, "")       // remove trailing "
    .replace(/\\/g, "/");    // fix backslashes

  if (!clean) return null;

  // Already a full URL
  if (clean.startsWith("http")) return clean;

  // If it starts with uploads/ use as-is
  if (clean.startsWith("uploads/")) {
    return `http://localhost:5000/${clean}`;
  }

  // Otherwise it's just a filename — prepend uploads path
  return `http://localhost:5000/uploads/${clean}`;
};

  const getVideoUrl = (vidPath) => {
    if (!vidPath) return null;
    if (vidPath.startsWith("http")) return vidPath;
    return `http://localhost:5000/${vidPath.replace(/\\/g, "/")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-white/40">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#080b10] flex items-center justify-center text-center">
        <div>
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="font-display text-2xl text-white mb-2">Story not found</h2>
          <p className="font-body text-sm text-white/40 mb-6">This story may have been removed.</p>
          <button onClick={() => navigate(location.state?.from || "/dashboard")} className="font-body text-sm bg-amber-400 text-[#080b10] rounded-full px-6 py-2.5">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const authorName  = story.author?.name || story.authorName || "Traveller";
  const initials    = authorName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const imageUrls   = (story.images || []).map(getImageUrl).filter(Boolean);
  const videoUrls   = (story.videos || []).map(getVideoUrl).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#080b10] text-white">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        textarea.comment-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          padding: 10px 14px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          resize: none;
          width: 100%;
          transition: border-color 0.2s;
        }
        textarea.comment-input::placeholder { color: rgba(255,255,255,0.25); }
        textarea.comment-input:focus { border-color: rgba(251,191,36,0.5); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s 0.08s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.16s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.24s ease both; }
      `}</style>

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(8,11,16,0.92)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="font-body flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors group"
          >
            <FaArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Feed
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🧭</span>
            <Link to="/dashboard" className="font-display text-lg font-bold text-white">
              Travel<span className="text-amber-400">Story</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-body font-medium border rounded-full px-4 py-2 transition-all duration-200 ${liked ? "text-red-400 border-red-400/30 bg-red-400/10" : "text-white/50 border-white/15 hover:border-white/30"}`}
          >
            {liked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
            {likeCount}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-2 text-sm font-body font-medium border rounded-full px-4 py-2 transition-all duration-200 ${saved ? "text-amber-400 border-amber-400/30 bg-amber-400/10" : "text-white/50 border-white/15 hover:border-white/30"}`}
          >
            {saved ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
            Save
          </button>
          <button className="flex items-center gap-2 text-sm font-body font-medium text-white/50 border border-white/15 hover:border-white/30 rounded-full px-4 py-2 transition-all duration-200">
            <FaShare size={13} />
            Share
          </button>
        </div>
      </nav>

      {/* ── Hero Image (first image as banner) ── */}
      {imageUrls.length > 0 && (
        <div className="relative w-full h-72 overflow-hidden">
          <img
            src={imageUrls[0]}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/40 to-transparent" />
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">

        {/* ── Story Content (left/main) ── */}
        <article className="col-span-12 lg:col-span-8">

          {/* Title + meta */}
          <div className="fade-up mb-6">
            {story.location && (
              <div className="flex items-center gap-1.5 mb-3">
                <FaMapMarkerAlt size={12} className="text-amber-400" />
                <span className="font-body text-sm text-amber-400">{story.location_name || story.location}</span>
              </div>
            )}
            <h1 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              {story.title}
            </h1>

            {/* Author + date row */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${getAvatarColor(authorName)}`}>
                {initials}
              </div>
              <div>
                <p className="font-body text-sm font-medium text-white">{authorName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {story.travel_date && (
                    <>
                      <FaCalendarAlt size={9} className="text-white/30" />
                      <span className="font-body text-xs text-white/35">
                        {new Date(story.travel_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="text-white/20 text-xs">·</span>
                    </>
                  )}
                  <span className="font-body text-xs text-white/35">{timeAgo(story.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {story.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 fade-up-1">
              {story.tags.map(tag => (
                <span key={tag} className="font-body text-xs text-amber-400/70 bg-amber-400/8 border border-amber-400/15 rounded-full px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div
            className="fade-up-1 rounded-2xl p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body text-base text-white/70 leading-relaxed font-light whitespace-pre-line">
              {story.description}
            </p>
          </div>

          {/* ── Photo Gallery ── */}
          {imageUrls.length > 0 && (
            <div className="fade-up-2 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📸</span>
                <h2 className="font-body text-sm font-medium text-white/50 uppercase tracking-wider">
                  Photos · {imageUrls.length}
                </h2>
              </div>
              <ImageGallery images={imageUrls} onOpen={(i) => setLightbox({ open: true, index: i })} />
            </div>
          )}

          {/* ── Videos ── */}
          {videoUrls.length > 0 && (
            <div className="fade-up-2 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🎬</span>
                <h2 className="font-body text-sm font-medium text-white/50 uppercase tracking-wider">
                  Videos · {videoUrls.length}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {videoUrls.map((url, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <video
                      controls
                      className="w-full max-h-80 object-cover bg-black"
                      src={url}
                    >
                      Your browser does not support video.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Action bar ── */}
          <div
            className="fade-up-3 flex items-center gap-2 p-3 rounded-2xl mb-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={handleLike}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 ${liked ? "text-red-400 bg-red-400/10" : "text-white/45 hover:text-white/70 hover:bg-white/5"}`}
            >
              {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              {liked ? "Liked" : "Like"} {likeCount > 0 && `· ${likeCount}`}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all duration-200">
              <FaRegComment size={14} />
              Comment
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium text-white/45 hover:text-white/70 hover:bg-white/5 transition-all duration-200">
              <FaShare size={13} />
              Share
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${saved ? "text-amber-400 bg-amber-400/10" : "text-white/45 hover:text-amber-400 hover:bg-amber-400/5"}`}
            >
              {saved ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
            </button>
          </div>

          {/* ── Comments ── */}
          <div className="fade-up-3">
            <h3 className="font-body text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              💬 Comments {comments.length > 0 && `· ${comments.length}`}
            </h3>

            {/* Add comment */}
            <div className="flex gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                ME
              </div>
              <div className="flex-1">
                <textarea
                  className="comment-input"
                  placeholder="Share your thoughts about this story..."
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
                />
                {comment.trim() && (
                  <button
                    onClick={handleComment}
                    className="mt-2 font-body text-xs font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 rounded-full px-4 py-1.5 transition-all duration-200"
                  >
                    Post Comment
                  </button>
                )}
              </div>
            </div>

            {/* Comment list */}
            {comments.length > 0 && (
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {c.author[0]}
                    </div>
                    <div
                      className="flex-1 rounded-xl px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-body text-xs font-medium text-white">{c.author}</span>
                        <span className="font-body text-xs text-white/30">{c.time}</span>
                      </div>
                      <p className="font-body text-sm text-white/60 font-light">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {comments.length === 0 && (
              <div className="text-center py-8 rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
                <p className="font-body text-sm text-white/25">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </article>

        {/* ── Right Sidebar ── */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-20 space-y-4">

            {/* Author card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="h-14 bg-gradient-to-r from-amber-500/30 to-orange-600/30" />
              <div className="px-5 pb-5 -mt-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-[#080b10] mb-3 ${getAvatarColor(authorName)}`}>
                  {initials}
                </div>
                <p className="font-body text-sm font-medium text-white">{authorName}</p>
                <p className="font-body text-xs text-white/40 mt-0.5 font-light">Travel Storyteller</p>
                <button className="mt-3 w-full font-body text-xs font-medium text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 rounded-full py-2 transition-all duration-200">
                  Follow
                </button>
              </div>
            </div>

            {/* Trip details */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-4">Trip Details</p>
              <div className="space-y-3">
                {(story.location_name || story.location) && (
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-body text-xs text-white/30">Location</p>
                      <p className="font-body text-sm text-white/75">{story.location_name || story.location}</p>
                    </div>
                  </div>
                )}
                {story.travel_date && (
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-body text-xs text-white/30">Travel Date</p>
                      <p className="font-body text-sm text-white/75">
                        {new Date(story.travel_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
                {imageUrls.length > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 text-sm shrink-0">📸</span>
                    <div>
                      <p className="font-body text-xs text-white/30">Photos</p>
                      <p className="font-body text-sm text-white/75">{imageUrls.length} photos shared</p>
                    </div>
                  </div>
                )}
                {videoUrls.length > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 text-sm shrink-0">🎬</span>
                    <div>
                      <p className="font-body text-xs text-white/30">Videos</p>
                      <p className="font-body text-sm text-white/75">{videoUrls.length} videos shared</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-3">Story Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Likes",    value: likeCount,           emoji: "❤️" },
                  { label: "Comments", value: comments.length,     emoji: "💬" },
                  { label: "Photos",   value: imageUrls.length,    emoji: "📸" },
                  { label: "Videos",   value: videoUrls.length,    emoji: "🎬" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="text-lg mb-0.5">{stat.emoji}</div>
                    <p className="font-display text-lg font-bold text-amber-400">{stat.value}</p>
                    <p className="font-body text-xs text-white/30 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* ── Lightbox ── */}
      {lightbox.open && (
        <Lightbox
          images={imageUrls}
          startIndex={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
        />
      )}
    </div>
  );
}
