import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { MysteryClue, GameSubmissionResult } from '../../types';
import { fetchMysteryClues, submitGameResult } from '../../services/api';
import { GameResultModal } from './GameResultModal';
import { soundManager } from '../../utils/audio';

export const MysteryCode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, updatePlayerState } = usePlayer();
  const [clues, setClues] = useState<MysteryClue[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resultData, setResultData] = useState<GameSubmissionResult | null>(null);

  const loadClues = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMysteryClues();
      setClues(data);
      setCurrentStageIndex(0);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setCorrectCount(0);
      setIsAnswered(false);
      setSelectedOption(null);
      setIsCorrect(null);
      setResultData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClues();
  }, []);

  const currentClue = clues[currentStageIndex];

  const handleOptionSelect = (opt: string) => {
    if (isAnswered || !currentClue) return;
    setIsAnswered(true);
    setSelectedOption(opt);

    const correct = opt === currentClue.decodedMeaning;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      setCorrectCount((c) => c + 1);

      // Base: 120 per puzzle + streak bonus
      const pointsEarned = 120 + newStreak * 20;
      setScore((s) => s + pointsEarned);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    setTimeout(() => {
      if (currentStageIndex + 1 < clues.length) {
        setCurrentStageIndex((i) => i + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishMystery(correct ? correctCount + 1 : correctCount);
      }
    }, 1800);
  };

  const finishMystery = async (finalCorrect: number) => {
    const accuracy = clues.length > 0 ? Math.round((finalCorrect / clues.length) * 100) : 100;
    // Mystery Completion bonus: +500 pts!
    const finalScore = score + 500;

    if (player) {
      try {
        const res = await submitGameResult({
          playerId: player.id,
          gameType: 'mystery',
          score: finalScore,
          accuracy,
          streak: maxStreak,
        });
        setResultData(res);
        updatePlayerState(res.player);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mb-4" />
        <p className="text-cyan-300 font-['Cinzel',serif] tracking-wider text-sm">
          DECRYPTING JAPANESE CIPHERS...
        </p>
      </div>
    );
  }

  const isFinalStage = currentClue && currentClue.stage === 10;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
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
            <span className="text-2xl">🧩</span>
            <div>
              <h2 className="text-base font-extrabold text-white font-['Cinzel',serif]">MYSTERY CODE</h2>
              <div className="text-[10px] text-cyan-400 font-['Shippori_Mincho',serif]">
                暗号の謎解き — 日本語コードの解読
              </div>
            </div>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Score</div>
            <div className="text-base font-black text-amber-400 font-mono">
              ⭐ {score.toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Streak</div>
            <div className="text-base font-black text-orange-400 font-mono">
              🔥 {streak}
            </div>
          </div>
        </div>
      </div>

      {/* Main Decoding Cipher Vault */}
      {currentClue && !resultData && (
        <div
          className={`relative rounded-3xl bg-neutral-900/90 border-2 ${
            isFinalStage ? 'border-amber-400 shadow-amber-500/20' : 'border-cyan-500/40'
          } p-6 sm:p-10 shadow-2xl backdrop-blur-md`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Stage {currentClue.stage} of {clues.length}
              </span>
              <span className="text-xs text-neutral-600">•</span>
              <span className="text-xs text-neutral-300 font-mono">{currentClue.title}</span>
            </div>

            {isFinalStage && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-black animate-pulse">
                🔐 FINAL MYSTERY +500 PTS
              </span>
            )}
          </div>

          {/* Decoding Cipher Flow Diagram */}
          <div className="my-6 p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 flex flex-col items-center justify-center text-center">
            {/* Step 1: Japanese Raw */}
            <div className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-1">
              ORIGINAL JAPANESE CODE
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-['Noto_Sans_JP',sans-serif] tracking-wider mb-2">
              {currentClue.japaneseText}
            </div>

            {/* Down arrow */}
            <div className="text-neutral-500 font-bold my-1">↓ [ROMANIZE] ↓</div>

            {/* Step 2: Romaji Syllable breakdown */}
            <div className="text-base sm:text-lg font-mono font-bold text-amber-300 tracking-widest mb-2 px-4 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
              {currentClue.romajiText}
            </div>

            {/* Down arrow */}
            <div className="text-neutral-500 font-bold my-1">↓ [DECODE MEANING] ↓</div>

            {/* Step 3: Mystery Hint */}
            <div className="text-xs sm:text-sm text-neutral-300 max-w-lg mt-2 font-medium bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800/80">
              💡 <strong>Hint:</strong> {currentClue.hint}
            </div>
          </div>

          {/* Feedback banner */}
          {isAnswered && (
            <div
              className={`mb-6 p-3 rounded-xl border text-center text-xs font-bold animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/80 border-red-500 text-red-200'
              }`}
            >
              {isCorrect ? '🔓 CIPHER DECODED! 素晴らしい！' : `❌ SEAL INTACT! Correct: ${currentClue.decodedMeaning}`}
              <div className="text-[11px] font-normal text-neutral-300 mt-1">{currentClue.storyText}</div>
            </div>
          )}

          {/* 4 Multi-Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
            {currentClue.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isThisSelected = selectedOption === opt;
              const isThisCorrect = opt === currentClue.decodedMeaning;

              let btnStyle = 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-200';
              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (isThisSelected && !isThisCorrect) {
                  btnStyle = 'bg-red-950 border-red-500 text-red-200';
                } else {
                  btnStyle = 'bg-neutral-950/60 border-neutral-900 text-neutral-600 opacity-50';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isAnswered}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 font-bold text-xs sm:text-sm ${btnStyle} transform active:scale-95 text-left`}
                >
                  <span className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-xs font-mono text-neutral-400 border border-neutral-800 shrink-0">
                    {letter}
                  </span>
                  <span className="flex-1 font-['Cinzel',serif]">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {resultData && (
        <GameResultModal
          resultData={resultData}
          onPlayAgain={loadClues}
          onOtherGames={onBack}
        />
      )}
    </div>
  );
};
