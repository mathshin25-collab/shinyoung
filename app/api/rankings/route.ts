import { NextResponse } from 'next/server';

// 메모리 기반 랭킹 저장소 (서버가 재시작되면 초기화됩니다. 실제 서비스에서는 DB를 연결해야 합니다.)
let globalRankings = [
  { id: 1, name: "신영쌤", score: 1000, game: "prime", date: new Date().toISOString() },
  { id: 2, name: "수학천재", score: 850, game: "inequality", date: new Date().toISOString() },
  { id: 3, name: "김구례", score: 500, game: "mini", date: new Date().toISOString() }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');
  
  let filtered = globalRankings;
  if (game && game !== "all") {
    filtered = globalRankings.filter(r => r.game === game);
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
      name: body.name.slice(0, 10), // 이름 길이 제한
      score: Number(body.score),
      game: body.game,
      date: new Date().toISOString()
    };

    globalRankings.push(newRecord);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
