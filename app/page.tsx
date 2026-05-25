import Link from "next/link";
import Image from "next/image";
import { Zap, Sprout, Rocket, Lock, TrendingUp, Brain, Trophy, Bot, Upload } from "lucide-react";

const games = [
  {
    href: "/game/prime",
    icon: Zap,
    title: "소수 찾기",
    subtitle: "1분 스피드 게임",
    description: "1분 안에 소수인지 판별하라!",
    gradient: "from-blue-400 to-cyan-500",
    glow: "rgba(96,165,250,0.4)",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-500",
    textColor: "text-blue-900 dark:text-blue-100",
    subColor: "text-blue-500",
    badge: "⚡ SPEED",
    badgeBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  },
  {
    href: "/game",
    icon: TrendingUp,
    title: "일차부등식",
    subtitle: "2분 챌린지",
    description: "부등식 해를 골라라! 기회는 3번",
    gradient: "from-pink-400 to-rose-500",
    glow: "rgba(244,114,182,0.4)",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    iconBg: "bg-pink-100 dark:bg-pink-900/40",
    iconColor: "text-pink-500",
    textColor: "text-pink-900 dark:text-pink-100",
    subColor: "text-pink-500",
    badge: "✨ HOT",
    badgeBg: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400",
  },
  {
    href: "/game/mini",
    icon: Brain,
    title: "10초 암산",
    subtitle: "서바이벌",
    description: "10초! 콤보로 고득점 노려봐!",
    gradient: "from-orange-400 to-amber-500",
    glow: "rgba(249,115,22,0.4)",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-500",
    textColor: "text-orange-900 dark:text-orange-100",
    subColor: "text-orange-500",
    badge: "🔥 COMBO",
    badgeBg: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400",
  },
  {
    href: "/game/basic",
    icon: Sprout,
    title: "기초 탄탄 마라톤",
    subtitle: "25단계 · 하트 10개",
    description: "중2 기초 향상도 동형 문제!",
    gradient: "from-emerald-400 to-green-500",
    glow: "rgba(52,211,153,0.4)",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-500",
    textColor: "text-emerald-900 dark:text-emerald-100",
    subColor: "text-emerald-500",
    badge: "🌱 NEW",
    badgeBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
  },
  {
    href: "/game/basic2",
    icon: Rocket,
    title: "기초 탄탄 마라톤 2탄",
    subtitle: "25단계 · 하트 10개",
    description: "새로운 동형 문제로 다시 도전!",
    gradient: "from-violet-400 to-purple-500",
    glow: "rgba(139,92,246,0.4)",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-500",
    textColor: "text-violet-900 dark:text-violet-100",
    subColor: "text-violet-500",
    badge: "🚀 2탄",
    badgeBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
  },
  {
    href: "/game/system-eq",
    icon: Lock,
    title: "연립방정식 해킹",
    subtitle: "3분 · 하트 10개",
    description: "Vault Cracker - x, y를 입력하라!",
    gradient: "from-cyan-400 to-teal-500",
    glow: "rgba(6,182,212,0.4)",
    bg: "bg-cyan-950 dark:bg-cyan-950",
    border: "border-cyan-700 dark:border-cyan-700",
    iconBg: "bg-cyan-900",
    iconColor: "text-cyan-400",
    textColor: "text-cyan-100",
    subColor: "text-cyan-400",
    badge: "🔐 HACK",
    badgeBg: "bg-cyan-900 text-cyan-300",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center w-full max-w-4xl mx-auto mb-14">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-900 dark:text-pink-100 tracking-tight mb-4">
          <span className="block">신영쌤의</span>
          <span className="flex justify-center items-center gap-3 text-pink-500 dark:text-pink-400 mt-2">
            수학교실
            <Image src="/logo.png" alt="신영쌤 로고" width={56} height={56} className="rounded-full object-cover shadow-sm" />
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-pink-900/60 dark:text-pink-100/60 mx-auto">
          신영쌤과 함께하는 즐거운 수학 시간
        </p>
      </div>

      {/* Game Cards */}
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest text-pink-400 uppercase mb-5 text-center">🎮 게임 선택</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.href}
                href={game.href}
                className={`group relative flex flex-col p-5 rounded-2xl border-2 ${game.bg} ${game.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
                style={{ boxShadow: `0 4px 24px ${game.glow}22` }}
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${game.gradient} rounded-t-2xl`} />

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${game.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-7 h-7 ${game.iconColor}`} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${game.badgeBg}`}>
                    {game.badge}
                  </span>
                </div>

                <h3 className={`font-black text-lg leading-tight mb-1 ${game.textColor}`}>{game.title}</h3>
                <p className={`text-xs font-bold mb-2 ${game.subColor}`}>{game.subtitle}</p>
                <p className={`text-sm ${game.textColor} opacity-70`}>{game.description}</p>

                {/* Arrow */}
                <div className={`absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 ${game.subColor}`}>
                  →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/ranking"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 font-bold hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <Trophy className="w-5 h-5" />
            명예의 전당
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-bold hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <Bot className="w-5 h-5" />
            신영쌤 AI 질문하기
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <Upload className="w-5 h-5" />
            이미지 업로드
          </Link>
        </div>
      </div>
    </div>
  );
}
