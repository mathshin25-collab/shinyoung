"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trophy, Timer, Heart, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function PrimeGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(10);
  const [currentNumber, setCurrentNumber] = useState<number>(2);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setLives(10);
    setSubmitted(false);
    setPlayerName("");
    setGameState("playing");
    generateProblem();
  };

  const submitScore = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score, game: 'prime' })
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
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
      setFeedback({ type: "correct", message: "?뺣떟!" });
      setTimeout(() => {
        generateProblem();
      }, 500);
    } else {
      setFeedback({ type: "wrong", message: "?? ??몄뼱??" });
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
              以? ?뚯닔 李얘린 ?ㅽ뵾??寃뚯엫 ??            </h1>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 text-lg">
              <strong>1遺?/strong> ?숈븞 理쒕???留롮? ?レ옄瑜?蹂닿퀬 ?뚯닔?몄? ?⑹꽦?섏씤吏 留욏?蹂댁꽭??<br />
              ?뺣떟??留욏옄 ?뚮쭏??10?먯쓣 ?살뼱?? 湲고쉶??<strong>3踰?/strong>?낅땲??
            </p>

            <button
              onClick={startGame}
              className="px-10 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-pink-200 dark:hover:shadow-none"
            >
              寃뚯엫 ?쒖옉?섍린 ??
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
                <Timer className="w-5 h-5" /> {timeLeft}珥?              </div>
              <div className="flex items-center gap-1">
                {[...Array(10)].map((_, i) => (
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
              <span className="text-pink-400 text-sm font-bold mb-2 block tracking-widest">???レ옄??</span>
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
                ?뚯닔??
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={!!feedback}
                className="py-6 px-6 rounded-2xl font-bold text-xl md:text-2xl border-2 transition-all bg-white dark:bg-pink-900/20 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 active:scale-95"
              >
                ?⑹꽦?섎떎!
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
              寃뚯엫 醫낅즺! ??            </h1>
            <p className="text-5xl font-black text-pink-500 mb-4">{score}??/p>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 text-lg">
              ?뺣쭚 ?뚮??댁슂! ?뱀떊??吏꾩젙??1?깆엯?덈떎! ?럦
            </p>

            {!submitted ? (
              <div className="max-w-xs mx-auto mb-8 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="?뱀떊??硫뗭쭊 ?됰꽕??
                  maxLength={10}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950 focus:outline-none focus:border-pink-400 font-bold text-center"
                />
                <button
                  onClick={submitScore}
                  disabled={!playerName.trim() || isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "?깅줉 以?.." : "紐낆삁???꾨떦 ?깅줉?섍린 ?룇"}
                </button>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 /> ??궧 ?깅줉 ?꾨즺!
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> ?ㅼ떆 ?섍린
              </button>
              <Link
                href="/ranking"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
              >
                <Trophy className="w-5 h-5" /> ??궧 ?뺤씤
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
              >
                <ArrowLeft className="w-5 h-5" /> 硫붿씤?쇰줈
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

