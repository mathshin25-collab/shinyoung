"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trophy, Heart, RefreshCcw, CheckCircle2, XCircle, Timer } from "lucide-react";
import Link from "next/link";

type Problem = {
  question: string;
  options: string[];
  answer: string;
};

export default function InequalityGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generateProblem = useCallback(() => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 20) - 10;
    const c = Math.floor(Math.random() * 20) - 10;
    const isGreater = Math.random() > 0.5;
    const operator = isGreater ? ">" : "<";
    
    const xValue = Math.floor(Math.random() * 10) - 5;
    const calculatedC = a * xValue + b;
    
    const question = `${a === 1 ? "" : a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${operator} ${calculatedC}`;
    const correctAnswer = `x ${operator} ${xValue}`;
    
    const options = [
      correctAnswer,
      `x ${isGreater ? "<" : ">"} ${xValue}`,
      `x ${operator} ${xValue + (Math.random() > 0.5 ? 1 : -1)}`,
      `x ${operator} ${-xValue}`,
    ].sort(() => Math.random() - 0.5);

    setCurrentProblem({ question, options, answer: correctAnswer });
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(120);
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
        body: JSON.stringify({ name: playerName, score, game: 'inequality' })
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

  const handleAnswer = (option: string) => {
    if (feedback) return;

    if (option === currentProblem?.answer) {
      setScore((s) => s + 10);
      setFeedback({ type: "correct", message: "정답이에요! 참 잘했어요! ✨" });
      setTimeout(() => {
        generateProblem();
      }, 1500);
    } else {
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setTimeout(() => {
            setGameState("end");
          }, 1500);
        } else {
          setTimeout(() => {
            generateProblem();
          }, 1500);
        }
        return newLives;
      });
      setFeedback({ type: "wrong", message: `아쉬워요! 정답은 ${currentProblem?.answer} 였어요. 😢` });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/50 dark:bg-pink-900/10 backdrop-blur-xl rounded-3xl border-2 border-pink-100 dark:border-pink-900 shadow-2xl overflow-hidden p-8">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <Trophy className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold text-pink-900 dark:text-pink-100 mb-4">
              일차부등식 챌린지 🌸
            </h1>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8 text-lg">
              신영쌤과 함께 일차부등식을 마스터해볼까요?<br />
              제한시간 <strong>2분</strong> 동안 최대한 많은 문제를 맞춰보세요!<br />
              기회는 <strong>3번</strong>입니다.
            </p>

            <button
              onClick={startGame}
              className="px-10 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-pink-200 dark:hover:shadow-none"
            >
              게임 시작하기 ✨
            </button>
          </div>
        )}

        {gameState === "playing" && currentProblem && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500 w-5 h-5" />
                <span className="font-bold text-pink-900 dark:text-pink-100 text-xl">Score: {score}</span>
              </div>
              <div className="flex items-center gap-2 font-black text-xl text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-4 py-2 rounded-full">
                <Timer className="w-5 h-5" /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
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

            <div className="py-12 bg-white dark:bg-pink-950/40 rounded-2xl border border-pink-50 dark:border-pink-900 text-center">
              <span className="text-pink-400 text-sm font-bold mb-2 block tracking-widest">NEXT PROBLEM</span>
              <h2 className="text-4xl md:text-5xl font-black text-pink-900 dark:text-pink-100">
                {currentProblem.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  className={`py-4 px-6 rounded-2xl font-bold text-lg border-2 transition-all
                    ${
                      feedback
                        ? option === currentProblem.answer
                          ? "bg-green-100 border-green-500 text-green-700"
                          : feedback.type === "wrong" && option === feedback.message.split(" ")[2]
                          ? "bg-red-100 border-red-500 text-red-700"
                          : "opacity-50 border-pink-100 text-pink-900/40"
                        : "bg-white dark:bg-pink-900/20 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/40"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && (
              <div
                className={`flex items-center justify-center gap-2 p-4 rounded-xl animate-bounce ${
                  feedback.type === "correct" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}
              >
                {feedback.type === "correct" ? <CheckCircle2 /> : <XCircle />}
                <span className="font-bold">{feedback.message}</span>
              </div>
            )}
          </div>
        )}

        {gameState === "end" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-pink-900 dark:text-pink-100 mb-2">
              게임 종료!
            </h1>
            <p className="text-5xl font-black text-pink-500 mb-4">{score}점</p>
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8">
              대단해요! 다음엔 더 높은 점수에 도전해볼까요? 🎉
            </p>

            {!submitted ? (
              <div className="max-w-xs mx-auto mb-8 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="당신의 멋진 닉네임"
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
                className="flex items-center justify-center gap-2 px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> 다시 하기
              </button>
              <Link
                href="/ranking"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
              >
                <Trophy className="w-5 h-5" /> 랭킹 확인
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
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
