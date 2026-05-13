import { useEffect, useState } from "react";
import { getMyStories } from "../services/storyService";
import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlus,
  FaBook,
} from "react-icons/fa";

export default function MyStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyStories = async () => {
    try {
      const res = await getMyStories();
      setStories(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStories();
  }, []);

  // const getImageUrl = (file) => {
  //   if (!file) return null;
  //   if (file.startsWith("http")) return file;
  //   return `http://localhost:5000/uploads/${file}`;
  // };

  const getImageUrl = (file) => {
    if (!file) return null;

    if (Array.isArray(file)) {
      file = file[0]; // first image
    }

    if (typeof file !== "string") return null;

    if (file.startsWith("http")) return file;

    return `http://localhost:5000/${file}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (stories.length > 0) {
      console.log("Stories:", stories);
    }
  }, [stories]);

  return (
    <div className="min-h-screen bg-[#080b10] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'Outfit', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.10s ease both; }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 12px;
        }

        .story-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .story-card:hover {
          transform: translateY(-4px);
          border-color: rgba(251,191,36,0.35);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(251,191,36,0.12);
        }
        .story-card:hover .card-image {
          transform: scale(1.04);
        }
        .card-image {
          transition: transform 0.4s ease;
        }

        .tag {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          background: rgba(251,191,36,0.12);
          color: rgba(251,191,36,0.85);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 999px;
          padding: 2px 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
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
          <button
            onClick={() => navigate(location.state?.from || "/dashboard")}
            className="font-body flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors group"
          >
            <FaArrowLeft
              size={13}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🧭</span>
            <span className="font-display text-lg font-bold text-white">
              Travel<span className="text-amber-400">Story</span>
            </span>
          </div>
        </div>

        <Link
          to="/create-story"
          className="font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 rounded-full px-5 py-2 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95 flex items-center gap-2"
        >
          <FaPlus size={11} />
          New Story
        </Link>
      </nav>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="fade-up mb-8">
          <span className="font-body inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded-full px-3 py-1 mb-3">
            <FaBook size={10} /> My Stories
          </span>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl font-black text-white leading-tight">
              Your
              <span className="text-amber-400 italic"> Journeys</span>
            </h1>
            {!loading && stories.length > 0 && (
              <span className="font-body text-sm text-white/30">
                {stories.length} {stories.length === 1 ? "story" : "stories"}
              </span>
            )}
          </div>
          <p className="font-body text-sm text-white/40 mt-2 font-light">
            Every place you've been, every moment you've captured.
          </p>
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-up-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-[18px] overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="skeleton w-full h-52" />
                <div className="p-4 space-y-2.5">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && stories.length === 0 && (
          <div
            className="fade-up-1 flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.10)",
            }}
          >
            <span className="text-5xl mb-4">🗺️</span>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              No stories yet
            </h3>
            <p className="font-body text-sm text-white/35 mb-6 text-center max-w-xs">
              Your adventures are waiting to be told. Share your first journey
              with the world.
            </p>
            <Link
              to="/create-story"
              className="font-body text-sm font-medium text-[#080b10] bg-amber-400 hover:bg-amber-300 rounded-full px-6 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95 flex items-center gap-2"
            >
              <FaPlus size={11} />
              Write Your First Story
            </Link>
          </div>
        )}

        {/* ── Story grid ── */}
        {!loading && stories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-up-2">
            {stories.map((story, idx) => (
              <div
                key={story.id}
                className="story-card"
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  animation: "fadeUp 0.5s ease both",
                }}
                // onClick={() => navigate(`/story/${story.id}`)}

                onClick={() =>
                  navigate(`/story/${story.id}`, {
                    state: { from: "/my-stories" },
                  })
                }
              >
                {/* Image */}
                <div className="relative w-full h-52 bg-white/5 overflow-hidden">
                  {console.log("FULL STORY:", story)}
                  {console.log("DB image value:", story.image_url)}
                  {console.log("Final URL:", getImageUrl(story.image_url))}

                  {getImageUrl(story.image_url) ? (
                    <img
                      src={getImageUrl(story.image_url)}
                      alt={story.title}
                      className="card-image w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Image failed:", e.target.src);
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-20">🖼️</span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b10]/80 via-transparent to-transparent" />

                  {/* Location badge */}
                  {story.location_name && (
                    <div className="absolute bottom-3 left-3">
                      <span className="tag">
                        <FaMapMarkerAlt size={8} />
                        {story.location_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-white leading-snug mb-1 line-clamp-2">
                    {story.title}
                  </h3>

                  {story.description && (
                    <p className="font-body text-xs text-white/40 leading-relaxed line-clamp-2 mb-3 font-light">
                      {story.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {story.travel_date && (
                      <div className="flex items-center gap-1.5 text-white/30">
                        <FaCalendarAlt size={10} />
                        <span className="font-body text-xs">
                          {formatDate(story.travel_date)}
                        </span>
                      </div>
                    )}
                    <span className="font-body text-xs text-amber-400/70 hover:text-amber-400 transition-colors ml-auto">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
