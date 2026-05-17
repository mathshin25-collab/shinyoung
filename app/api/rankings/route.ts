import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Neon Database 연결 문자열 (Vercel 환경변수 DATABASE_URL에서 자동으로 로드)
const databaseUrl = process.env.DATABASE_URL;

// 로컬 및 DB에 연결할 수 없는 환경을 위한 인메모리 및 로컬 파일 폴백용 저장소
const filePath = path.join(process.cwd(), 'rankings.json');

const defaultRankings = [
  { name: "신영쌤", score: 1000, game: "prime", date: "2026-05-16T12:00:00.000Z" },
  { name: "수학천재", score: 850, game: "inequality", date: "2026-05-16T13:00:00.000Z" },
  { name: "김구례", score: 500, game: "mini", date: "2026-05-16T14:00:00.000Z" }
];

let memoryRankings: any[] | null = null;

// 로컬 파일 폴백용 읽기 함수
function getLocalRankings(): any[] {
  if (memoryRankings !== null) {
    return memoryRankings;
  }
  try {
    if (!fs.existsSync(filePath)) {
      const initData = defaultRankings.map((r, i) => ({ id: i + 1, ...r }));
      fs.writeFileSync(filePath, JSON.stringify(initData, null, 2), 'utf-8');
      return initData;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    memoryRankings = defaultRankings.map((r, i) => ({ id: i + 1, ...r }));
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

// Neon DB 초기화 함수 (테이블이 없을 시 테이블을 생성하고 기본 레코드를 삽입)
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

    // 2. 데이터가 완전히 비어 있는지 검사
    const countResult = await sql`SELECT COUNT(*)::integer FROM rankings`;
    const count = countResult[0].count;

    if (count === 0) {
      // 3. 기본 데이터(신영쌤, 수학천재, 김구례) 자동 삽입
      for (const r of defaultRankings) {
        await sql`
          INSERT INTO rankings (name, score, game, date)
          VALUES (${r.name}, ${r.score}, ${r.game}, ${r.date})
        `;
      }
      console.log("Neon DB: 초기 기본 랭킹 데이터 삽입 완료!");
    }
  } catch (err) {
    console.error("Neon DB 초기화 중 오류:", err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get('game');

  // DATABASE_URL이 설정되어 있으면 Neon DB 사용
  if (databaseUrl) {
    try {
      const sql = neon(databaseUrl);
      
      // 테이블 자동 검증 및 초기화
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
