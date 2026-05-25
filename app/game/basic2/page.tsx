"use client";

import React, { useState } from "react";
import { ArrowLeft, Trophy, Heart, RefreshCcw, CheckCircle2, XCircle, ChevronRight, Rocket } from "lucide-react";
import Link from "next/link";

type Problem = {
  id: number;
  question: string | React.ReactNode;
  options: string[];
  answer: string;
  explanation: string;
};

const PROBLEMS: Problem[] = [
  { id: 1, question: "다음 수 중 소수를 모두 고른 것은?\n{2, 7, 9, 14, 17, 21, 23}", options: ["2, 7, 17", "2, 7, 17, 23", "7, 17, 23", "2, 9, 17, 21"], answer: "2, 7, 17, 23", explanation: "소수는 1과 자기 자신만을 약수로 가지는 수입니다. 2, 7, 17, 23이 소수입니다!" },
  { id: 2, question: "다음은 120을 소인수분해하는 과정이다. (가)와 (나)에 들어갈 수의 합은?\n120 = 2³ × (가)\n(가) = 3 × (나)", options: ["15", "20", "25", "30"], answer: "20", explanation: "120 = 8 × 15 이므로 (가)는 15입니다. 15 = 3 × 5 이므로 (나)는 5입니다. 합은 15 + 5 = 20 입니다." },
  { id: 3, question: "36(2²×3²)과 40(2³×5)의 최소공배수는?", options: ["2²×3²", "2³×3²×5", "2³×5", "2²×3²×5"], answer: "2³×3²×5", explanation: "최소공배수는 공통인 소인수 중 지수가 큰 것과 공통이 아닌 것을 모두 곱하므로 2³ × 3² × 5 (360) 입니다." },
  { id: 4, question: "정수와 유리수에 대한 설명 중 옳은 것은?", options: ["모든 유리수는 정수이다.", "모든 정수는 유리수이다.", "0은 유리수가 아니다.", "자연수는 음의 정수이다."], answer: "모든 정수는 유리수이다.", explanation: "정수는 분수 꼴로 나타낼 수 있으므로 모두 유리수에 포함됩니다!" },
  { id: 5, question: "다음 세 수 중 가장 큰 수는 무엇일까요?\n-5, -7/2, -1", options: ["-5", "-7/2", "-1", "비교할 수 없음"], answer: "-1", explanation: "-7/2는 -3.5입니다. 음수는 절댓값이 작을수록 크므로 -1이 가장 큽니다!" },
  { id: 6, question: "-8 - (-4) 를 계산한 값은?", options: ["-12", "-4", "4", "12"], answer: "-4", explanation: "-8 - (-4) = -8 + (+4) = -4 가 됩니다!" },
  { id: 7, question: "1개에 1200원인 빵 a개와 1500원인 우유 b개를 샀을 때 총 가격을 식으로 나타내면?", options: ["2700ab", "1500a + 1200b", "1200a + 1500b", "2700(a+b)"], answer: "1200a + 1500b", explanation: "(빵 1개 가격 × a) + (우유 1개 가격 × b) = 1200a + 1500b 입니다." },
  { id: 8, question: "x = 3, y = -2 일 때, x² - 2y 의 값은?", options: ["5", "9", "13", "15"], answer: "13", explanation: "대입하면 3² - 2(-2) = 9 - (-4) = 9 + 4 = 13 입니다." },
  { id: 9, question: "4(x - 1) - 3(x - 2) 를 간단히 한 것은?", options: ["x - 10", "x + 2", "x - 2", "7x - 10"], answer: "x + 2", explanation: "분배법칙으로 풀면 4x - 4 - 3x + 6 = x + 2 입니다." },
  { id: 10, question: "x의 값이 1, 2, 3, 4일 때, 방정식 3x - 4 = 5 의 해는?", options: ["1", "2", "3", "4"], answer: "3", explanation: "3x = 9 가 되므로 해는 x = 3 입니다." },
  { id: 11, question: "등식의 성질을 이용하여 2x - 5 = 7 을 풀기 위해 가장 먼저 해야 할 일은?", options: ["양변에 5를 더한다.", "양변에서 5를 뺀다.", "양변을 2로 나눈다.", "양변에 2를 곱한다."], answer: "양변에 5를 더한다.", explanation: "가장 먼저 좌변의 -5를 없애기 위해 양변에 5를 더해야 합니다." },
  { id: 12, question: "다음 중 일차방정식인 것을 고르시오.", options: ["2x + 1 = 2(x - 3)", "x² = 0", "3x - 2 = x + 4", "5x + 3"], answer: "3x - 2 = x + 4", explanation: "2x+1=2x-6은 일차항이 소거되어 방정식이 아닙니다. 3x-2=x+4는 2x-6=0이 되어 일차방정식입니다." },
  { id: 13, question: "점 P(4, -5)가 속하는 사분면은?", options: ["제1사분면", "제2사분면", "제3사분면", "제4사분면"], answer: "제4사분면", explanation: "x좌표가 양수(+), y좌표가 음수(-)이므로 제4사분면입니다." },
  { id: 14, question: "정비례 관계 y = ax 의 그래프가 점 (-2, -6)을 지날 때, a의 값은?", options: ["-3", "1/3", "3", "8"], answer: "3", explanation: "y = ax 에 x=-2, y=-6을 대입하면 -6 = -2a, 따라서 a = 3 입니다." },
  { id: 15, question: "직사각형의 한 변을 회전축으로 하여 1회전 시킬 때 만들어지는 입체도형은?", options: ["원기둥", "원뿔", "구", "원뿔대"], answer: "원기둥", explanation: "직사각형을 회전시키면 반듯한 기둥 모양인 원기둥이 됩니다." },
  { id: 16, question: "한 모서리의 길이가 5cm인 정육면체의 겉넓이는?", options: ["100 cm²", "125 cm²", "150 cm²", "175 cm²"], answer: "150 cm²", explanation: "정육면체는 넓이가 25cm²인 정사각형 6개로 이루어져 있으므로 25 × 6 = 150 cm² 입니다." },
  { id: 17, question: "밑면의 반지름의 길이가 5cm이고 높이가 6cm인 원기둥의 부피는?", options: ["30π cm³", "75π cm³", "150π cm³", "300π cm³"], answer: "150π cm³", explanation: "원기둥의 부피 = 밑넓이 × 높이 = (25π) × 6 = 150π cm³ 입니다." },
  { id: 18, question: "칠각형의 대각선의 총 개수는?", options: ["14개", "20개", "27개", "35개"], answer: "14개", explanation: "n(n-3)/2 공식에 n=7을 대입하면 7 × 4 / 2 = 14개 입니다." },
  { id: 19, question: "팔각형의 내각의 크기의 합은?", options: ["720°", "900°", "1080°", "1260°"], answer: "1080°", explanation: "180° × (8-2) = 180° × 6 = 1080° 입니다." },
  { id: 20, question: "반지름의 길이가 6cm이고 중심각의 크기가 90°인 부채꼴의 넓이는?", options: ["6π cm²", "9π cm²", "12π cm²", "36π cm²"], answer: "9π cm²", explanation: "36π × (90/360) = 36π × 1/4 = 9π cm² 입니다." },
  { id: 21, question: "공간에서 한 평면 위에 있지도 않고 만나지도 않는 두 직선의 위치 관계는?", options: ["평행", "수직", "꼬인 위치", "일치"], answer: "꼬인 위치", explanation: "공간에서 평행하지도 만나지도 않는 관계를 꼬인 위치라고 합니다." },
  { id: 22, question: "두 평행한 직선과 한 직선이 만날 때 생기는 엇각의 크기에 대한 설명으로 옳은 것은?", options: ["항상 서로 다르다.", "합이 180도이다.", "항상 서로 같다.", "합이 90도이다."], answer: "항상 서로 같다.", explanation: "평행선에서 엇각의 크기는 항상 완벽하게 일치합니다." },
  { id: 23, question: "두 변의 길이가 각각 같고, 그 끼인각의 크기가 같을 때의 합동 조건은?", options: ["SSS 합동", "SAS 합동", "ASA 합동", "RHA 합동"], answer: "SAS 합동", explanation: "Side(변)-Angle(각)-Side(변) 이므로 SAS 합동입니다." },
  { id: 24, question: "지름의 길이가 8cm인 원의 넓이는?", options: ["8π cm²", "16π cm²", "32π cm²", "64π cm²"], answer: "16π cm²", explanation: "지름이 8cm이면 반지름은 4cm입니다. 원의 넓이 = πr² = 16π cm² 입니다." },
  { id: 25, question: "수학 점수가 80점, 90점, 85점, 95점인 4명의 평균 점수는?", options: ["85점", "87.5점", "90점", "92.5점"], answer: "87.5점", explanation: "(80+90+85+95) / 4 = 350 / 4 = 87.5점 입니다." }
];

export default function BasicMathGame2() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);

  const startGame = () => {
    setScore(0);
    setLives(5);
    setCurrentProblemIndex(0);
    setGameState("playing");
    setFeedback(null);
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;

    const currentProblem = PROBLEMS[currentProblemIndex];

    if (option === currentProblem.answer) {
      setScore(s => s + 10);
      setFeedback({ type: "correct", message: "정답입니다! 🎉\n" + currentProblem.explanation });
    } else {
      setLives(l => l - 1);
      setFeedback({ type: "wrong", message: "틀렸어요. 😢\n" + currentProblem.explanation });
    }
  };

  const nextProblem = () => {
    setFeedback(null);
    if (lives <= 0 && feedback?.type === "wrong") {
      setGameState("end");
    } else if (currentProblemIndex < PROBLEMS.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    } else {
      setGameState("end");
    }
  };

  const currentProblem = PROBLEMS[currentProblemIndex];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/50 dark:bg-violet-900/10 backdrop-blur-xl rounded-3xl border-2 border-violet-100 dark:border-violet-900 shadow-2xl overflow-hidden p-6 sm:p-10">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-5 bg-violet-100 dark:bg-violet-900/30 rounded-full">
              <Rocket className="w-16 h-16 text-violet-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-violet-900 dark:text-violet-100 mb-4">
              기초 탄탄 마라톤 2탄! 🚀
            </h1>
            <p className="text-violet-900/70 dark:text-violet-100/70 mb-8 text-lg font-medium leading-relaxed">
              새로운 동형 문제들로 구성된 25단계 두 번째 스테이지!<br />
              이번에도 확실하게 개념을 마스터해 봅시다.<br />
              <strong className="text-violet-600 dark:text-violet-400">하트는 넉넉하게 5개!</strong> 가벼운 마음으로 출발~
            </p>
            <button
              onClick={startGame}
              className="px-10 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-violet-200 dark:hover:shadow-none hover:-translate-y-1"
            >
              두 번째 게임 시작 🚀
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center bg-white dark:bg-violet-950/40 p-4 rounded-2xl border border-violet-100 dark:border-violet-900 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 dark:bg-violet-900 p-2 rounded-xl text-violet-600 dark:text-violet-400 font-bold">
                  STAGE {currentProblemIndex + 1} / {PROBLEMS.length}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-7 h-7 transition-all duration-300 ${
                      i < lives ? "text-red-500 fill-red-500 scale-100" : "text-gray-300 dark:text-gray-700 scale-75"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="py-10 px-6 bg-violet-50/50 dark:bg-violet-900/20 rounded-3xl border-2 border-violet-100 dark:border-violet-800 text-center shadow-inner min-h-[200px] flex items-center justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-violet-950 dark:text-violet-50 leading-snug whitespace-pre-wrap">
                {currentProblem.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentProblem.options.map((option, index) => {
                const isCorrectAnswer = option === currentProblem.answer;

                let btnClass = "bg-white dark:bg-violet-900/10 border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-100 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30";
                
                if (feedback) {
                  if (isCorrectAnswer) {
                    btnClass = "bg-violet-100 border-violet-500 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200";
                  } else {
                    btnClass = "opacity-50 border-gray-200 text-gray-400";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className={`py-5 px-6 rounded-2xl font-bold text-lg border-2 transition-all shadow-sm ${btnClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="bg-white dark:bg-violet-950 border border-violet-100 dark:border-violet-900 rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-4">
                <div className={`flex items-start gap-3 mb-4 ${feedback.type === "correct" ? "text-violet-600" : "text-red-500"}`}>
                  {feedback.type === "correct" ? <CheckCircle2 className="w-8 h-8 shrink-0" /> : <XCircle className="w-8 h-8 shrink-0" />}
                  <div className="font-bold text-lg whitespace-pre-wrap">
                    {feedback.message}
                  </div>
                </div>
                <button
                  onClick={nextProblem}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {lives <= 0 || currentProblemIndex === PROBLEMS.length - 1 ? "결과 보기" : "다음 문제로"} <ChevronRight />
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === "end" && (
          <div className="text-center py-12 animate-in zoom-in">
            <div className="mb-6 inline-block p-5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-black text-violet-900 dark:text-violet-100 mb-2">
              도전 완료!
            </h1>
            <p className="text-violet-600 dark:text-violet-400 font-bold mb-6">
              총 {PROBLEMS.length}스테이지 중 {currentProblemIndex + (lives > 0 ? 1 : 0)}스테이지 도달
            </p>
            
            <div className="flex justify-center items-center gap-4 mb-10">
              <div className="text-center">
                <div className="text-5xl font-black text-violet-500 mb-1">{score}점</div>
                <div className="text-sm font-bold text-gray-500">최종 점수</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-full font-bold text-lg transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> 다시 도전하기
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-violet-900/20 border-2 border-violet-100 dark:border-violet-900 text-violet-900 dark:text-violet-100 rounded-full font-bold text-lg transition-all hover:bg-violet-50"
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
