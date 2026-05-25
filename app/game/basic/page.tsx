"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Heart, RefreshCcw, CheckCircle2, XCircle, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

type Problem = {
  id: number;
  question: string | React.ReactNode;
  options: string[];
  answer: string;
  explanation: string;
};

const PROBLEMS: Problem[] = [
  {
    id: 1,
    question: "다음 중 소수의 개수는?\n{ 2, 4, 5, 8, 9, 11, 13, 15 }",
    options: ["2개", "3개", "4개", "5개"],
    answer: "4개",
    explanation: "소수는 1과 자기 자신만을 약수로 가지는 수예요. 위 집합에서 소수는 2, 5, 11, 13으로 총 4개입니다!"
  },
  {
    id: 2,
    question: "다음은 90을 소인수분해하는 과정입니다. (가)와 (나)에 들어갈 수의 합은?\n90 = 2 × (가)\n(가) = 3 × (나)\n(나) = 3 × 5",
    options: ["45", "50", "60", "75"],
    answer: "60",
    explanation: "90 = 2 × 45 이므로 (가)는 45입니다. 45 = 3 × 15 이므로 (나)는 15입니다. 따라서 45 + 15 = 60 입니다!"
  },
  {
    id: 3,
    question: "다음은 24와 30의 최소공배수를 구하는 과정입니다. 최소공배수는 무엇일까요?\n24 = 2³ × 3\n30 = 2 × 3 × 5",
    options: ["120", "150", "180", "240"],
    answer: "120",
    explanation: "최소공배수는 공통인 소인수 중 지수가 크거나 같은 것과 공통이 아닌 소인수를 모두 곱합니다. 2³ × 3 × 5 = 120 입니다!"
  },
  {
    id: 4,
    question: "정수와 유리수에 대한 설명 중 옳은 것은?",
    options: ["3.14는 정수이다.", "0은 양의 정수이다.", "-5는 음의 정수이다.", "1/3은 정수이다."],
    answer: "-5는 음의 정수이다.",
    explanation: "-5는 음의 부호가 붙은 자연수이므로 음의 정수가 맞습니다. 0은 양의 정수도 음의 정수도 아닙니다!"
  },
  {
    id: 5,
    question: "두 수 중 더 작은 수를 계속 선택하여 도착하는 숫자는 무엇일까요?\n[시작] (-3) 과 (-5/2) 중 작은 수 선택 → 그 다음 결과와 (0) 중 작은 수 선택",
    options: ["-3", "-5/2", "0", "없음"],
    answer: "-3",
    explanation: "-3과 -5/2(-2.5) 중에서는 -3이 더 작습니다. 그 다음 -3과 0 중에서는 -3이 더 작으므로 최종 도착 숫자는 -3입니다!"
  },
  {
    id: 6,
    question: "-3 - (-5) 를 계산한 값은?",
    options: ["-8", "-2", "2", "8"],
    answer: "2",
    explanation: "뺄셈은 더하기로 바꾸고 뒤의 수의 부호를 바꿉니다. -3 + (+5) = 2 가 됩니다!"
  },
  {
    id: 7,
    question: "1개에 500원인 과자 x개와 1개에 800원인 아이스크림 y개를 샀을 때의 총 가격을 식으로 나타내면?",
    options: ["1300xy", "500x + 800y", "800x + 500y", "1300(x+y)"],
    answer: "500x + 800y",
    explanation: "(과자 1개의 가격 × 과자의 개수) + (아이스크림 1개의 가격 × 아이스크림 개수) = 500x + 800y 입니다!"
  },
  {
    id: 8,
    question: "x = 4, y = 2 일 때, (x² / y) + 3y 의 값은?",
    options: ["10", "12", "14", "16"],
    answer: "14",
    explanation: "x에 4, y에 2를 대입하면 (4² / 2) + 3×2 = (16 / 2) + 6 = 8 + 6 = 14 입니다!"
  },
  {
    id: 9,
    question: "3(x - 2) - 2(x - 4) 를 간단히 한 것은?",
    options: ["x - 14", "x - 2", "x + 2", "5x - 14"],
    answer: "x + 2",
    explanation: "분배법칙을 이용해 괄호를 풀면 3x - 6 - 2x + 8 이 되고, 동류항끼리 계산하면 x + 2 가 됩니다!"
  },
  {
    id: 10,
    question: "x의 값이 1, 2, 3, 4, 5일 때, 방정식 4x - 5 = 7 의 해는?",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation: "4x - 5 = 7 에서 4x = 12 이므로 x = 3 입니다."
  },
  {
    id: 11,
    question: "방정식 3x + 4 = 13 의 해를 구하기 위해 가장 먼저 양변에 해야 할 일은?",
    options: ["양변에 4를 더한다.", "양변에서 4를 뺀다.", "양변을 3으로 나눈다.", "양변에 3을 곱한다."],
    answer: "양변에서 4를 뺀다.",
    explanation: "가장 먼저 좌변의 상수항(+4)을 없애기 위해 양변에서 4를 빼는 것이 등식의 성질을 이용한 올바른 순서입니다."
  },
  {
    id: 12,
    question: "다음 중 일차방정식인 것을 모두 고르시오.\nㄱ. 2x - 3 = 0\nㄴ. 3(x+1) = 3x + 3\nㄷ. x² + 2 = x\nㄹ. 4x - 1 = 2x + 5",
    options: ["ㄱ, ㄴ", "ㄱ, ㄹ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
    answer: "ㄱ, ㄹ",
    explanation: "ㄴ은 좌변과 우변이 같은 항등식이고, ㄷ은 x²이 있는 이차방정식입니다. 일차방정식은 (일차식)=0 형태여야 하므로 ㄱ, ㄹ입니다!"
  },
  {
    id: 13,
    question: "다음 중 점의 좌표와 사분면에 대한 설명으로 옳은 것은?\nA(-3, 4), B(5, 0), C(2, -2)",
    options: ["점 A의 x좌표는 4이다.", "점 B는 제1사분면 위에 있다.", "점 C는 제4사분면 위에 있다.", "점 A와 C는 같은 사분면에 있다."],
    answer: "점 C는 제4사분면 위에 있다.",
    explanation: "점 A(-3, 4)는 제2사분면, 점 C(2, -2)는 제4사분면에 있습니다. 점 B(5, 0)은 x축 위에 있으므로 어느 사분면에도 속하지 않습니다!"
  },
  {
    id: 14,
    question: "정비례 관계 y = ax 의 그래프가 점 (4, 3)을 지날 때, a의 값은?",
    options: ["3/4", "4/3", "12", "7"],
    answer: "3/4",
    explanation: "y = ax 에 x=4, y=3을 대입하면 3 = 4a 가 됩니다. 따라서 a = 3/4 입니다!"
  },
  {
    id: 15,
    question: "직각삼각형을 빗변을 회전축으로 하여 1회전 시킬 때 만들어지는 입체도형은?",
    options: ["원기둥", "원뿔", "구", "원뿔 2개를 붙인 모양"],
    answer: "원뿔 2개를 붙인 모양",
    explanation: "직각삼각형의 빗변을 축으로 회전시키면 위아래로 원뿔이 두 개 붙어있는 형태의 입체도형(팽이 모양)이 만들어집니다!"
  },
  {
    id: 16,
    question: "가로 4cm, 세로 5cm, 높이 3cm인 직육면체의 겉넓이는?",
    options: ["60 cm²", "74 cm²", "94 cm²", "120 cm²"],
    answer: "94 cm²",
    explanation: "직육면체의 겉넓이는 2 × (가로×세로 + 세로×높이 + 높이×가로) 입니다. 2 × (20 + 15 + 12) = 2 × 47 = 94 cm² 입니다!"
  },
  {
    id: 17,
    question: "밑면의 반지름의 길이가 3cm이고 높이가 8cm인 원뿔의 부피는?",
    options: ["24π cm³", "36π cm³", "48π cm³", "72π cm³"],
    answer: "24π cm³",
    explanation: "원뿔의 부피는 1/3 × (밑넓이) × (높이) 입니다. 1/3 × (3²π) × 8 = 1/3 × 9π × 8 = 24π cm³ 입니다!"
  },
  {
    id: 18,
    question: "팔각형의 대각선의 총 개수는?",
    options: ["14개", "20개", "27개", "35개"],
    answer: "20개",
    explanation: "n각형의 대각선의 개수 구하는 공식은 n(n-3)/2 입니다. 8 × (8-3) / 2 = 8 × 5 / 2 = 20개 입니다!"
  },
  {
    id: 19,
    question: "육각형의 내각의 크기의 합은?",
    options: ["540°", "720°", "900°", "1080°"],
    answer: "720°",
    explanation: "n각형의 내각의 합은 180° × (n-2) 입니다. 육각형이므로 180° × (6-2) = 180° × 4 = 720° 입니다!"
  },
  {
    id: 20,
    question: "반지름의 길이가 9cm이고 중심각의 크기가 120°인 부채꼴의 넓이는?",
    options: ["18π cm²", "27π cm²", "36π cm²", "54π cm²"],
    answer: "27π cm²",
    explanation: "부채꼴의 넓이는 πr² × (중심각/360°) 입니다. 81π × (120/360) = 81π × 1/3 = 27π cm² 입니다!"
  },
  {
    id: 21,
    question: "공간에서 두 직선이 서로 만나지도 않고 평행하지도 않을 때, 이 두 직선의 위치 관계를 무엇이라고 할까요?",
    options: ["평행", "수직", "일치", "꼬인 위치"],
    answer: "꼬인 위치",
    explanation: "직육면체 등의 공간도형에서 서로 만나지도 않고 평행하지도 않은 두 직선(모서리)은 '꼬인 위치'에 있다고 합니다!"
  },
  {
    id: 22,
    question: "두 평행한 직선이 한 직선과 만날 때 생기는 동위각과 엇각에 대한 설명으로 옳은 것은?",
    options: ["동위각의 크기는 항상 다릅니다.", "엇각의 크기는 항상 같습니다.", "평행하지 않아도 엇각은 같습니다.", "동위각의 합은 180도입니다."],
    answer: "엇각의 크기는 항상 같습니다.",
    explanation: "두 직선이 '평행'할 때 동위각의 크기와 엇각의 크기는 각각 서로 완벽하게 같습니다!"
  },
  {
    id: 23,
    question: "다음 중 두 삼각형이 합동이 되기 위한 조건이 아닌 것은?",
    options: ["세 변의 길이가 같을 때 (SSS)", "두 변과 끼인각이 같을 때 (SAS)", "한 변과 양 끝각이 같을 때 (ASA)", "세 각의 크기가 같을 때 (AAA)"],
    answer: "세 각의 크기가 같을 때 (AAA)",
    explanation: "세 각의 크기가 같은 삼각형(AAA)은 모양은 같지만 크기는 서로 다를 수 있습니다. 따라서 '닮음'일 수는 있지만 '합동'조건은 아닙니다!"
  },
  {
    id: 24,
    question: "지름의 길이가 10cm인 원의 둘레의 길이는? (원주율은 π)",
    options: ["5π cm", "10π cm", "20π cm", "25π cm"],
    answer: "10π cm",
    explanation: "원의 둘레(원주) 구하는 공식은 (지름) × π 또는 2πr 입니다. 따라서 지름 10cm × π = 10π cm 입니다!"
  },
  {
    id: 25,
    question: "학생 5명의 하루 독서 시간이 각각 15분, 30분, 10분, 45분, 20분일 때, 이 자료의 중앙값은?",
    options: ["15분", "20분", "25분", "30분"],
    answer: "20분",
    explanation: "자료를 작은 값부터 순서대로 나열하면 10, 15, 20, 30, 45입니다. 정가운데(3번째) 있는 값이 중앙값이므로 20분입니다!"
  }
];

export default function BasicMathGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);

  const startGame = () => {
    setScore(0);
    setLives(10);
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
      <div className="w-full max-w-3xl bg-white/50 dark:bg-emerald-900/10 backdrop-blur-xl rounded-3xl border-2 border-emerald-100 dark:border-emerald-900 shadow-2xl overflow-hidden p-6 sm:p-10">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Star className="w-16 h-16 text-emerald-500 fill-emerald-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-emerald-100 mb-4">
              기초 탄탄 마라톤! 🌱
            </h1>
            <p className="text-emerald-900/70 dark:text-emerald-100/70 mb-8 text-lg font-medium leading-relaxed">
              중2 수학 기초를 다지는 25단계 스테이지!<br />
              올려주신 향상도 검사지와 동형 문제들로 구성했어요.<br />
              <strong className="text-emerald-600 dark:text-emerald-400">하트는 총 10개!</strong> 끝까지 클리어해 볼까요?
            </p>
            <button
              onClick={startGame}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-emerald-200 dark:hover:shadow-none hover:-translate-y-1"
            >
              게임 시작하기 🚀
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center bg-white dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold">
                  STAGE {currentProblemIndex + 1} / {PROBLEMS.length}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-7 h-7 transition-all duration-300 ${
                      i < lives ? "text-red-500 fill-red-500 scale-100" : "text-gray-300 dark:text-gray-700 scale-75"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="py-10 px-6 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-3xl border-2 border-emerald-100 dark:border-emerald-800 text-center shadow-inner min-h-[200px] flex items-center justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-emerald-50 leading-snug whitespace-pre-wrap">
                {currentProblem.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentProblem.options.map((option, index) => {
                const isCorrectAnswer = option === currentProblem.answer;

                let btnClass = "bg-white dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30";
                
                if (feedback) {
                  if (isCorrectAnswer) {
                    btnClass = "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200";
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
              <div className="bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-4">
                <div className={`flex items-start gap-3 mb-4 ${feedback.type === "correct" ? "text-emerald-600" : "text-red-500"}`}>
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
            <h1 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 mb-2">
              도전 완료!
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold mb-6">
              총 {PROBLEMS.length}스테이지 중 {currentProblemIndex + (lives > 0 ? 1 : 0)}스테이지 도달
            </p>
            
            <div className="flex justify-center items-center gap-4 mb-10">
              <div className="text-center">
                <div className="text-5xl font-black text-emerald-500 mb-1">{score}점</div>
                <div className="text-sm font-bold text-gray-500">최종 점수</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-lg transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> 다시 도전하기
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 rounded-full font-bold text-lg transition-all hover:bg-emerald-50"
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
