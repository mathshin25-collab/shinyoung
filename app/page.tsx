import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-900 dark:text-pink-100 tracking-tight mb-6">
          <span className="block">신영쌤의</span>
          <span className="block text-pink-500 dark:text-pink-400 mt-2">수학교실 📚</span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-pink-900/60 dark:text-pink-100/60 mx-auto mb-10">
          수학이 두려운 당신을 위한 맞춤형 강의. 
          기초부터 심화까지, 신영쌤과 함께라면 수학이 즐거워집니다.
        </p>

        <div className="flex justify-center gap-4 flex-col sm:flex-row">
          {/* 게임 페이지로 이동하는 버튼 */}
          <Link href="/game" className="px-8 py-3 md:py-4 md:px-10 md:text-lg rounded-full font-bold text-white bg-pink-400 hover:bg-pink-500 transition-all shadow-[0_4px_20px_rgba(255,182,193,0.4)] hover:shadow-[0_4px_25px_rgba(255,182,193,0.6)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 dark:focus:ring-offset-pink-950 text-center">
            부등식 게임 시작하기 ✨
          </Link>
          
          <button className="px-8 py-3 md:py-4 md:px-10 md:text-lg rounded-full font-bold text-pink-500 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-all">
            교재 다운로드 📖
          </button>
        </div>
      </div>

      {/* 신영쌤의 실험실 링크 섹션 */}
      <div className="mt-24 w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-pink-900 dark:text-pink-100 mb-4">신영쌤의 실험실 게임 모음 🧪</h2>
          <p className="text-pink-900/60 dark:text-pink-100/60">다양하고 재미있는 인터랙티브 수학 게임들을 즐겨보세요!</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "에라토스테네스의 체", emoji: "🔎", desc: "소수의 원리를 시각적으로 탐구하며 찾아내는 알고리즘 게임", url: "https://mathmath-psi.vercel.app/programs/sieve.html" },
            { title: "수호자: 소인수분해", emoji: "🛡️", desc: "합성수 블록을 소수로 나누어 파괴하는 디펜스 게임", url: "https://mathmath-psi.vercel.app/programs/game.html" },
            { title: "수직선 탈출: 늑구의 모험", emoji: "🏃", desc: "좀비를 피해 수식을 풀며 수직선을 탈출하는 게임", url: "https://mathmath-psi.vercel.app/programs/zombie_escape.html" },
            { title: "수학 다이스 팀 배틀", emoji: "🎲", desc: "주사위 숫자로 수식을 만들어 친구들과 실시간 대결", url: "https://mathmath-psi.vercel.app/programs/math_dice.html" },
            { title: "수학 변환 기계", emoji: "⚙️", desc: "입력값이 어떤 규칙으로 변하는지 함수를 추론하는 게임", url: "https://mathmath-psi.vercel.app/programs/transformer.html" },
            { title: "대수막대 일차식 학습", emoji: "🧱", desc: "대수막대를 옮기며 일차식의 덧셈, 뺄셈, 분배법칙 완벽 이해", url: "https://mathmath-psi.vercel.app/programs/algebra_tiles.html" },
            { title: "신영쌤의 대수저울", emoji: "⚖️", desc: "양변에 같은 연산을 하여 일차방정식의 해를 구하는 저울 게임", url: "https://mathmath-psi.vercel.app/programs/algebra_balance.html" },
            { title: "일차방정식 릴레이 배틀", emoji: "🏃‍♂️", desc: "팀원들과 협력하여 일차방정식을 빠르게 해결하는 릴레이", url: "https://mathmath-psi.vercel.app/programs/equation_relay.html" },
            { title: "일차방정식 방탈출", emoji: "🚪", desc: "일차방정식의 비밀을 풀어 스산한 저택을 탈출하세요", url: "https://mathmath-psi.vercel.app/programs/escape_room.html" },
            { title: "좌표평면 오목두기", emoji: "⚫⚪", desc: "X, Y 좌표를 직접 선택하며 오목을 두는 좌표평면 학습", url: "https://mathmath-psi.vercel.app/programs/omok.html" },
            { title: "회전체 탐구", emoji: "🌀", desc: "직접 그린 단면을 회전시켜 3D 회전체를 만들어보는 실험", url: "https://mathmath-psi.vercel.app/programs/solids_of_revolution.html" },
            { title: "그래프 탐구 연구소", emoji: "📈", desc: "카트를 운전하며 시간-거리 그래프의 원리를 탐구", url: "https://mathmath-psi.vercel.app/programs/graph_challenge.html" },
            { title: "항아리 물채우기", emoji: "🏺", desc: "채우는 속도가 다른 항아리로 최소공배수 시각화 탐구", url: "https://mathmath-psi.vercel.app/programs/water_jar.html" },
            { title: "반려식물 성장 일기", emoji: "🪴", desc: "식물을 돌보고 기록하며 좌표평면과 함수의 관계 탐구", url: "https://mathmath-psi.vercel.app/programs/plant_diary.html" },
            { title: "수학네컷", emoji: "📸", desc: "수학적인 이모지와 스티커로 나만의 소중한 사진 꾸미기", url: "https://mathmath-psi.vercel.app/programs/math4cut.html" }
          ].map((game, i) => (
            <a 
              key={i} 
              href={game.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col bg-white dark:bg-pink-950/20 p-6 rounded-3xl border border-pink-100 dark:border-pink-900 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,182,193,0.3)] dark:hover:shadow-none group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{game.emoji}</div>
              <h3 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-2">{game.title}</h3>
              <p className="text-sm text-pink-900/60 dark:text-pink-100/60 flex-grow mb-6">{game.desc}</p>
              <div className="flex items-center text-pink-500 font-bold text-sm">
                플레이 하러 가기 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
