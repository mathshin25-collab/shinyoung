"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, Trash2, ExternalLink, Copy, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess?: (url: string) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 형식 검사
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 선택해 주세요! 🖼️");
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하만 업로드할 수 있습니다! ⚠️");
      return;
    }

    setSelectedFile(file);
    setUploadedUrl(null);
    
    // 로컬 프리뷰 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 끌어다 놓아 주세요! 🖼️");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하만 업로드할 수 있습니다! ⚠️");
      return;
    }

    setSelectedFile(file);
    setUploadedUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // Vercel Blob 업로드 API 호출
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(selectedFile.name)}`, {
        method: "POST",
        body: selectedFile,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "업로드에 실패했습니다.");
      }

      const data = await response.json();
      setUploadedUrl(data.url);
      
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "업로드 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async () => {
    if (!uploadedUrl) return;
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/70 dark:bg-pink-900/10 backdrop-blur-xl rounded-3xl border-2 border-pink-100 dark:border-pink-900 shadow-2xl p-6 transition-all hover:shadow-pink-100/50 dark:hover:shadow-none">
      <h3 className="text-xl font-bold text-pink-900 dark:text-pink-100 mb-2 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-pink-500" />
        Vercel Blob 이미지 업로더 ✨
      </h3>
      <p className="text-xs text-pink-900/50 dark:text-pink-100/50 mb-6">
        이미지를 안전하고 빠른 Vercel Blob 저장소에 실시간으로 등록합니다.
      </p>

      {/* 숨겨진 Input 파일 선택 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 드래그 앤 드롭 영역 */}
      {!previewUrl && !uploadedUrl && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="border-2 border-dashed border-pink-200 dark:border-pink-900 hover:border-pink-400 dark:hover:border-pink-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-pink-50/30 dark:bg-pink-950/10 hover:bg-pink-50/60 dark:hover:bg-pink-950/20 group"
        >
          <div className="p-4 bg-pink-100/50 dark:bg-pink-900/30 rounded-full text-pink-500 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-pink-900 dark:text-pink-100 text-sm">
              이미지 파일을 여기에 떨어뜨리거나 클릭하세요
            </p>
            <p className="text-xs text-pink-900/40 dark:text-pink-100/40 mt-1">
              PNG, JPG, GIF, WebP (최대 5MB)
            </p>
          </div>
        </div>
      )}

      {/* 로컬 미리보기 및 업로드 대기 영역 */}
      {previewUrl && !uploadedUrl && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-pink-100 dark:border-pink-900 max-h-60 flex items-center justify-center bg-pink-50/20 dark:bg-pink-950/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="선택된 이미지 미리보기"
              className="object-contain max-h-60 w-full rounded-2xl"
            />
            {!uploading && (
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all shadow-md"
                title="선택 취소"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={uploading}
              className="flex-1 py-3 px-4 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-xl font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40 disabled:opacity-50"
            >
              다시 선택
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-2 flex-[2] py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-md shadow-pink-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  업로드 중...
                </>
              ) : (
                "Vercel Blob에 업로드 🚀"
              )}
            </button>
          </div>
        </div>
      )}

      {/* 업로드 완료 상태 */}
      {uploadedUrl && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">업로드 완료!</p>
              <p className="text-xs opacity-80 mt-0.5">Vercel Blob 스토리지에 성공적으로 등록되었습니다.</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-pink-100 dark:border-pink-900 max-h-60 flex items-center justify-center bg-pink-50/20 dark:bg-pink-950/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="업로드된 이미지 미리보기"
              className="object-contain max-h-60 w-full rounded-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900 p-2 rounded-xl text-xs text-pink-900/80 dark:text-pink-100/80">
              <span className="font-mono truncate flex-1 select-all">{uploadedUrl}</span>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-white dark:bg-pink-900 hover:bg-pink-50 dark:hover:bg-pink-850 rounded-lg border border-pink-100 dark:border-pink-900 font-bold transition-all flex items-center justify-center"
                title="주소 복사"
              >
                {copied ? (
                  <span className="text-green-500 font-bold text-[10px]">복사됨!</span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-white dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-900 text-pink-900 dark:text-pink-100 rounded-xl font-bold transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40 flex items-center justify-center gap-1 text-sm"
              >
                새 창에서 보기 <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-pink-400 hover:bg-pink-500 text-white rounded-xl font-bold transition-all shadow-md text-sm"
              >
                새 이미지 업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 에러 피드백 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}
