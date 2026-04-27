import { useEffect, useState } from "react";
import { getStories, deleteStory } from "../services/storyService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaRegComment, FaShare, FaBookmark, FaRegBookmark, FaEllipsisH, FaMapMarkerAlt, FaPlus, FaCompass, FaHome, FaBell, FaUser, FaSearch, FaTrash, FaEdit } from "react-icons/fa";

// ── Placeholder data for UI when no stories exist ──
const SAMPLE_STORIES = [
  {
    _id: "s1",
    title: "Golden Hour in Santorini",
    description: "Watched the sun melt into the Aegean Sea from a clifftop in Oia. The sky turned every shade of orange and pink — nothing I'd ever seen before. The locals were calm, the wine was cold, and time just... stopped.",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop",
    author: { name: "Priya Sharma", avatar: "PS" },
    likes: 248,
    comments: 34,
    createdAt: "2025-04-20",
    tags: ["sunset", "greece", "europe"],
    isSample: true,
  },
  {
    _id: "s2",
    title: "Street Food Trail in Bangkok",
    description: "Pad Thai from a cart at 11pm, mango sticky rice at midnight, and tom yum soup for breakfast. Bangkok doesn't sleep and neither did I. Every corner had something new, spicy, and absolutely unforgettable.",
    location: "Bangkok, Thailand",
    image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800&auto=format&fit=crop",
    author: { name: "Marco Bianchi", avatar: "MB" },
    likes: 192,
    comments: 51,
    createdAt: "2025-04-18",
    tags: ["food", "thailand", "streetfood"],
    isSample: true,
  },
  {
    _id: "s3",
    title: "Into the Misty Himalayas",
    description: "Day 7 of the Annapurna Circuit. My legs were done but my soul was full. Above the clouds, with only prayer flags and silence around me, I finally understood why people keep coming back to these mountains.",
    location: "Annapurna, Nepal",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop",
    author: { name: "Asel Fernando", avatar: "AF" },
    likes: 317,
    comments: 62,
    createdAt: "2025-04-15",
    tags: ["hiking", "nepal", "mountains"],
    isSample: true,
  },
];

const AVATAR_COLORS = [
  "bg-amber-500", "bg-emerald-500", "bg-sky-500",
  "bg-rose-500", "bg-violet-500", "bg-orange-500",
];

function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ── Story Card ──────────────────────────────────────
function StoryCard({ story, onDelete, onView, isOwner }) {
  const [liked, setLiked]       = useState(false);
  const [saved, setSaved]       = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes || 0);
  const [showMenu, setShowMenu] = useState(false);
  const storyId = story._id || story.id;
  const authorName = story.author?.name || story.authorName || "Traveller";
  const initials = authorName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden mb-5 transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white font-body ${getAvatarColor(authorName)}`}>
            {initials}
          </div>
          <div>
            <p className="font-body text-sm font-medium text-white">{authorName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {story.location && (
                <>
                  <FaMapMarkerAlt size={9} className="text-amber-400" />
                  <span className="font-body text-xs text-white/40">{story.location}</span>
                  <span className="text-white/20 text-xs">·</span>
                </>
              )}
              <span className="font-body text-xs text-white/35">{timeAgo(story.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white/30 hover:text-white/70 p-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <FaEllipsisH size={13} />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-8 rounded-xl py-1 z-20 min-w-[130px]"
              style={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <button
                onClick={() => { onView(storyId); setShowMenu(false); }}
                className="font-body w-full text-left px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                <FaCompass size={11} /> View Story
              </button>
              {isOwner && (
                <>
                  <button className="font-body w-full text-left px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2">
                    <FaEdit size={11} /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(storyId); setShowMenu(false); }}
                    className="font-body w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                  >
                    <FaTrash size={11} /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Story Content */}
      <div className="px-5 pb-3">
        <h2 className="font-display text-lg font-bold text-white mb-2 leading-snug">
          {story.title}
        </h2>
        <p className="font-body text-sm text-white/55 leading-relaxed line-clamp-3 font-light">
          {story.description}
        </p>

        {/* Tags */}
        {story.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {story.tags.map(tag => (
              <span key={tag} className="font-body text-xs text-amber-400/70 bg-amber-400/8 border border-amber-400/15 rounded-full px-2.5 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Story Image */}
      {story.image && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden" style={{ maxHeight: 320 }}>
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
            onClick={() => onView(storyId)}
          />
        </div>
      )}

      {/* Stats row */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-base">❤️</span>
          <span className="font-body text-xs text-white/35">{likeCount} likes</span>
        </div>
        <span className="font-body text-xs text-white/35">{story.comments || 0} comments</span>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/6" />

      {/* Action Buttons */}
      <div className="flex items-center px-2 py-1">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 font-body text-sm font-medium ${liked ? "text-red-400 bg-red-400/8" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
        >
          {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
          Like
        </button>
        <button
          onClick={() => onView(storyId)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 font-body text-sm font-medium"
        >
          <FaRegComment size={14} />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 font-body text-sm font-medium">
          <FaShare size={13} />
          Share
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center justify-center px-4 py-2.5 rounded-xl transition-all duration-200 font-body text-sm ${saved ? "text-amber-400" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
        >
          {saved ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────
export default function Dashboard() {
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const navigate = useNavigate();

  const fetchStories = async () => {
    try {
      const res = await getStories();
      setStories(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) { toast.error("Invalid story ID"); return; }
    try {
      await deleteStory(id);
      toast.success("Story deleted");
      fetchStories();
    } catch (err) {
      console.log(err?.response?.data);
      toast.error("Delete failed");
    }
  };

  const handleView = (id) => navigate(`/story/${id}`);

  useEffect(() => {
    const load = async () => { await fetchStories(); };
    load();
  }, []);

  const displayStories = stories.length > 0 ? stories : SAMPLE_STORIES;

  return (
    <div className="min-h-screen bg-[#080b10] text-white font-body">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* ── Top Navbar ── */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(8,11,16,0.92)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🧭</span>
          <span className="font-display text-lg font-bold text-white">
            Travel<span className="text-amber-400">Story</span>
          </span>
        </div>

        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 w-64"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <FaSearch size={12} className="text-white/30" />
          <input
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full font-body"
            placeholder="Search stories, places..."
          />
        </div>

        {/* Nav icons */}
        <div className="flex items-center gap-1">
          {[
            { icon: <FaHome size={16} />, label: "Feed" },
            { icon: <FaCompass size={16} />, label: "Explore" },
            { icon: <FaBell size={16} />, label: "Alerts" },
            { icon: <FaUser size={16} />, label: "Profile" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
            >
              {icon}
              <span className="text-[10px] font-body">{label}</span>
            </button>
          ))}
          <button
            onClick={() => navigate("/create-story")}
            className="ml-2 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#080b10] text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95"
          >
            <FaPlus size={11} />
            <span className="font-body">Share Story</span>
          </button>
        </div>
      </nav>

      {/* ── 3-column layout ── */}
      <div className="max-w-9xl mx-15 px-4 py-6 grid grid-cols-12 gap-5">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="col-span-3 hidden lg:block">
          {/* Profile card */}
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="h-16 bg-gradient-to-r from-amber-500/40 to-orange-600/40" />
            <div className="px-4 pb-4 -mt-6">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-white border-2 border-[#080b10] mb-2">
                ME
              </div>
              <p className="font-body text-sm font-medium text-white">My Profile</p>
              <p className="font-body text-xs text-white/40 mt-0.5">Travel enthusiast · Explorer</p>
              <div className="mt-3 pt-3 border-t border-white/6 flex justify-between">
                <div>
                  <p className="font-body text-xs text-white/35">Stories</p>
                  <p className="font-display text-base font-bold text-amber-400">{stories.length}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-white/35">Countries</p>
                  <p className="font-display text-base font-bold text-amber-400">12</p>
                </div>
                <div>
                  <p className="font-body text-xs text-white/35">Followers</p>
                  <p className="font-display text-base font-bold text-amber-400">340</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick nav */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-3">Explore</p>
            {["🌏 Asia", "🏔️ Europe", "🌊 Oceania", "🌵 Americas", "🌍 Africa"].map(region => (
              <button
                key={region}
                className="w-full text-left font-body text-sm text-white/55 hover:text-amber-400 hover:bg-amber-400/5 px-2 py-1.5 rounded-lg transition-all duration-150"
              >
                {region}
              </button>
            ))}
          </div>

          {/* Trending tags */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-3">Trending</p>
            {["#backpacking", "#solotravel", "#foodie", "#mountains", "#streetphotography"].map(tag => (
              <div key={tag} className="flex items-center justify-between py-1.5">
                <span className="font-body text-sm text-amber-400/70">{tag}</span>
                <span className="font-body text-xs text-white/25">2.4k</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="col-span-12 lg:col-span-7">

          {/* Create post bar */}
          <div
            className="rounded-2xl p-4 mb-5 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              ME
            </div>
            <button
              onClick={() => navigate("/create-story")}
              className="flex-1 text-left font-body text-sm text-white/30 bg-white/5 hover:bg-white/8 border border-white/8 rounded-full px-4 py-2.5 transition-all duration-200"
            >
              Share your travel experience...
            </button>
            <button
              onClick={() => navigate("/create-story")}
              className="shrink-0 flex items-center gap-1.5 font-body text-xs font-medium text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 rounded-full px-3 py-2 transition-all duration-200"
            >
              <span>📸</span> Add Photo
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            {["feed", "my stories"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 font-body text-sm py-2 rounded-lg capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-amber-400 text-[#080b10] font-medium"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stories Feed */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-1/3" />
                      <div className="h-2 bg-white/6 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-white/6 rounded w-full mb-1" />
                  <div className="h-2 bg-white/6 rounded w-5/6 mb-4" />
                  <div className="h-48 bg-white/6 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="fade-in">
              {displayStories.map(story => (
                <StoryCard
                  key={story._id || story.id}
                  story={story}
                  onDelete={handleDelete}
                  onView={handleView}
                  isOwner={!story.isSample}
                />
              ))}
              {displayStories.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="font-display text-xl text-white mb-2">No stories yet</h3>
                  <p className="font-body text-sm text-white/40 mb-6">Be the first to share your travel experience!</p>
                  <button
                    onClick={() => navigate("/create-story")}
                    className="font-body text-sm font-medium bg-amber-400 hover:bg-amber-300 text-[#080b10] rounded-full px-6 py-3 transition-all duration-200"
                  >
                    Share Your First Story
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="col-span-2 hidden lg:block">
          {/* People to follow */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-4">Fellow Explorers</p>
            {[
              { name: "Lucia Mendez", place: "Patagonia", init: "LM", color: "bg-rose-500" },
              { name: "James Okafor", place: "Morocco", init: "JO", color: "bg-emerald-500" },
              { name: "Yuki Tanaka",  place: "Hokkaido", init: "YT", color: "bg-sky-500" },
            ].map(person => (
              <div key={person.name} className="flex items-center justify-between mb-4 last:mb-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${person.color} flex items-center justify-center text-xs font-bold text-white`}>
                    {person.init}
                  </div>
                  <div>
                    <p className="font-body text-xs font-medium text-white">{person.name}</p>
                    <p className="font-body text-xs text-white/35">{person.place}</p>
                  </div>
                </div>
                <button className="font-body text-xs text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 rounded-full px-3 py-1 transition-all duration-200">
                  Follow
                </button>
              </div>
            ))}
          </div>

          {/* Top destinations */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-3">Hot Destinations</p>
            {[
              { place: "Bali, Indonesia", count: "1.2k stories", emoji: "🌴" },
              { place: "Kyoto, Japan",    count: "980 stories",  emoji: "🌸" },
              { place: "Santorini, GR",   count: "854 stories",  emoji: "🏛️" },
              { place: "Machu Picchu",    count: "721 stories",  emoji: "🏔️" },
            ].map(dest => (
              <div key={dest.place} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span>{dest.emoji}</span>
                  <div>
                    <p className="font-body text-xs font-medium text-white/80">{dest.place}</p>
                    <p className="font-body text-xs text-white/30">{dest.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-body text-xs text-white/30 uppercase tracking-wider mb-3">Community</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Stories", value: "12.4K" },
                { label: "Countries", value: "94" },
                { label: "Travellers", value: "38K" },
                { label: "Photos", value: "210K" },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="font-display text-lg font-bold text-amber-400">{stat.value}</p>
                  <p className="font-body text-xs text-white/35 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
