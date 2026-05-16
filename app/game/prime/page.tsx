"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trophy, Timer, Heart, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function PrimeGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [currentNumber, setCurrentNumber] = useState<number>(2);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);

  const isPrime = (num: number) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const generateProblem = useCallback(() => {
    const num = Math.floor(Math.random() * 99) + 2; // 2 to 100
    setCurrentNumber(num);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setLives(3);
    setGameState("playing");
    generateProblem();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (gameState === "playing" && timeLeft === 0) {
      setGameState("end");
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (answerIsPrime: boolean) => {
    if (feedback) return;

    const correct = isPrime(currentNumber);
    if (answerIsPrime === correct) {
      setScore((s) => s + 10);
      setFeedback({ type: "correct", message: "정답!" });
      setTimeout(() => {
        generateProblem();
      }, 500);
    } else {
      setFeedback({ type: "wrong", message: "앗, 틀렸어요!" });
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setTimeout(() => {
            setGameState("end");
          }, 500);
        } else {
          setTimeout(() => {
            generateProblem();
          }, 500);
        }
        return newLives;
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/50 dark:bg-pink-900/10 backdrop-blur-xl rounded-3xl border-2 border-pink-100 dark:border-pink-900 shadow-2xl overflow-hidden p-8">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <Timer className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold text-pink-900 dark:text-pink-100 mb-4">
              중1 소수 찾기 스피드 게임 ⚡
            </h1>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 text-lg">
              <strong>1분</strong> 동안 최대한 많은 숫자를 보고 소수인지 합성수인지 맞혀보세요!<br />
              정답을 맞힐 때마다 10점을 얻어요. 기회는 <strong>3번</strong>입니다.
            </p>

            <button
              onClick={startGame}
              className="px-10 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-pink-200 dark:hover:shadow-none"
            >
              게임 시작하기 🚀
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500 w-5 h-5" />
                <span className="font-bold text-pink-900 dark:text-pink-100 text-xl">Score: {score}</span>
              </div>
              <div className="flex items-center gap-2 font-black text-xl text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-4 py-2 rounded-full">
                <Timer className="w-5 h-5" /> {timeLeft}초
              </div>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 transition-colors ${
                      i < lives ? "text-pink-500 fill-pink-500" : "text-pink-200 dark:text-pink-900"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="py-12 bg-white dark:bg-pink-950/40 rounded-2xl border border-pink-50 dark:border-pink-900 text-center relative overflow-hidden">
              <span className="text-pink-400 text-sm font-bold mb-2 block tracking-widest">이 숫자는?</span>
              <h2 className="text-6xl md:text-8xl font-black text-pink-900 dark:text-pink-100">
                {currentNumber}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                disabled={!!feedback}
                className="py-6 px-6 rounded-2xl font-bold text-xl md:text-2xl border-2 transition-all bg-white dark:bg-pink-900/20 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/40 active:scale-95"
              >
                소수다!
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={!!feedback}
                className="py-6 px-6 rounded-2xl font-bold text-xl md:text-2xl border-2 transition-all bg-white dark:bg-pink-900/20 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 active:scale-95"
              >
                합성수다!
              </button>
            </div>

            <div className="h-16 flex items-center justify-center">
              {feedback && (
                <div
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl animate-bounce w-full max-w-sm ${
                    feedback.type === "correct" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {feedback.type === "correct" ? <CheckCircle2 /> : <XCircle />}
                  <span className="font-bold">{feedback.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === "end" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-pink-900 dark:text-pink-100 mb-2">
              게임 종료! ⏰
            </h1>
            <p className="text-5xl font-black text-pink-500 mb-4">{score}점</p>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 text-lg">
              정말 훌륭해요! 당신이 진정한 1등입니다! 🎉
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> 다시 하기
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all"
              >
                <ArrowLeft className="w-5 h-5" /> 메인으로
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
