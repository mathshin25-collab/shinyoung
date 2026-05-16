"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trophy, Timer, Zap, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function MiniGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentProblem, setCurrentProblem] = useState<{ q: string; a: number } | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [combo, setCombo] = useState(0);

  const generateProblem = useCallback((currentScore: number) => {
    // 점수에 따라 난이도(숫자 범위) 증가
    let maxNum = 20;
    if (currentScore > 5000) maxNum = 200;
    else if (currentScore > 2000) maxNum = 100;
    else if (currentScore > 500) maxNum = 50;

    const isAddition = Math.random() > 0.5;
    const isMultiplication = currentScore > 3000 && Math.random() > 0.7; // 고득점 시 곱셈 등장

    let a = Math.floor(Math.random() * maxNum) + 1;
    let b = Math.floor(Math.random() * maxNum) + 1;
    
    let q = "";
    let ans = 0;
    
    if (isMultiplication) {
      a = Math.floor(Math.random() * (maxNum / 5)) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      q = `${a} × ${b}`;
      ans = a * b;
    } else if (isAddition) {
      q = `${a} + ${b}`;
      ans = a + b;
    } else {
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      q = `${max} - ${min}`;
      ans = max - min;
    }

    // Generate close options
    const opts = new Set<number>();
    opts.add(ans);
    while (opts.size < 4) {
      const offsetRange = currentScore > 2000 ? 21 : 11;
      const offsetSubtract = currentScore > 2000 ? 10 : 5;
      const offset = Math.floor(Math.random() * offsetRange) - offsetSubtract;
      if (offset !== 0 && ans + offset > 0) {
        opts.add(ans + offset);
      }
    }

    setCurrentProblem({ q, a: ans });
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setCombo(0);
    setSubmitted(false);
    setPlayerName("");
    setGameState("playing");
    generateProblem(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => +(prev - 0.1).toFixed(1));
      }, 100);
    } else if (gameState === "playing" && timeLeft <= 0) {
      setTimeLeft(0);
      setGameState("end");
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (selected: number) => {
    if (selected === currentProblem?.a) {
      // Correct: Add time based on combo, add score
      const newCombo = combo + 1;
      const newScore = score + 10 * newCombo;
      setCombo(newCombo);
      setScore(newScore);
      
      // 점수가 높을수록 주어지는 보상 시간이 줄어듦 (최소 0.3초)
      const timeReward = Math.max(0.3, 1 - (newScore / 10000));
      setTimeLeft((t) => Math.min(20, t + timeReward)); 
      generateProblem(newScore);
    } else {
      // Wrong: Penalize time, reset combo
      setCombo(0);
      setTimeLeft((t) => Math.max(0, t - 2));
      generateProblem(score);
    }
  };

  const submitScore = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score, game: 'mini' })
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/50 dark:bg-pink-900/10 backdrop-blur-xl rounded-3xl border-2 border-pink-100 dark:border-pink-900 shadow-2xl overflow-hidden p-8">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full animate-bounce">
              <Zap className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-pink-900 dark:text-pink-100 mb-4 tracking-tight">
              10초 암산 서바이벌 ⚡
            </h1>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 text-lg max-w-md mx-auto">
              주어진 시간은 단 <strong>10초!</strong><br />
              정답을 맞히면 시간이 1초 늘어나고 콤보 점수가 쌓입니다.<br />
              틀리면 2초가 차감되니 조심하세요!
            </p>

            <button
              onClick={startGame}
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:scale-105"
            >
              도전 시작! 🚀
            </button>
          </div>
        )}

        {gameState === "playing" && currentProblem && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-black text-2xl text-pink-900 dark:text-pink-100">{score.toLocaleString()} 점</span>
                {combo > 1 && <span className="text-orange-500 font-bold animate-pulse">{combo} COMBO! 🔥</span>}
              </div>
              <div className={`flex items-center gap-2 font-black text-4xl ${timeLeft <= 3 ? "text-red-500 animate-ping" : "text-orange-500"}`}>
                {timeLeft.toFixed(1)}
              </div>
            </div>

            <div className="py-12 bg-white dark:bg-pink-950/40 rounded-2xl border border-pink-50 dark:border-pink-900 text-center relative overflow-hidden shadow-inner">
              <h2 className="text-6xl md:text-8xl font-black text-pink-900 dark:text-pink-100 tracking-tighter">
                {currentProblem.q}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="py-6 px-4 rounded-2xl font-black text-3xl md:text-4xl border-b-4 border-orange-200 dark:border-orange-900 transition-all bg-gradient-to-br from-white to-orange-50 dark:from-pink-900/40 dark:to-orange-900/20 text-orange-600 dark:text-orange-400 hover:scale-[1.02] active:scale-95 active:border-b-0 active:translate-y-1 shadow-md"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === "end" && (
          <div className="text-center py-8">
            <div className="mb-4 inline-block p-4 bg-gray-100 dark:bg-gray-900/30 rounded-full">
              <Timer className="w-12 h-12 text-gray-500" />
            </div>
            <h1 className="text-3xl font-bold text-pink-900 dark:text-pink-100 mb-2">
              시간 초과! ⏰
            </h1>
            <p className="text-6xl font-black text-orange-500 mb-2 drop-shadow-sm">{score.toLocaleString()}</p>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 font-bold">
              엄청난 순발력이네요! 명예의 전당에 이름을 남겨볼까요?
            </p>
            
            {!submitted ? (
              <div className="max-w-xs mx-auto mb-8 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="당신의 멋진 닉네임"
                  maxLength={10}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950 focus:outline-none focus:border-orange-400 font-bold text-center"
                />
                <button
                  onClick={submitScore}
                  disabled={!playerName.trim() || isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "등록 중..." : "명예의 전당 등록하기 🏆"}
                </button>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 /> 랭킹 등록 완료!
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400 rounded-full font-bold transition-all hover:bg-orange-50 dark:hover:bg-orange-900/40"
              >
                <RefreshCcw className="w-5 h-5" /> 다시 도전
              </button>
              <Link
                href="/ranking"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
              >
                <Trophy className="w-5 h-5" /> 랭킹 확인
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
