"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trophy, Heart, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
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
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);
  const [studentInfo, setStudentInfo] = useState({ gradeClass: "", studentNum: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateProblem = useCallback(() => {
    // Generate ax + b > c or ax + b < c
    const a = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const b = Math.floor(Math.random() * 20) - 10; // -10 to 10
    const c = Math.floor(Math.random() * 20) - 10; // -10 to 10
    const isGreater = Math.random() > 0.5;
    const operator = isGreater ? ">" : "<";
    
    // Solve: ax + b > c => ax > c - b => x > (c-b)/a
    // To keep it simple for middle school, let's make (c-b) divisible by a
    const xValue = Math.floor(Math.random() * 10) - 5; // -5 to 5
    const calculatedC = a * xValue + b;
    
    const question = `${a === 1 ? "" : a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${operator} ${calculatedC}`;
    const correctAnswer = `x ${operator} ${xValue}`;
    
    // Generate distractors
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
    if (!studentInfo.gradeClass || !studentInfo.studentNum || !studentInfo.name) {
      alert("반, 번호, 이름을 모두 입력해주세요!");
      return;
    }
    setScore(0);
    setLives(3);
    setGameState("playing");
    generateProblem();
  };

  const submitScore = async (finalScore: number) => {
    setIsSubmitting(true);
    try {
      // 구글 앱스 스크립트 웹앱 URL (환경변수 또는 직접 입력)
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";
      if (!scriptUrl) {
        console.warn("Google Script URL is not set.");
        setIsSubmitting(false);
        return;
      }
      
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // CORS 우회를 위해 no-cors 사용
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gradeClass: studentInfo.gradeClass,
          studentNum: studentInfo.studentNum,
          name: studentInfo.name,
          score: finalScore,
          date: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error("Error submitting score:", error);
    }
    setIsSubmitting(false);
  };

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
            submitScore(score); // 게임 종료 시 점수 전송
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
            <p className="text-pink-900/60 dark:text-pink-100/60 mb-8">
              신영쌤과 함께 일차부등식을 마스터해볼까요?<br />
              정답을 맞힐 때마다 10점을 얻고, 기회는 3번이에요!
            </p>

            <div className="max-w-md mx-auto space-y-4 mb-8 bg-pink-50 dark:bg-pink-900/20 p-6 rounded-2xl border border-pink-100 dark:border-pink-900 text-left">
              <label className="block text-sm font-bold text-pink-900 dark:text-pink-100 mb-1">학번 및 이름 입력</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="반" 
                  className="w-1/3 px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={studentInfo.gradeClass}
                  onChange={(e) => setStudentInfo({...studentInfo, gradeClass: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="번호" 
                  className="w-1/3 px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={studentInfo.studentNum}
                  onChange={(e) => setStudentInfo({...studentInfo, studentNum: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="이름" 
                  className="w-1/3 px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                />
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-10 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-pink-200 dark:hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!studentInfo.gradeClass || !studentInfo.studentNum || !studentInfo.name}
            >
              게임 시작하기 ✨
            </button>
          </div>
        )}

        {gameState === "playing" && currentProblem && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500 w-5 h-5" />
                <span className="font-bold text-pink-900 dark:text-pink-100">Score: {score}</span>
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
              {isSubmitting ? "선생님께 결과를 전송하는 중... 📡" : "결과가 선생님께 전송되었습니다! 훌륭해요! 🎉"}
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
