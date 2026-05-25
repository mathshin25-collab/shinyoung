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
    question: "?ㅼ쓬 以??뚯닔??媛쒖닔??\n{ 2, 4, 5, 8, 9, 11, 13, 15 }",
    options: ["2媛?, "3媛?, "4媛?, "5媛?],
    answer: "4媛?,
    explanation: "?뚯닔??1怨??먭린 ?먯떊留뚯쓣 ?쎌닔濡?媛吏???섏삁?? ??吏묓빀?먯꽌 ?뚯닔??2, 5, 11, 13?쇰줈 珥?4媛쒖엯?덈떎!"
  },
  {
    id: 2,
    question: "?ㅼ쓬? 90???뚯씤?섎텇?댄븯??怨쇱젙?낅땲?? (媛)? (?????ㅼ뼱媛??섏쓽 ?⑹??\n90 = 2 횞 (媛)\n(媛) = 3 횞 (??\n(?? = 3 횞 5",
    options: ["45", "50", "60", "75"],
    answer: "60",
    explanation: "90 = 2 횞 45 ?대?濡?(媛)??45?낅땲?? 45 = 3 횞 15 ?대?濡?(????15?낅땲?? ?곕씪??45 + 15 = 60 ?낅땲??"
  },
  {
    id: 3,
    question: "?ㅼ쓬? 24? 30??理쒖냼怨듬같?섎? 援ы븯??怨쇱젙?낅땲?? 理쒖냼怨듬같?섎뒗 臾댁뾿?쇨퉴??\n24 = 2쨀 횞 3\n30 = 2 횞 3 횞 5",
    options: ["120", "150", "180", "240"],
    answer: "120",
    explanation: "理쒖냼怨듬같?섎뒗 怨듯넻???뚯씤??以?吏?섍? ?ш굅??媛숈? 寃껉낵 怨듯넻???꾨땶 ?뚯씤?섎? 紐⑤몢 怨깊빀?덈떎. 2쨀 횞 3 횞 5 = 120 ?낅땲??"
  },
  {
    id: 4,
    question: "?뺤닔? ?좊━?섏뿉 ????ㅻ챸 以??녹? 寃껋??",
    options: ["3.14???뺤닔?대떎.", "0? ?묒쓽 ?뺤닔?대떎.", "-5???뚯쓽 ?뺤닔?대떎.", "1/3? ?뺤닔?대떎."],
    answer: "-5???뚯쓽 ?뺤닔?대떎.",
    explanation: "-5???뚯쓽 遺?멸? 遺숈? ?먯뿰?섏씠誘濡??뚯쓽 ?뺤닔媛 留욎뒿?덈떎. 0? ?묒쓽 ?뺤닔???뚯쓽 ?뺤닔???꾨떃?덈떎!"
  },
  {
    id: 5,
    question: "????以????묒? ?섎? 怨꾩냽 ?좏깮?섏뿬 ?꾩갑?섎뒗 ?レ옄??臾댁뾿?쇨퉴??\n[?쒖옉] (-3) 怨?(-5/2) 以??묒? ???좏깮 ??洹??ㅼ쓬 寃곌낵? (0) 以??묒? ???좏깮",
    options: ["-3", "-5/2", "0", "?놁쓬"],
    answer: "-3",
    explanation: "-3怨?-5/2(-2.5) 以묒뿉?쒕뒗 -3?????묒뒿?덈떎. 洹??ㅼ쓬 -3怨?0 以묒뿉?쒕뒗 -3?????묒쑝誘濡?理쒖쥌 ?꾩갑 ?レ옄??-3?낅땲??"
  },
  {
    id: 6,
    question: "-3 - (-5) 瑜?怨꾩궛??媛믪??",
    options: ["-8", "-2", "2", "8"],
    answer: "2",
    explanation: "類꾩뀍? ?뷀븯湲곕줈 諛붽씀怨??ㅼ쓽 ?섏쓽 遺?몃? 諛붽퓠?덈떎. -3 + (+5) = 2 媛 ?⑸땲??"
  },
  {
    id: 7,
    question: "1媛쒖뿉 500?먯씤 怨쇱옄 x媛쒖? 1媛쒖뿉 800?먯씤 ?꾩씠?ㅽ겕由?y媛쒕? ????뚯쓽 珥?媛寃⑹쓣 ?앹쑝濡??섑??대㈃?",
    options: ["1300xy", "500x + 800y", "800x + 500y", "1300(x+y)"],
    answer: "500x + 800y",
    explanation: "(怨쇱옄 1媛쒖쓽 媛寃?횞 怨쇱옄??媛쒖닔) + (?꾩씠?ㅽ겕由?1媛쒖쓽 媛寃?횞 ?꾩씠?ㅽ겕由?媛쒖닔) = 500x + 800y ?낅땲??"
  },
  {
    id: 8,
    question: "x = 4, y = 2 ???? (x짼 / y) + 3y ??媛믪??",
    options: ["10", "12", "14", "16"],
    answer: "14",
    explanation: "x??4, y??2瑜???낇븯硫?(4짼 / 2) + 3횞2 = (16 / 2) + 6 = 8 + 6 = 14 ?낅땲??"
  },
  {
    id: 9,
    question: "3(x - 2) - 2(x - 4) 瑜?媛꾨떒????寃껋??",
    options: ["x - 14", "x - 2", "x + 2", "5x - 14"],
    answer: "x + 2",
    explanation: "遺꾨같踰뺤튃???댁슜??愿꾪샇瑜??硫?3x - 6 - 2x + 8 ???섍퀬, ?숇쪟??겮由?怨꾩궛?섎㈃ x + 2 媛 ?⑸땲??"
  },
  {
    id: 10,
    question: "x??媛믪씠 1, 2, 3, 4, 5???? 諛⑹젙??4x - 5 = 7 ???대뒗?",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation: "4x - 5 = 7 ?먯꽌 4x = 12 ?대?濡?x = 3 ?낅땲??"
  },
  {
    id: 11,
    question: "諛⑹젙??3x + 4 = 13 ???대? 援ы븯湲??꾪빐 媛??癒쇱? ?묐????댁빞 ???쇱??",
    options: ["?묐???4瑜??뷀븳??", "?묐??먯꽌 4瑜?類??", "?묐???3?쇰줈 ?섎늿??", "?묐???3??怨깊븳??"],
    answer: "?묐??먯꽌 4瑜?類??",
    explanation: "媛??癒쇱? 醫뚮????곸닔??+4)???놁븷湲??꾪빐 ?묐??먯꽌 4瑜?鍮쇰뒗 寃껋씠 ?깆떇???깆쭏???댁슜???щ컮瑜??쒖꽌?낅땲??"
  },
  {
    id: 12,
    question: "?ㅼ쓬 以??쇱감諛⑹젙?앹씤 寃껋쓣 紐⑤몢 怨좊Ⅴ?쒖삤.\n?? 2x - 3 = 0\n?? 3(x+1) = 3x + 3\n?? x짼 + 2 = x\n?? 4x - 1 = 2x + 5",
    options: ["?? ??, "?? ??, "?? ??, "?? ??],
    answer: "?? ??,
    explanation: "?댁? 醫뚮?怨??곕???媛숈? ??벑?앹씠怨? ?룹? x짼???덈뒗 ?댁감諛⑹젙?앹엯?덈떎. ?쇱감諛⑹젙?앹? (?쇱감??=0 ?뺥깭?ъ빞 ?섎?濡??? ?뱀엯?덈떎!"
  },
  {
    id: 13,
    question: "?ㅼ쓬 以??먯쓽 醫뚰몴? ?щ텇硫댁뿉 ????ㅻ챸?쇰줈 ?녹? 寃껋??\nA(-3, 4), B(5, 0), C(2, -2)",
    options: ["??A??x醫뚰몴??4?대떎.", "??B?????щ텇硫??꾩뿉 ?덈떎.", "??C?????щ텇硫??꾩뿉 ?덈떎.", "??A? C??媛숈? ?щ텇硫댁뿉 ?덈떎."],
    answer: "??C?????щ텇硫??꾩뿉 ?덈떎.",
    explanation: "??A(-3, 4)?????щ텇硫? ??C(2, -2)?????щ텇硫댁뿉 ?덉뒿?덈떎. ??B(5, 0)? x異??꾩뿉 ?덉쑝誘濡??대뒓 ?щ텇硫댁뿉???랁븯吏 ?딆뒿?덈떎!"
  },
  {
    id: 14,
    question: "?뺣퉬濡 愿怨?y = ax ??洹몃옒?꾧? ??(4, 3)??吏???? a??媛믪??",
    options: ["3/4", "4/3", "12", "7"],
    answer: "3/4",
    explanation: "y = ax ??x=4, y=3????낇븯硫?3 = 4a 媛 ?⑸땲?? ?곕씪??a = 3/4 ?낅땲??"
  },
  {
    id: 15,
    question: "吏곴컖?쇨컖?뺤쓣 鍮쀫????뚯쟾異뺤쑝濡??섏뿬 1?뚯쟾 ?쒗궗 ??留뚮뱾?댁????낆껜?꾪삎??",
    options: ["?먭린??, "?먮퓭", "援?, "?먮퓭 2媛쒕? 遺숈씤 紐⑥뼇"],
    answer: "?먮퓭 2媛쒕? 遺숈씤 紐⑥뼇",
    explanation: "吏곴컖?쇨컖?뺤쓽 鍮쀫???異뺤쑝濡??뚯쟾?쒗궎硫??꾩븘?섎줈 ?먮퓭????媛?遺숈뼱?덈뒗 ?뺥깭???낆껜?꾪삎(?쎌씠 紐⑥뼇)??留뚮뱾?댁쭛?덈떎!"
  },
  {
    id: 16,
    question: "媛濡?4cm, ?몃줈 5cm, ?믪씠 3cm??吏곸쑁硫댁껜??寃됰꼻?대뒗?",
    options: ["60 cm짼", "74 cm짼", "94 cm짼", "120 cm짼"],
    answer: "94 cm짼",
    explanation: "吏곸쑁硫댁껜??寃됰꼻?대뒗 2 횞 (媛濡쑦쀬꽭濡?+ ?몃줈횞?믪씠 + ?믪씠횞媛濡? ?낅땲?? 2 횞 (20 + 15 + 12) = 2 횞 47 = 94 cm짼 ?낅땲??"
  },
  {
    id: 17,
    question: "諛묐㈃??諛섏?由꾩쓽 湲몄씠媛 3cm?닿퀬 ?믪씠媛 8cm???먮퓭??遺?쇰뒗?",
    options: ["24? cm쨀", "36? cm쨀", "48? cm쨀", "72? cm쨀"],
    answer: "24? cm쨀",
    explanation: "?먮퓭??遺?쇰뒗 1/3 횞 (諛묐꼻?? 횞 (?믪씠) ?낅땲?? 1/3 횞 (3짼?) 횞 8 = 1/3 횞 9? 횞 8 = 24? cm쨀 ?낅땲??"
  },
  {
    id: 18,
    question: "?붽컖?뺤쓽 ?媛곸꽑??珥?媛쒖닔??",
    options: ["14媛?, "20媛?, "27媛?, "35媛?],
    answer: "20媛?,
    explanation: "n媛곹삎???媛곸꽑??媛쒖닔 援ы븯??怨듭떇? n(n-3)/2 ?낅땲?? 8 횞 (8-3) / 2 = 8 횞 5 / 2 = 20媛??낅땲??"
  },
  {
    id: 19,
    question: "?↔컖?뺤쓽 ?닿컖???ш린???⑹??",
    options: ["540째", "720째", "900째", "1080째"],
    answer: "720째",
    explanation: "n媛곹삎???닿컖???⑹? 180째 횞 (n-2) ?낅땲?? ?↔컖?뺤씠誘濡?180째 횞 (6-2) = 180째 횞 4 = 720째 ?낅땲??"
  },
  {
    id: 20,
    question: "諛섏?由꾩쓽 湲몄씠媛 9cm?닿퀬 以묒떖媛곸쓽 ?ш린媛 120째??遺梨꾧섦???볦씠??",
    options: ["18? cm짼", "27? cm짼", "36? cm짼", "54? cm짼"],
    answer: "27? cm짼",
    explanation: "遺梨꾧섦???볦씠???r짼 횞 (以묒떖媛?360째) ?낅땲?? 81? 횞 (120/360) = 81? 횞 1/3 = 27? cm짼 ?낅땲??"
  },
  {
    id: 21,
    question: "怨듦컙?먯꽌 ??吏곸꽑???쒕줈 留뚮굹吏???딄퀬 ?됲뻾?섏????딆쓣 ?? ????吏곸꽑???꾩튂 愿怨꾨? 臾댁뾿?대씪怨??좉퉴??",
    options: ["?됲뻾", "?섏쭅", "?쇱튂", "瑗ъ씤 ?꾩튂"],
    answer: "瑗ъ씤 ?꾩튂",
    explanation: "吏곸쑁硫댁껜 ?깆쓽 怨듦컙?꾪삎?먯꽌 ?쒕줈 留뚮굹吏???딄퀬 ?됲뻾?섏????딆? ??吏곸꽑(紐⑥꽌由?? '瑗ъ씤 ?꾩튂'???덈떎怨??⑸땲??"
  },
  {
    id: 22,
    question: "???됲뻾??吏곸꽑????吏곸꽑怨?留뚮궇 ???앷린???숈쐞媛곴낵 ?뉕컖??????ㅻ챸?쇰줈 ?녹? 寃껋??",
    options: ["?숈쐞媛곸쓽 ?ш린????긽 ?ㅻ쫭?덈떎.", "?뉕컖???ш린????긽 媛숈뒿?덈떎.", "?됲뻾?섏? ?딆븘???뉕컖? 媛숈뒿?덈떎.", "?숈쐞媛곸쓽 ?⑹? 180?꾩엯?덈떎."],
    answer: "?뉕컖???ш린????긽 媛숈뒿?덈떎.",
    explanation: "??吏곸꽑??'?됲뻾'?????숈쐞媛곸쓽 ?ш린? ?뉕컖???ш린??媛곴컖 ?쒕줈 ?꾨꼍?섍쾶 媛숈뒿?덈떎!"
  },
  {
    id: 23,
    question: "?ㅼ쓬 以????쇨컖?뺤씠 ?⑸룞???섍린 ?꾪븳 議곌굔???꾨땶 寃껋??",
    options: ["??蹂??湲몄씠媛 媛숈쓣 ??(SSS)", "??蹂怨??쇱씤媛곸씠 媛숈쓣 ??(SAS)", "??蹂怨????앷컖??媛숈쓣 ??(ASA)", "??媛곸쓽 ?ш린媛 媛숈쓣 ??(AAA)"],
    answer: "??媛곸쓽 ?ш린媛 媛숈쓣 ??(AAA)",
    explanation: "??媛곸쓽 ?ш린媛 媛숈? ?쇨컖??AAA)? 紐⑥뼇? 媛숈?留??ш린???쒕줈 ?ㅻ? ???덉뒿?덈떎. ?곕씪??'??쓬'???섎뒗 ?덉?留?'?⑸룞'議곌굔? ?꾨떃?덈떎!"
  },
  {
    id: 24,
    question: "吏由꾩쓽 湲몄씠媛 10cm???먯쓽 ?섎젅??湲몄씠?? (?먯＜?⑥? ?)",
    options: ["5? cm", "10? cm", "20? cm", "25? cm"],
    answer: "10? cm",
    explanation: "?먯쓽 ?섎젅(?먯＜) 援ы븯??怨듭떇? (吏由? 횞 ? ?먮뒗 2?r ?낅땲?? ?곕씪??吏由?10cm 횞 ? = 10? cm ?낅땲??"
  },
  {
    id: 25,
    question: "?숈깮 5紐낆쓽 ?섎（ ?낆꽌 ?쒓컙??媛곴컖 15遺? 30遺? 10遺? 45遺? 20遺꾩씪 ?? ???먮즺??以묒븰媛믪??",
    options: ["15遺?, "20遺?, "25遺?, "30遺?],
    answer: "20遺?,
    explanation: "?먮즺瑜??묒? 媛믩????쒖꽌?濡??섏뿴?섎㈃ 10, 15, 20, 30, 45?낅땲?? ?뺢??대뜲(3踰덉㎏) ?덈뒗 媛믪씠 以묒븰媛믪씠誘濡?20遺꾩엯?덈떎!"
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
      <div className="w-full max-w-3xl bg-white/50 dark:bg-emerald-900/10 backdrop-blur-xl rounded-3xl border-2 border-emerald-100 dark:border-emerald-900 shadow-2xl overflow-hidden p-6 sm:p-10">
        
        {gameState === "start" && (
          <div className="text-center py-12">
            <div className="mb-6 inline-block p-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Star className="w-16 h-16 text-emerald-500 fill-emerald-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-emerald-100 mb-4">
              湲곗큹 ?꾪깂 留덈씪?? ?뙮
            </h1>
            <p className="text-emerald-900/70 dark:text-emerald-100/70 mb-8 text-lg font-medium leading-relaxed">
              以? ?섑븰 湲곗큹瑜??ㅼ???25?④퀎 ?ㅽ뀒?댁?!<br />
              ?щ젮二쇱떊 ?μ긽??寃?ъ?? ?숉삎 臾몄젣?ㅻ줈 援ъ꽦?덉뼱??<br />
              <strong className="text-emerald-600 dark:text-emerald-400">?섑듃??珥?5媛?</strong> ?앷퉴吏 ?대━?댄빐 蹂쇨퉴??
            </p>
            <button
              onClick={startGame}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-emerald-200 dark:hover:shadow-none hover:-translate-y-1"
            >
              寃뚯엫 ?쒖옉?섍린 ??
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
            <h1 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 mb-2">
              ?꾩쟾 ?꾨즺!
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold mb-6">
              珥?{PROBLEMS.length}?ㅽ뀒?댁? 以?{currentProblemIndex + (lives > 0 ? 1 : 0)}?ㅽ뀒?댁? ?꾨떖
            </p>
            
            <div className="flex justify-center items-center gap-4 mb-10">
              <div className="text-center">
                <div className="text-5xl font-black text-emerald-500 mb-1">{score}??/div>
                <div className="text-sm font-bold text-gray-500">理쒖쥌 ?먯닔</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-lg transition-all shadow-lg"
              >
                <RefreshCcw className="w-5 h-5" /> ?ㅼ떆 ?꾩쟾?섍린
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 rounded-full font-bold text-lg transition-all hover:bg-emerald-50"
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

