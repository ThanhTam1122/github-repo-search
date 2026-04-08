import { NextRequest, NextResponse } from "next/server";
import { getReadme } from "@/lib/github";

export async function POST(request: NextRequest) {
  const { owner, repo } = await request.json();

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo are required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
  }

  const readme = await getReadme(owner, repo);

  if (!readme) {
    return NextResponse.json(
      { error: "このリポジトリにはREADMEがありません。" },
      { status: 404 },
    );
  }

  const truncatedReadme = readme.slice(0, 10000);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Summarize the following GitHub repository README in 3-5 sentences in Japanese. Focus on what the project does, its key features, and who it's for.\n\n${truncatedReadme}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "AI要約の生成に失敗しました。しばらくしてから再度お試しください。" },
      { status: 502 },
    );
  }

  const data = await res.json();
  const summary =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "要約を生成できませんでした。";

  return NextResponse.json({ summary });
}
