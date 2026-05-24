// 服务端代理: 浏览器调用这个端点 → 这个端点带着你的 API key 去调 Gemini
// 这样 API key 永远不会暴露给玩家

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request) {
  try {
    const { system, user } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "服务器没有配置 GEMINI_API_KEY 环境变量" },
        { status: 500 }
      );
    }

    if (!system || !user) {
      return Response.json(
        { error: "请求缺少 system 或 user 字段" },
        { status: 400 }
      );
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.95,
          maxOutputTokens: 2000,
        },
        // 这是讽刺游戏,需要放宽安全过滤器,否则 AI 会拒绝扮演令人不适的角色
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return Response.json(
        { error: `Gemini API 错误: ${errText.slice(0, 300)}` },
        { status: geminiRes.status }
      );
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      const finishReason = data.candidates?.[0]?.finishReason || "unknown";
      return Response.json(
        { error: `AI 没有返回内容 (原因: ${finishReason}). 可能被安全过滤器拦截了。` },
        { status: 500 }
      );
    }

    try {
      const parsed = JSON.parse(text);
      return Response.json(parsed);
    } catch (parseErr) {
      return Response.json(
        { error: "AI 返回的不是合法 JSON", raw: text.slice(0, 500) },
        { status: 500 }
      );
    }
  } catch (e) {
    return Response.json({ error: e.message || "未知错误" }, { status: 500 });
  }
}
