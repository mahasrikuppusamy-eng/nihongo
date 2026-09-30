import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Destination } from '../../types';
import { fetchDestinations, exploreDestination } from '../../services/api';
import { soundManager } from '../../utils/audio';

export const JapanExplorer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, refreshPlayer, showToast, openPlayerModal } = usePlayer();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDestinations()
      .then((data) => {
        setDestinations(data);
        if (data.length > 0) {
          setSelectedDest(data[0]);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Sync visited destinations for the active player
  useEffect(() => {
    if (player?.visitedDestinations) {
      setVisitedIds(player.visitedDestinations);
    }
  }, [player]);

  const handleSelectDestination = async (dest: Destination) => {
    soundManager.playClick();
    setSelectedDest(dest);

    if (player && !visitedIds.includes(dest.id)) {
      try {
        const res = await exploreDestination(player.id, dest.id);
        if (res.awarded) {
          soundManager.playCorrect();
          setVisitedIds((prev) => [...prev, dest.id]);
          showToast(
            `🗾 Discovered: ${dest.nameEn} (${dest.nameJa})`,
            `+${res.points} Exploration Points Awarded! (${res.totalVisited}/10 visited)`,
            'success'
          );
          refreshPlayer();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <p className="text-emerald-300 font-['Cinzel',serif] tracking-wider text-sm">
          UNFOLDING CARTOGRAPHIC MAP OF JAPAN...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 transition"
          >
            ← HUB
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗾</span>
            <div>
              <h2 className="text-base font-extrabold text-white font-['Cinzel',serif]">JAPAN EXPLORER</h2>
              <div className="text-[10px] text-emerald-400 font-['Shippori_Mincho',serif]">
                日本探検 — 観光名所・伝統文化マップ
              </div>
            </div>
          </div>
        </div>

        {/* Explorer Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Locations Visited</div>
            <div className="text-base font-black text-emerald-400 font-mono">
              📍 {visitedIds.length} / {destinations.length}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Exploration Reward</div>
            <div className="text-base font-black text-amber-400 font-mono">
              ⭐ +25 pts / spot
            </div>
          </div>
        </div>
      </div>

      {!player && (
        <div className="mb-6 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs text-amber-200">
          <span>⚠️ Guest Mode: Log in to save exploration points (+25 per city) to the global leaderboard!</span>
          <button
            onClick={openPlayerModal}
            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold transition shrink-0 ml-2"
          >
            Enter Name
          </button>
        </div>
      )}

      {/* Main Two-Column Layout: Map + Destination Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Stylized Archipelago Map */}
        <div className="lg:col-span-7 bg-neutral-900/90 border-2 border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[460px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 z-10">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>🧭</span> INTERACTIVE ARCHIPELAGO NAVIGATOR
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">Tap any landmark pin</span>
          </div>

          {/* SVG Map of Japan with Plot Points */}
          <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center my-2">
            {/* Water Waves & Grid texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-sky-950/20 to-neutral-950/80 rounded-2xl border border-neutral-800" />

            {/* Stylized Island Paths representation of Japan */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full text-neutral-800/80 fill-current pointer-events-none drop-shadow-md"
            >
              {/* Hokkaido */}
              <path d="M 75,15 Q 85,12 92,20 Q 88,32 78,28 Q 72,22 75,15 Z" fill="#1e293b" opacity="0.6" />
              {/* Honshu Main Island curve */}
              <path d="M 78,32 Q 74,45 68,52 Q 62,58 52,62 Q 42,65 32,65 Q 40,60 55,54 Q 68,46 78,32 Z" fill="#1e293b" opacity="0.7" />
              {/* Shikoku */}
              <path d="M 44,66 Q 50,65 52,69 Q 46,72 42,69 Z" fill="#1e293b" opacity="0.6" />
              {/* Kyushu */}
              <path d="M 28,68 Q 36,68 34,78 Q 26,82 25,72 Z" fill="#1e293b" opacity="0.6" />
              {/* Okinawa archipelago */}
              <path d="M 16,86 Q 19,85 20,89 Q 15,90 16,86 Z" fill="#1e293b" opacity="0.6" />
            </svg>

            {/* Interactive Pins on Map */}
            {destinations.map((dest) => {
              const isSelected = selectedDest?.id === dest.id;
              const isVisited = visitedIds.includes(dest.id);

              return (
                <div
                  key={dest.id}
                  style={{
                    left: `${dest.coordinates.x}%`,
                    top: `${dest.coordinates.y}%`,
                  }}
                  onClick={() => handleSelectDestination(dest)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                >
                  {/* Glowing Radar Pulse if Selected */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping" />
                  )}

                  {/* Pin Capsule */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xl border-2 transition-all duration-300 transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-emerald-500 text-neutral-950 border-white ring-4 ring-emerald-400/40 scale-110'
                        : isVisited
                        ? 'bg-neutral-900/90 text-emerald-300 border-emerald-500/70 hover:bg-neutral-800'
                        : 'bg-neutral-900/90 text-neutral-300 border-neutral-700 hover:border-emerald-400'
                    }`}
                  >
                    <span>{isVisited ? '✅' : '📍'}</span>
                    <span className="font-['Cinzel',serif]">{dest.nameEn}</span>
                    <span className="text-[10px] font-['Shippori_Mincho',serif] opacity-80 hidden sm:inline">
                      {dest.nameJa}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Destination List Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 z-10 scrollbar-none">
            {destinations.map((d) => (
              <button
                key={d.id}
                onClick={() => handleSelectDestination(d)}
                className={`text-xs px-3 py-1 rounded-xl whitespace-nowrap border transition ${
                  selectedDest?.id === d.id
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {d.nameEn} ({d.nameJa})
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Animated Information Card */}
        {selectedDest && (
          <div className="lg:col-span-5 bg-neutral-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header info */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  {selectedDest.region} Region
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-black text-white font-['Cinzel',serif]">
                    {selectedDest.nameEn}
                  </h3>
                  <span className="text-2xl font-black text-emerald-400 font-['Shippori_Mincho',serif]">
                    {selectedDest.nameJa}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 italic mt-1 font-serif">
                  "{selectedDest.tagline}"
                </p>
              </div>

              <div className="text-right">
                {visitedIds.includes(selectedDest.id) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40">
                    <span>✓</span> Visited (+25 pts)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-500/40 animate-pulse">
                    <span>★</span> +25 Pts Available
                  </span>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Famous For */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="font-bold text-emerald-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>⛩️</span> Famous Landmarks
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDest.famousFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800 text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Traditional Food & Gastronomy */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🍜</span> Traditional Cuisine
                </div>
                <p className="text-neutral-300 leading-relaxed text-xs">{selectedDest.traditionalFood}</p>
              </div>

              {/* Culture & Heritage */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="font-bold text-purple-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🎎</span> Cultural Spirit
                </div>
                <p className="text-neutral-300 leading-relaxed text-xs">{selectedDest.culture}</p>
              </div>

              {/* Interesting Fact */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="font-bold text-rose-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>💡</span> Did You Know?
                </div>
                <p className="text-neutral-300 leading-relaxed text-xs">{selectedDest.interestingFact}</p>
              </div>

              {/* Japanese Useful Phrase */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-950 border border-emerald-500/40">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span>🗣️ USEFUL LOCAL PHRASE</span>
                  <button
                    onClick={() => soundManager.playCorrect()}
                    className="hover:text-emerald-200 text-xs transition"
                  >
                    🔊 Listen
                  </button>
                </div>
                <div className="text-base font-extrabold text-white font-['Shippori_Mincho',serif]">
                  {selectedDest.japanesePhrase.japanese}
                </div>
                <div className="text-xs font-mono text-emerald-300">
                  {selectedDest.japanesePhrase.romaji}
                </div>
                <div className="text-xs text-neutral-300 italic mt-0.5">
                  "{selectedDest.japanesePhrase.english}"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
