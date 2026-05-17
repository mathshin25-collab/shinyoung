import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const file = request.body;
    if (!file) {
      return NextResponse.json({ error: 'No file data received' }, { status: 400 });
    }

    // Vercel Blob에 파일 데이터를 스트림으로 직접 업로드
    const blob = await put(filename, file, {
      access: 'public', // 누구에게나 열린 공용 URL로 접근 허용
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
