import React from "react";
import ImageUploader from "@/components/ImageUploader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-900 dark:text-pink-100 mb-2 flex items-center justify-center gap-3">
          Vercel Blob 이미지 업로드 🚀
        </h1>
        <p className="text-pink-900/60 dark:text-pink-100/60 text-sm sm:text-base max-w-md mx-auto">
          선택한 이미지가 Vercel Blob 스토리지로 업로드되며, 업로드 후 주소를 실시간으로 확인할 수 있습니다.
        </p>
      </div>

      <ImageUploader />

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-full font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
        >
          <ArrowLeft className="w-4 h-4" /> 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
