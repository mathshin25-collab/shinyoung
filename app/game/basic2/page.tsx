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
  { id: 1, question: "?ㅼ쓬 ??以??뚯닔瑜?紐⑤몢 怨좊Ⅸ 寃껋??\n{2, 7, 9, 14, 17, 21, 23}", options: ["2, 7, 17", "2, 7, 17, 23", "7, 17, 23", "2, 9, 17, 21"], answer: "2, 7, 17, 23", explanation: "?뚯닔??1怨??먭린 ?먯떊留뚯쓣 ?쎌닔濡?媛吏???섏엯?덈떎. 2, 7, 17, 23???뚯닔?낅땲??" },
  { id: 2, question: "?ㅼ쓬? 120???뚯씤?섎텇?댄븯??怨쇱젙?대떎. (媛)? (?????ㅼ뼱媛??섏쓽 ?⑹??\n120 = 2쨀 횞 (媛)\n(媛) = 3 횞 (??", options: ["15", "20", "25", "30"], answer: "20", explanation: "120 = 8 횞 15 ?대?濡?(媛)??15?낅땲?? 15 = 3 횞 5 ?대?濡?(????5?낅땲?? ?⑹? 15 + 5 = 20 ?낅땲??" },
  { id: 3, question: "36(2짼횞3짼)怨?40(2쨀횞5)??理쒖냼怨듬같?섎뒗?", options: ["2짼횞3짼", "2쨀횞3짼횞5", "2쨀횞5", "2짼횞3짼횞5"], answer: "2쨀횞3짼횞5", explanation: "理쒖냼怨듬같?섎뒗 怨듯넻???뚯씤??以?吏?섍? ??寃껉낵 怨듯넻???꾨땶 寃껋쓣 紐⑤몢 怨깊븯誘濡?2쨀 횞 3짼 횞 5 (360) ?낅땲??" },
  { id: 4, question: "?뺤닔? ?좊━?섏뿉 ????ㅻ챸 以??녹? 寃껋??", options: ["紐⑤뱺 ?좊━?섎뒗 ?뺤닔?대떎.", "紐⑤뱺 ?뺤닔???좊━?섏씠??", "0? ?좊━?섍? ?꾨땲??", "?먯뿰?섎뒗 ?뚯쓽 ?뺤닔?대떎."], answer: "紐⑤뱺 ?뺤닔???좊━?섏씠??", explanation: "?뺤닔??遺꾩닔 瑗대줈 ?섑??????덉쑝誘濡?紐⑤몢 ?좊━?섏뿉 ?ы븿?⑸땲??" },
  { id: 5, question: "?ㅼ쓬 ????以?媛?????섎뒗 臾댁뾿?쇨퉴??\n-5, -7/2, -1", options: ["-5", "-7/2", "-1", "鍮꾧탳?????놁쓬"], answer: "-1", explanation: "-7/2??-3.5?낅땲?? ?뚯닔???덈뙎媛믪씠 ?묒쓣?섎줉 ?щ?濡?-1??媛???쎈땲??" },
  { id: 6, question: "-8 - (-4) 瑜?怨꾩궛??媛믪??", options: ["-12", "-4", "4", "12"], answer: "-4", explanation: "-8 - (-4) = -8 + (+4) = -4 媛 ?⑸땲??" },
  { id: 7, question: "1媛쒖뿉 1200?먯씤 鍮?a媛쒖? 1500?먯씤 ?곗쑀 b媛쒕? ?????珥?媛寃⑹쓣 ?앹쑝濡??섑??대㈃?", options: ["2700ab", "1500a + 1200b", "1200a + 1500b", "2700(a+b)"], answer: "1200a + 1500b", explanation: "(鍮?1媛?媛寃?횞 a) + (?곗쑀 1媛?媛寃?횞 b) = 1200a + 1500b ?낅땲??" },
  { id: 8, question: "x = 3, y = -2 ???? x짼 - 2y ??媛믪??", options: ["5", "9", "13", "15"], answer: "13", explanation: "??낇븯硫?3짼 - 2(-2) = 9 - (-4) = 9 + 4 = 13 ?낅땲??" },
  { id: 9, question: "4(x - 1) - 3(x - 2) 瑜?媛꾨떒????寃껋??", options: ["x - 10", "x + 2", "x - 2", "7x - 10"], answer: "x + 2", explanation: "遺꾨같踰뺤튃?쇰줈 ?硫?4x - 4 - 3x + 6 = x + 2 ?낅땲??" },
  { id: 10, question: "x??媛믪씠 1, 2, 3, 4???? 諛⑹젙??3x - 4 = 5 ???대뒗?", options: ["1", "2", "3", "4"], answer: "3", explanation: "3x = 9 媛 ?섎?濡??대뒗 x = 3 ?낅땲??" },
  { id: 11, question: "?깆떇???깆쭏???댁슜?섏뿬 2x - 5 = 7 ???湲??꾪빐 媛??癒쇱? ?댁빞 ???쇱??", options: ["?묐???5瑜??뷀븳??", "?묐??먯꽌 5瑜?類??", "?묐???2濡??섎늿??", "?묐???2瑜?怨깊븳??"], answer: "?묐???5瑜??뷀븳??", explanation: "媛??癒쇱? 醫뚮???-5瑜??놁븷湲??꾪빐 ?묐???5瑜??뷀빐???⑸땲??" },
  { id: 12, question: "?ㅼ쓬 以??쇱감諛⑹젙?앹씤 寃껋쓣 怨좊Ⅴ?쒖삤.", options: ["2x + 1 = 2(x - 3)", "x짼 = 0", "3x - 2 = x + 4", "5x + 3"], answer: "3x - 2 = x + 4", explanation: "2x+1=2x-6? ?쇱감??씠 ?뚭굅?섏뼱 諛⑹젙?앹씠 ?꾨떃?덈떎. 3x-2=x+4??2x-6=0???섏뼱 ?쇱감諛⑹젙?앹엯?덈떎." },
  { id: 13, question: "??P(4, -5)媛 ?랁븯???щ텇硫댁??", options: ["???щ텇硫?, "???щ텇硫?, "???щ텇硫?, "???щ텇硫?], answer: "???щ텇硫?, explanation: "x醫뚰몴媛 ?묒닔(+), y醫뚰몴媛 ?뚯닔(-)?대?濡????щ텇硫댁엯?덈떎." },
  { id: 14, question: "?뺣퉬濡 愿怨?y = ax ??洹몃옒?꾧? ??(-2, -6)??吏???? a??媛믪??", options: ["-3", "1/3", "3", "8"], answer: "3", explanation: "y = ax ??x=-2, y=-6????낇븯硫?-6 = -2a, ?곕씪??a = 3 ?낅땲??" },
  { id: 15, question: "吏곸궗媛곹삎????蹂???뚯쟾異뺤쑝濡??섏뿬 1?뚯쟾 ?쒗궗 ??留뚮뱾?댁????낆껜?꾪삎??", options: ["?먭린??, "?먮퓭", "援?, "?먮퓭?"], answer: "?먭린??, explanation: "吏곸궗媛곹삎???뚯쟾?쒗궎硫?諛섎벏??湲곕뫁 紐⑥뼇???먭린?μ씠 ?⑸땲??" },
  { id: 16, question: "??紐⑥꽌由ъ쓽 湲몄씠媛 5cm???뺤쑁硫댁껜??寃됰꼻?대뒗?", options: ["100 cm짼", "125 cm짼", "150 cm짼", "175 cm짼"], answer: "150 cm짼", explanation: "?뺤쑁硫댁껜???볦씠媛 25cm짼???뺤궗媛곹삎 6媛쒕줈 ?대（?댁졇 ?덉쑝誘濡?25 횞 6 = 150 cm짼 ?낅땲??" },
  { id: 17, question: "諛묐㈃??諛섏?由꾩쓽 湲몄씠媛 5cm?닿퀬 ?믪씠媛 6cm???먭린?μ쓽 遺?쇰뒗?", options: ["30? cm쨀", "75? cm쨀", "150? cm쨀", "300? cm쨀"], answer: "150? cm쨀", explanation: "?먭린?μ쓽 遺??= 諛묐꼻??횞 ?믪씠 = (25?) 횞 6 = 150? cm쨀 ?낅땲??" },
  { id: 18, question: "移좉컖?뺤쓽 ?媛곸꽑??珥?媛쒖닔??", options: ["14媛?, "20媛?, "27媛?, "35媛?], answer: "14媛?, explanation: "n(n-3)/2 怨듭떇??n=7????낇븯硫?7 횞 4 / 2 = 14媛??낅땲??" },
  { id: 19, question: "?붽컖?뺤쓽 ?닿컖???ш린???⑹??", options: ["720째", "900째", "1080째", "1260째"], answer: "1080째", explanation: "180째 횞 (8-2) = 180째 횞 6 = 1080째 ?낅땲??" },
  { id: 20, question: "諛섏?由꾩쓽 湲몄씠媛 6cm?닿퀬 以묒떖媛곸쓽 ?ш린媛 90째??遺梨꾧섦???볦씠??", options: ["6? cm짼", "9? cm짼", "12? cm짼", "36? cm짼"], answer: "9? cm짼", explanation: "36? 횞 (90/360) = 36? 횞 1/4 = 9? cm짼 ?낅땲??" },
  { id: 21, question: "怨듦컙?먯꽌 ???됰㈃ ?꾩뿉 ?덉????딄퀬 留뚮굹吏???딅뒗 ??吏곸꽑???꾩튂 愿怨꾨뒗?", options: ["?됲뻾", "?섏쭅", "瑗ъ씤 ?꾩튂", "?쇱튂"], answer: "瑗ъ씤 ?꾩튂", explanation: "怨듦컙?먯꽌 ?됲뻾?섏???留뚮굹吏???딅뒗 愿怨꾨? 瑗ъ씤 ?꾩튂?쇨퀬 ?⑸땲??" },
  { id: 22, question: "???됲뻾??吏곸꽑怨???吏곸꽑??留뚮궇 ???앷린???뉕컖???ш린??????ㅻ챸?쇰줈 ?녹? 寃껋??", options: ["??긽 ?쒕줈 ?ㅻⅤ??", "?⑹씠 180?꾩씠??", "??긽 ?쒕줈 媛숇떎.", "?⑹씠 90?꾩씠??"], answer: "??긽 ?쒕줈 媛숇떎.", explanation: "?됲뻾?좎뿉???뉕컖???ш린????긽 ?꾨꼍?섍쾶 ?쇱튂?⑸땲??" },
  { id: 23, question: "??蹂??湲몄씠媛 媛곴컖 媛숆퀬, 洹??쇱씤媛곸쓽 ?ш린媛 媛숈쓣 ?뚯쓽 ?⑸룞 議곌굔??", options: ["SSS ?⑸룞", "SAS ?⑸룞", "ASA ?⑸룞", "RHA ?⑸룞"], answer: "SAS ?⑸룞", explanation: "Side(蹂)-Angle(媛?-Side(蹂) ?대?濡?SAS ?⑸룞?낅땲??" },
  { id: 24, question: "吏由꾩쓽 湲몄씠媛 8cm???먯쓽 ?볦씠??", options: ["8? cm짼", "16? cm짼", "32? cm짼", "64? cm짼"], answer: "16? cm짼", explanation: "吏由꾩씠 8cm?대㈃ 諛섏?由꾩? 4cm?낅땲?? ?먯쓽 ?볦씠 = ?r짼 = 16? cm짼 ?낅땲??" },
  { id: 25, question: "?섑븰 ?먯닔媛 80?? 90?? 85?? 95?먯씤 4紐낆쓽 ?됯퇏 ?먯닔??", options: ["85??, "87.5??, "90??, "92.5??], answer: "87.5??, explanation: "(80+90+85+95) / 4 = 350 / 4 = 87.5???낅땲??" }
];

export default function BasicMathGame2() {
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
      setFeedback({ type: "correct", message: "?뺣떟?낅땲?? ?럦\n" + currentProblem.explanation });
    } else {
      setLives(l => l - 1);
      setFeedback({ type: "wrong", message: "??몄뼱?? ?삟\n" + currentProblem.explanation });
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
              湲곗큹 ?꾪깂 留덈씪??2?? ??
            </h1>
            <p className="text-violet-900/70 dark:text-violet-100/70 mb-8 text-lg font-medium leading-relaxed">
              ?덈줈???숉삎 臾몄젣?ㅻ줈 援ъ꽦??25?④퀎 ??踰덉㎏ ?ㅽ뀒?댁?!<br />
              ?대쾲?먮룄 ?뺤떎?섍쾶 媛쒕뀗??留덉뒪?고빐 遊낆떆??<br />
              <strong className="text-violet-600 dark:text-violet-400">?섑듃???됰꼮?섍쾶 5媛?</strong> 媛踰쇱슫 留덉쓬?쇰줈 異쒕컻~
            </p>
            <button
              onClick={startGame}
              className="px-10 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-violet-200 dark:hover:shadow-none hover:-translate-y-1"
            >
              ??踰덉㎏ 寃뚯엫 ?쒖옉 ??
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
                  {lives <= 0 || currentProblemIndex === PROBLEMS.length - 1 ? "寃곌낵 蹂닿린" : "?ㅼ쓬 臾몄젣濡?} <ChevronRight />
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
              ?꾩쟾 ?꾨즺!
            </h1>
            <p className="text-violet-600 dark:text-violet-400 font-bold mb-6">
              珥?{PROBLEMS.length}?ㅽ뀒?댁? 以?{currentProblemIndex + (lives > 0 ? 1 : 0)}?ㅽ뀒?댁? ?꾨떖
            </p>
            
            <div className="flex justify-center items-center gap-4 mb-10">
              <div className="text-center">
                <div className="text-5xl font-black text-violet-500 mb-1">{score}??/div>
                <div className="text-sm font-bold text-gray-500">理쒖쥌 ?먯닔</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-full font-bold text-lg transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> ?ㅼ떆 ?꾩쟾?섍린
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-violet-900/20 border-2 border-violet-100 dark:border-violet-900 text-violet-900 dark:text-violet-100 rounded-full font-bold text-lg transition-all hover:bg-violet-50"
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

