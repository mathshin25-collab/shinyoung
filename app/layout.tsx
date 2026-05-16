import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

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
      <body className={`${inter.className} min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}>
        {/* 상단 헤더 */}
        <header className="w-full bg-white/80 dark:bg-pink-950/30 backdrop-blur-md border-b border-pink-100 dark:border-pink-900 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image src="/logo.png" alt="신영쌤 로고" width={32} height={32} className="rounded-full object-cover" />
                <span className="font-bold text-2xl text-pink-500 dark:text-pink-400 tracking-tighter">신영쌤</span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                {/* 여기에 새로운 네비게이션 링크를 추가하세요 */}
                <a href="#" className="text-pink-900/70 dark:text-pink-100/70 hover:text-pink-500 px-3 py-2 rounded-full text-sm font-semibold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/50">수업진도</a>
                <a href="#" className="text-pink-900/70 dark:text-pink-100/70 hover:text-pink-500 px-3 py-2 rounded-full text-sm font-semibold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/50">수업자료</a>
                <a href="#" className="text-pink-900/70 dark:text-pink-100/70 hover:text-pink-500 px-3 py-2 rounded-full text-sm font-semibold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/50">공지사항</a>
              </nav>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 하단 푸터 */}
        <footer className="bg-pink-50/50 dark:bg-pink-950/20 border-t border-pink-100 dark:border-pink-900">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4">
            <Image src="/logo.png" alt="신영쌤 로고" width={48} height={48} className="rounded-full opacity-60 grayscale hover:grayscale-0 transition-all duration-300" />
            <p className="text-center text-sm text-pink-900/40 dark:text-pink-100/40">
              &copy; {new Date().getFullYear()} 신영쌤의 수학교실. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
