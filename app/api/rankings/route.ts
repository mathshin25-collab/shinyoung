import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Neon Database 연결 문자열 (Vercel 환경변수 DATABASE_URL에서 자동으로 로드)
const databaseUrl = process.env.DATABASE_URL;

// 로컬 및 DB에 연결할 수 없는 환경을 위한 인메모리 및 로컬 파일 폴백용 저장소
const filePath = path.join(process.cwd(), 'rankings.json');

// 초기 데이터 완전히 제거 (빈 슬레이트 시작)
const defaultRankings: any[] = [];

let memoryRankings: any[] | null = null;

// 로컬 파일 폴백용 읽기 함수
function getLocalRankings(): any[] {
  if (memoryRankings !== null) {
    return memoryRankings;
  }
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const list = JSON.parse(data);
    
    // 기존 로컬 파일에 존재하던 초기 데이터("신영쌤", "수학천재", "김구례")도 동적 제거 처리
    const cleaned = list.filter((r: any) => !["신영쌤", "수학천재", "김구례"].includes(r.name));
    if (cleaned.length !== list.length) {
      fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf-8');
    }
    return cleaned;
  } catch (error) {
    memoryRankings = [];
    return memoryRankings;
  }
}

// 로컬 파일 폴백용 저장 함수
function saveLocalRanking(newRecord: any) {
  try {
    const list = getLocalRankings();
    list.push(newRecord);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    if (memoryRankings !== null) {
      memoryRankings = list;
    }
  } catch (error) {
    if (memoryRankings !== null) {
      memoryRankings.push(newRecord);
    } else {
      memoryRankings = [...getLocalRankings(), newRecord];
    }
  }
}

// Neon DB 초기화 함수 (테이블 생성 및 기존 초기 데이터 정리)
async function initNeonDb(sql: any) {
  try {
    // 1. 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS rankings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        game VARCHAR(50) NOT NULL,
        date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Neon DB에 기록된 기존 초기 데이터("신영쌤", "수학천재", "김구례") 강제 삭제 클리닝
    await sql`
      DELETE FROM rankings 
      WHERE name IN ('신영쌤', '수학천재', '김구례')
    `;
  } catch (err) {
    console.error("Neon DB 초기화/정리 중 오류:", err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');

  // DATABASE_URL이 설정되어 있으면 Neon DB 사용
  if (databaseUrl) {
    try {
      const sql = neon(databaseUrl);
      
      // 테이블 자동 검증 및 기존 초기 데이터 제거
      await initNeonDb(sql);

      let result;
      if (game && game !== "all") {
        result = await sql`
          SELECT id, name, score, game, date::text as date 
          FROM rankings 
          WHERE game = ${game} 
          ORDER BY score DESC 
          LIMIT 50
        `;
      } else {
        result = await sql`
          SELECT id, name, score, game, date::text as date 
          FROM rankings 
          ORDER BY score DESC 
          LIMIT 50
        `;
      }

      // 날짜 객체 포맷 변환 및 가공
      const formatted = result.map((row: any) => ({
        id: row.id,
        name: row.name,
        score: row.score,
        game: row.game,
        date: new Date(row.date).toISOString()
      }));

      return NextResponse.json(formatted);
    } catch (dbError) {
      console.error("Neon DB GET 에러, 로컬 파일로 폴백합니다:", dbError);
    }
  }

  // 폴백 모드 (로컬 개발 또는 DB 미연결 시)
  const localList = getLocalRankings();
  let filtered = localList;
  if (game && game !== "all") {
    filtered = localList.filter(r => r.game === game);
  }
  const sorted = [...filtered].sort((a, b) => b.score - a.score);
  return NextResponse.json(sorted.slice(0, 50));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || body.score === undefined || !body.game) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const name = body.name.trim().slice(0, 10);
    const score = Number(body.score);
    const game = body.game;
    const date = new Date().toISOString();

    const newRecord = {
      id: Date.now(),
      name,
      score,
      game,
      date
    };

    // DATABASE_URL이 설정되어 있으면 Neon DB에 등록
    if (databaseUrl) {
      try {
        const sql = neon(databaseUrl);
        await initNeonDb(sql);

        const insertResult = await sql`
          INSERT INTO rankings (name, score, game, date)
          VALUES (${name}, ${score}, ${game}, ${date})
          RETURNING id, name, score, game, date::text as date
        `;

        const createdRow = insertResult[0];
        return NextResponse.json({
          success: true,
          record: {
            id: createdRow.id,
            name: createdRow.name,
            score: createdRow.score,
            game: createdRow.game,
            date: new Date(createdRow.date).toISOString()
          }
        });
      } catch (dbError) {
        console.error("Neon DB POST 에러, 로컬 파일로 폴백 저장합니다:", dbError);
      }
    }

    // 폴백 모드 (로컬 저장)
    saveLocalRanking(newRecord);
    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
