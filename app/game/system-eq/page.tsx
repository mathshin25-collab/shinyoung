"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Lock, Unlock, Timer, XCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

type Problem = {
  question: string[];
  x: number;
  y: number;
};

// Generate a random system of equations
const generateSystemEq = (): Problem => {
  const x = Math.floor(Math.random() * 10) - 4; // -4 to 5
  const y = Math.floor(Math.random() * 10) - 4;
  
  // eq 1: a1*x + b1*y = c1
  const a1 = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const b1 = Math.floor(Math.random() * 4) + 1 * (Math.random() > 0.5 ? 1 : -1);
  const c1 = a1 * x + b1 * y;
  
  // eq 2: a2*x + b2*y = c2
  const a2 = Math.floor(Math.random() * 4) + 1 * (Math.random() > 0.5 ? 1 : -1);
  const b2 = Math.floor(Math.random() * 5) + 1;
  const c2 = a2 * x + b2 * y;
  
  // Ensure lines are not parallel
  if (a1 * b2 === a2 * b1) {
    return generateSystemEq();
  }

  const formatTerm = (coef: number, varName: string, isFirst: boolean) => {
    if (coef === 0) return "";
    let str = "";
    if (coef < 0) {
      str += isFirst ? "-" : " - ";
    } else if (!isFirst) {
      str += " + ";
    }
    const absCoef = Math.abs(coef);
    if (absCoef !== 1) {
      str += absCoef;
    }
    str += varName;
    return str;
  };

  const term1_x = formatTerm(a1, 'x', true);
  const term1_y = formatTerm(b1, 'y', term1_x === "");
  const eq1 = `${term1_x}${term1_y} = ${c1}`;
  
  const term2_x = formatTerm(a2, 'x', true);
  const term2_y = formatTerm(b2, 'y', term2_x === "");
  const eq2 = `${term2_x}${term2_y} = ${c2}`;

  return {
    question: [eq1, eq2],
    x,
    y
  };
};

export default function SystemEqGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [problem, setProblem] = useState<Problem | null>(null);
  const [inputX, setInputX] = useState("");
  const [inputY, setInputY] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [lives, setLives] = useState(10); // 10 lives

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (gameState === "playing" && timeLeft <= 0) {
      setGameState("end");
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(180);
    setLives(10);
    setProblem(generateSystemEq());
    setInputX("");
    setInputY("");
    setFeedback(null);
    setGameState("playing");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || feedback) return;

    if (parseInt(inputX) === problem.x && parseInt(inputY) === problem.y) {
      setFeedback("correct");
      setScore(s => s + 20);
      setTimeout(() => {
        setProblem(generateSystemEq());
        setInputX("");
        setInputY("");
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback("wrong");
      setLives(l => {
        if (l - 1 <= 0) {
          setTimeout(() => setGameState("end"), 1500);
        } else {
          setTimeout(() => {
            setInputX("");
            setInputY("");
            setFeedback(null);
          }, 1000);
        }
        return l - 1;
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-zinc-950 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-2xl bg-zinc-900 border border-cyan-900 shadow-[0_0_50px_rgba(8,145,178,0.2)] rounded-lg overflow-hidden p-8 text-cyan-500">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <Lock className="w-20 h-20 mx-auto mb-6 text-cyan-400 animate-pulse" />
            <h1 className="text-4xl font-black text-cyan-300 mb-4 tracking-widest uppercase">
              Vault Cracker
            </h1>
            <p className="text-cyan-600 mb-8 text-lg">
              [SYSTEM] 연립방정식 해킹 모듈 가동 준비 완료.<br />
              제한시간 3분 안에 최대한 많은 비밀 금고를 해킹하십시오.<br />
              패스워드는 연립방정식의 해 (x, y) 좌표입니다.<br />
              주의: 보안 시스템에 의해 10번 실패하면 차단됩니다.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 rounded font-bold text-xl uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105"
            >
              System Hack Start &gt;_
            </button>
          </div>
        )}

        {gameState === "playing" && problem && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-cyan-900 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-xl">DATA: {score}</span>
              </div>
              <div className="flex items-center gap-2 text-red-400 font-bold text-xl bg-red-950/30 px-4 py-1 border border-red-900/50 rounded">
                <Timer className="w-5 h-5" /> 
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex items-center gap-2 text-cyan-700 font-bold">
                LIVES: {lives}
              </div>
            </div>

            <div className="py-12 bg-zinc-950 border border-cyan-900/50 rounded flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-100 tracking-wider space-y-4 text-left">
                <div className="flex items-center gap-4">
                  <span className="text-cyan-600 select-none">{"{"}</span>
                  <div>
                    <div className="mb-2">{problem.question[0]}</div>
                    <div>{problem.question[1]}</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2 text-2xl">
                <span className="text-cyan-600">x =</span>
                <input
                  type="number"
                  value={inputX}
                  onChange={e => setInputX(e.target.value)}
                  className="w-24 bg-zinc-950 border border-cyan-700 text-cyan-100 p-2 text-center focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  disabled={!!feedback}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2 text-2xl">
                <span className="text-cyan-600">y =</span>
                <input
                  type="number"
                  value={inputY}
                  onChange={e => setInputY(e.target.value)}
                  className="w-24 bg-zinc-950 border border-cyan-700 text-cyan-100 p-2 text-center focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  disabled={!!feedback}
                />
              </div>
              <button 
                type="submit"
                disabled={!!feedback || inputX === "" || inputY === ""}
                className="bg-cyan-800 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-3 font-bold tracking-widest sm:ml-4 transition-all uppercase"
              >
                Unlock
              </button>
            </form>

            <div className="h-12 flex items-center justify-center">
              {feedback === "correct" && (
                <div className="flex items-center gap-2 text-green-400 font-bold animate-pulse text-lg">
                  <Unlock className="w-6 h-6" /> ACCESS GRANTED
                </div>
              )}
              {feedback === "wrong" && (
                <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse text-lg">
                  <XCircle className="w-6 h-6" /> ACCESS DENIED
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === "end" && (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 mx-auto mb-6 text-cyan-900" />
            <h1 className="text-3xl font-black text-cyan-100 mb-2 tracking-widest">
              CONNECTION TERMINATED
            </h1>
            <p className="text-cyan-700 mb-8 uppercase">Session Time Expired or Lives Depleted</p>
            
            <div className="text-6xl font-black text-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{score}</div>
            <div className="text-sm font-bold text-cyan-800 mb-10 tracking-widest">FINAL DATA EXTRACTED</div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 font-bold transition-all uppercase"
              >
                <RefreshCcw className="w-5 h-5" /> REBOOT
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-transparent hover:bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold transition-all uppercase"
              >
                <ArrowLeft className="w-5 h-5" /> EXIT
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
