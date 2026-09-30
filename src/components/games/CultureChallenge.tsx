import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Question, GameSubmissionResult } from '../../types';
import { fetchQuestions, submitGameResult } from '../../services/api';
import { GameResultModal } from './GameResultModal';
import { soundManager } from '../../utils/audio';

const CULTURE_TOPIC_ICONS: Record<string, string> = {
  'Traditional Clothing & Textiles': '👘',
  'Summer Tradition': '🎆',
  'Architecture & Spirituality': '⛩️',
  'Traditional Crafts': '🕊️',
  'Aesthetic Disciplines': '💐',
  'Wabi-Sabi Aesthetics': '✨',
  'Tea Culture': '🍵',
  'Seasonal Customs': '🌸',
  'Festivals (Matsuri)': '🎋',
  'Traditional Celebrations': '🎎',
  'Good Luck Charms': '🧿',
  'Spiritual Talismans': '🧧',
  'Shrine Traditions': '📜',
  'Martial Arts & Sports': '🥋',
  'Samurai Heritage': '⚔️',
  'Wellness & Nature': '🌲',
  'Cultural Etiquette': '👞',
  'Dining Customs': '🥢',
  'Traditional Architecture': '🏯',
  'Street Architecture': '🏮',
  'Sustainable Traditions': '📦',
  'Street Food & Kansai Cuisine': '🐙',
  'Traditional Sweets': '🎏',
  'Food Culture': '🍱',
  'Hospitality': '🍵',
  'Cultural Mindset': '🧘',
  'Untranslatable Aesthetic Words': '🍃',
};

export const CultureChallenge: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, updatePlayerState } = usePlayer();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(18);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resultData, setResultData] = useState<GameSubmissionResult | null>(null);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const allQ = await fetchQuestions('culture', 30);
      const shuffled = [...allQ].sort(() => 0.5 - Math.random()).slice(0, 10);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setCorrectCount(0);
      setTimer(18);
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
    loadQuestions();
  }, []);

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

      const speedBonus = Math.floor((timer / 18) * 25);
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
        setTimer(18);
      } else {
        finishGame(correct ? correctCount + 1 : correctCount);
      }
    }, 1500);
  };

  const finishGame = async (finalCorrectCount: number) => {
    const accuracy = questions.length > 0 ? Math.round((finalCorrectCount / questions.length) * 100) : 100;
    const finalScore = score + 200 + (accuracy === 100 ? 500 : 0);

    if (player) {
      try {
        const res = await submitGameResult({
          playerId: player.id,
          gameType: 'culture',
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
        <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4" />
        <p className="text-purple-300 font-['Cinzel',serif] tracking-wider text-sm">
          EXPLORING CULTURAL ARCHIVES...
        </p>
      </div>
    );
  }

  const topicIcon = (currentQ?.subtext && CULTURE_TOPIC_ICONS[currentQ.subtext]) || '🎎';

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
            <span className="text-2xl">🎎</span>
            <div>
              <h2 className="text-base font-extrabold text-white font-['Cinzel',serif]">CULTURE CHALLENGE</h2>
              <div className="text-[10px] text-purple-400 font-['Shippori_Mincho',serif]">文化チャレンジ</div>
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

      {/* Main Culture Question Card */}
      {currentQ && !resultData && (
        <div className="relative rounded-3xl bg-neutral-900/90 border-2 border-purple-500/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-purple-400">•</span>
              <span className="text-xs text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-950 border border-purple-800 flex items-center gap-1">
                <span>{topicIcon}</span>
                <span>{currentQ.subtext}</span>
              </span>
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

          {/* Central Cultural Prompt */}
          <div className="flex flex-col items-center justify-center my-6 text-center">
            {/* Visual Icon Medallion */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-950/80 via-neutral-900 to-rose-950/60 border-2 border-purple-500/50 shadow-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition">
              {topicIcon}
            </div>

            <h3 className="text-lg sm:text-2xl font-bold text-white max-w-xl leading-snug">
              {currentQ.question}
            </h3>
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
              {isCorrect ? '✨ CORRECT! 見事な見識！' : `❌ INCORRECT! Answer: ${currentQ.correctAnswer}`}
              {currentQ.explanation && (
                <div className="text-[11px] font-normal text-neutral-300 mt-1">{currentQ.explanation}</div>
              )}
            </div>
          )}

          {/* Options */}
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
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 font-bold text-sm sm:text-base ${btnStyle} transform active:scale-95 text-left`}
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
          onPlayAgain={loadQuestions}
          onOtherGames={onBack}
        />
      )}
    </div>
  );
};
