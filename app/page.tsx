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
          {/* 가짜(Placeholder) 버튼 */}
          <button className="px-8 py-3 md:py-4 md:px-10 md:text-lg rounded-full font-bold text-white bg-pink-400 hover:bg-pink-500 transition-all shadow-[0_4px_20px_rgba(255,182,193,0.4)] hover:shadow-[0_4px_25px_rgba(255,182,193,0.6)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 dark:focus:ring-offset-pink-950">
            강의 둘러보기 ✨
          </button>
          
          {/* 여기에 새로운 기능이나 컴포넌트를 추가하세요 */}
          {/* <button className="...">다른 버튼</button> */}
        </div>
      </div>

      {/* 여기에 새로운 섹션(컴포넌트)을 추가하세요 (예: 최신 강의 목록, 수강 후기 등) */}
      <div className="mt-24 w-full max-w-7xl mx-auto">
        {/* <SectionComponent /> */}
      </div>
    </div>
  );
}
