import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 파일 기반 랭킹 저장소 경로
const filePath = path.join(process.cwd(), 'rankings.json');

// 기본 랭킹 데이터 (고정된 날짜 정보 사용으로 서버 재시작 시 날짜가 변경되는 오류 방지)
const defaultRankings = [
  { id: 1, name: "신영쌤", score: 1000, game: "prime", date: "2026-05-16T12:00:00.000Z" },
  { id: 2, name: "수학천재", score: 850, game: "inequality", date: "2026-05-16T13:00:00.000Z" },
  { id: 3, name: "김구례", score: 500, game: "mini", date: "2026-05-16T14:00:00.000Z" }
];

// 메모리 폴백 (파일 쓰기가 실패할 수 있는 Vercel 서버리스 환경 등에서 사용)
let memoryRankings: any[] | null = null;

function getRankings(): any[] {
  // 1. 메모리 데이터가 이미 있으면 우선 사용 (Vercel 폴백 상태 등)
  if (memoryRankings !== null) {
    return memoryRankings;
  }

  try {
    if (!fs.existsSync(filePath)) {
      // 파일이 없을 경우 기본 데이터로 초기화
      fs.writeFileSync(filePath, JSON.stringify(defaultRankings, null, 2), 'utf-8');
      return defaultRankings;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn("파일에서 랭킹을 읽지 못해 메모리 모드로 동작합니다:", error);
    // 파일 읽기 실패 시 기본 데이터로 메모리 저장소 초기화
    memoryRankings = [...defaultRankings];
    return memoryRankings;
  }
}

function saveRankings(rankings: any[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(rankings, null, 2), 'utf-8');
    // 파일 쓰기 성공 시 메모리 데이터도 갱신
    if (memoryRankings !== null) {
      memoryRankings = rankings;
    }
  } catch (error) {
    console.warn("파일에 랭킹을 저장하지 못해 임시 메모리에만 저장합니다:", error);
    // 파일 쓰기 실패 시 메모리 데이터로 폴백
    memoryRankings = rankings;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');
  
  const rankings = getRankings();
  
  let filtered = rankings;
  if (game && game !== "all") {
    filtered = rankings.filter(r => r.game === game);
  }
  
  // 점수 내림차순 정렬
  const sorted = [...filtered].sort((a, b) => b.score - a.score);
  
  return NextResponse.json(sorted.slice(0, 50)); // 최대 50등까지 반환
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || body.score === undefined || !body.game) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newRecord = {
      id: Date.now(),
      name: body.name.trim().slice(0, 10), // 이름 트림 및 길이 제한
      score: Number(body.score),
      game: body.game,
      date: new Date().toISOString()
    };

    const rankings = getRankings();
    rankings.push(newRecord);
    saveRankings(rankings);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
