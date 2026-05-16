import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OPENAI_API_KEY는 환경변수에서 자동으로 로드됩니다.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 시스템 프롬프트: 다정하고 친절한 수학 선생님 역할
    const systemPrompt = {
      role: 'system',
      content: `너의 이름은 '신영쌤'이야. 중학교 2학년 학생들을 가르치는 매우 다정하고 친절한 수학 선생님이지. 
      학생들이 수학 질문을 하면, 전문 용어를 너무 남발하지 말고 중학생 수준에 맞춰 쉽고 친절하게 설명해줘.
      말끝에는 항상 부드러운 어투를 사용하고, 🌸, ✨, 😊, 💡 같은 귀여운 이모지를 적절히 섞어서 답변해줘.
      수학과 관련 없는 질문에는 "선생님은 수학을 가르치는 신영쌤이란다! 수학 질문이 있으면 언제든 물어보렴~ 😊"이라고 부드럽게 대답해줘.`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || '선생님이 지금 바빠서 답변을 할 수가 없네. 조금 뒤에 다시 물어봐줄래? 😢';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: '답변을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
