import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "신영쌤의 수학교실",
  description: "가장 쉽고 재미있는 수학 강의",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* 상단 헤더 */}
        <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">신영쌤</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                {/* 여기에 새로운 네비게이션 링크를 추가하세요 */}
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">강의소개</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">수강신청</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">공지사항</a>
              </nav>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 하단 푸터 */}
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} 신영쌤의 수학교실. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
