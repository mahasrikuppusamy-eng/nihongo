import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Question, GameSubmissionResult } from '../../types';
import { fetchQuestions, submitGameResult } from '../../services/api';
import { GameResultModal } from './GameResultModal';
import { soundManager } from '../../utils/audio';

export const KanjiMaster: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, updatePlayerState } = usePlayer();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(15);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resultData, setResultData] = useState<GameSubmissionResult | null>(null);

  const loadQuestions = async (diff: 'beginner' | 'intermediate' | 'advanced') => {
    setIsLoading(true);
    try {
      const allQ = await fetchQuestions('kanji', 30);
      const filtered = allQ.filter((q) => q.difficulty === diff);
      const pool = filtered.length >= 8 ? filtered : allQ;
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setCorrectCount(0);
      setTimer(15);
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
    loadQuestions(selectedDifficulty);
  }, [selectedDifficulty]);

  useEffect(() => {
    if (isLoading || isAnswered || !!resultData || questions.length === 0) return;

    if (timer <= 0) {
      handleOptionSelect('__TIMEOUT__');
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isAnswered, resultData, isLoading, questions.length]);

  const currentQ = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered || !currentQ) return;
    setIsAnswered(true);
    setSelectedOption(option);

    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      if (newStreak === 3 || newStreak === 5 || newStreak === 10) {
        soundManager.playStreak();
      }

      setCorrectCount((c) => c + 1);

      const speedBonus = Math.floor((timer / 15) * 25);
      const streakMultiplier = newStreak >= 5 ? 2.0 : newStreak >= 3 ? 1.5 : 1.0;
      const pointsEarned = Math.round((currentQ.points + speedBonus) * streakMultiplier);

      setScore((prev) => prev + pointsEarned);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimer(15);
      } else {
        finishGame(correct ? correctCount + 1 : correctCount);
      }
    }, 1400);
  };

  const finishGame = async (finalCorrectCount: number) => {
    const accuracy = questions.length > 0 ? Math.round((finalCorrectCount / questions.length) * 100) : 100;
    const finalScore = score + 200 + (accuracy === 100 ? 500 : 0);

    if (player) {
      try {
        const res = await submitGameResult({
          playerId: player.id,
          gameType: 'kanji',
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
        <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
        <p className="text-amber-300 font-['Cinzel',serif] tracking-wider text-sm">
          OPENING KANJI MASTER ARCHIVES...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header */}
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
            <span className="text-2xl">🈶</span>
            <div>
              <h2 className="text-base font-extrabold text-white font-['Cinzel',serif]">KANJI MASTER</h2>
              <div className="text-[10px] text-amber-400 font-['Shippori_Mincho',serif]">漢字マスター</div>
            </div>
          </div>
        </div>

        {/* Difficulty Switcher */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          {(
            [
              { id: 'beginner', label: 'Beginner (N5)', ja: '初級' },
              { id: 'intermediate', label: 'Intermediate (N4)', ja: '中級' },
              { id: 'advanced', label: 'Advanced (N3-N1)', ja: '上級' },
            ] as const
          ).map((d) => (
            <button
              key={d.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedDifficulty(d.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedDifficulty === d.id
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{d.label}</span>
            </button>
          ))}
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
            <div className="text-base font-black text-orange-400 font-mono flex items-center gap-1">
              🔥 {streak}
              {streak >= 5 ? (
                <span className="text-[9px] bg-red-600 text-white px-1 rounded animate-pulse">2x</span>
              ) : streak >= 3 ? (
                <span className="text-[9px] bg-orange-600 text-white px-1 rounded">1.5x</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main Kanji Question Card */}
      {currentQ && !resultData && (
        <div className="relative rounded-3xl bg-neutral-900/90 border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-amber-400">•</span>
              <span className="text-xs text-amber-300 font-mono">+{currentQ.points} base pts</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border transition-colors ${
                timer <= 4
                  ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                  : 'bg-neutral-950 text-amber-300 border-neutral-700'
              }`}
            >
              <span>⏱️</span>
              <span>{timer}s</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-6">
            <div className="text-[12px] uppercase tracking-widest font-semibold text-amber-400/90 mb-3">
              {currentQ.subtext || 'What does this Kanji mean?'}
            </div>

            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br from-neutral-950 via-amber-950/25 to-black border-2 border-amber-500/50 shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <span className="text-7xl sm:text-8xl font-black text-amber-100 font-['Shippori_Mincho',serif] select-none group-hover:scale-105 transition-transform duration-300">
                {currentQ.question}
              </span>

              <div className="absolute top-2 right-2 text-[10px] font-['Shippori_Mincho',serif] px-1 rounded bg-amber-600/30 text-amber-300 border border-amber-500/30">
                漢字
              </div>
            </div>
          </div>

          {isAnswered && (
            <div
              className={`mb-6 p-3 rounded-xl border text-center text-xs font-bold animate-in fade-in ${
                isCorrect
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/80 border-red-500 text-red-200'
              }`}
            >
              {isCorrect ? '✨ CORRECT! 素晴らしい洞察！' : `❌ INCORRECT! Answer: ${currentQ.correctAnswer}`}
              {currentQ.explanation && (
                <div className="text-[11px] font-normal text-neutral-300 mt-1">{currentQ.explanation}</div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
            {currentQ.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isThisSelected = selectedOption === opt;
              const isThisCorrect = opt === currentQ.correctAnswer;

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
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 font-bold text-sm sm:text-base ${btnStyle} transform active:scale-95`}
                >
                  <span className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-xs font-mono text-neutral-400 border border-neutral-800">
                    {letter}
                  </span>
                  <span className="flex-1 text-center font-['Cinzel',serif]">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {resultData && (
        <GameResultModal
          resultData={resultData}
          onPlayAgain={() => loadQuestions(selectedDifficulty)}
          onOtherGames={onBack}
        />
      )}
    </div>
  );
};
