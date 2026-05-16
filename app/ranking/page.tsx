"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Crown, ArrowLeft, Gamepad2, Timer, Zap } from "lucide-react";
import Link from "next/link";

type Ranking = {
  id: number;
  name: string;
  score: number;
  game: string;
  date: string;
};

export default function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [activeTab, setActiveTab] = useState<string>("prime");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings(activeTab);
  }, [activeTab]);

  const fetchRankings = async (game: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rankings?game=${game}`);
      const data = await res.json();
      setRankings(data);
    } catch (error) {
      console.error("Error fetching rankings", error);
    }
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-8 h-8 text-yellow-500 drop-shadow-md" />;
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400 drop-shadow-md" />;
    if (index === 2) return <Medal className="w-8 h-8 text-amber-700 drop-shadow-md" />;
    return <span className="text-xl font-bold text-pink-900/40 dark:text-pink-100/40">{index + 1}</span>;
  };

  const tabs = [
    { id: "prime", name: "소수 찾기", icon: <Timer className="w-5 h-5" /> },
    { id: "inequality", name: "일차부등식", icon: <Gamepad2 className="w-5 h-5" /> },
    { id: "mini", name: "10초 암산", icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-pink-900 dark:text-pink-100 mb-4 flex items-center justify-center gap-4">
          <Trophy className="w-10 h-10 text-yellow-500" />
          명예의 전당
          <Trophy className="w-10 h-10 text-yellow-500" />
        </h1>
        <p className="text-lg text-pink-900/60 dark:text-pink-100/60">
          신영쌤의 수학교실 최고 기록을 달성한 주인공들입니다! ✨
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === tab.id
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                : "bg-white dark:bg-pink-900/20 text-pink-900/60 dark:text-pink-100/60 hover:bg-pink-50 dark:hover:bg-pink-900/40 border border-pink-100 dark:border-pink-900"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white/80 dark:bg-pink-900/10 backdrop-blur-xl rounded-3xl border border-pink-100 dark:border-pink-900 shadow-xl overflow-hidden p-6 md:p-8">
        {loading ? (
          <div className="text-center py-20 text-pink-500 font-bold animate-pulse">
            기록을 불러오는 중입니다... 🏆
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-20 text-pink-900/40 dark:text-pink-100/40 font-bold">
            아직 기록이 없습니다. 첫 번째 랭커가 되어보세요! 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {rankings.map((ranking, index) => (
              <div 
                key={ranking.id} 
                className={`flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.01] ${
                  index === 0 ? "bg-gradient-to-r from-yellow-50 to-pink-50 dark:from-yellow-900/20 dark:to-pink-900/20 border-2 border-yellow-200 dark:border-yellow-900/50" : 
                  index < 3 ? "bg-white dark:bg-pink-950 border border-pink-100 dark:border-pink-900" : 
                  "bg-transparent border border-transparent hover:bg-pink-50 dark:hover:bg-pink-900/20"
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg md:text-xl ${index < 3 ? "text-pink-900 dark:text-pink-100" : "text-pink-900/80 dark:text-pink-100/80"}`}>
                      {ranking.name}
                    </h3>
                    <p className="text-xs text-pink-900/40 dark:text-pink-100/40">
                      {new Date(ranking.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-black text-2xl md:text-3xl ${
                  index === 0 ? "text-yellow-500" : 
                  index === 1 ? "text-gray-400" : 
                  index === 2 ? "text-amber-700" : 
                  "text-pink-400"
                }`}>
                  {ranking.score.toLocaleString()}<span className="text-sm font-bold text-pink-900/40 dark:text-pink-100/40 ml-1">점</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
        >
          <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
