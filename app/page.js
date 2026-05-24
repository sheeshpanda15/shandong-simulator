"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, RotateCcw, ChevronRight, Skull, Settings, Coffee, X, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import {
  DISCLAIMER_SHORT, DISCLAIMER_FULL,
  ACKNOWLEDGE_BUTTON, DECLINE_BUTTON,
  FIRST_VISIT_TITLE, DECLINE_REDIRECT_URL, DISCLAIMER_VERSION
} from "./disclaimer-content";

// ============ 角色配置 ============
const CHARACTERS = {
  zhuren: {
    name: "李主任", short: "主任", title: "正厅级老干部 · 退居二线", color: "#c9a558", seat: 0,
    persona: "62岁正厅级老干部。说话慢条斯理,常停顿,爱用'这个嘛...'、'我跟你讲'、'当年我在...'开头。爱暗示人脉('上次跟省里X厅长吃饭')。是桌上最大的领导,必须被先敬。"
  },
  wudong: {
    name: "吴总", short: "吴总", title: "实业集团董事长 · 真金主", color: "#a83232", seat: 1,
    persona: "58岁本地最大民营企业主,真正掏钱的人。话少但每句有分量。爱说'实事求是讲'、'我们企业'。表面谦逊实则看不起官员,知道自己才是被求的。"
  },
  fuzong: {
    name: "张副总", short: "副总", title: "你的顶头上司", color: "#8b5e3c", seat: 2,
    persona: "45岁,你公司副总,你直属上司。对上极度谄媚对下严苛。爱'你小子'、'我们小李这孩子'介绍下属。会踢你脚下示意你敬酒。"
  },
  kezhang: {
    name: "赵科长", short: "科长", title: "市局科长 · 装文化人", color: "#5a7a3e", seat: 3,
    persona: "40岁体制内中层。装文化人,张口'正如东坡所云'引用诗词但常引错。爱点评菜品'这道菜有讲究'。表面斯文实际更俗。"
  },
  xiaoLiu: {
    name: "小刘", short: "竞争者", title: "你的同事 · 暗中竞争对手", color: "#3a6e8e", seat: 4,
    persona: "30岁,你的同事,争夺晋升的竞争对手。表面笑脸专挑你错话补刀。'刚才小李说的那个...其实应该是...'假装圆场实则拆台。抢敬重要的人。"
  },
  xiaoQian: {
    name: "小钱", short: "小钱", title: "新员工 · 终极马屁精", color: "#b56b2f", seat: 5,
    persona: "25岁新员工,比你更卑微的极端马屁精。会做夸张吹捧让你显得不够卖力。'主任今天气色真好!'、'王董一看就做大事的!'。手永远托着茶壶给所有人倒水。"
  },
  baogong: {
    name: "郑哥", short: "包工头", title: "包工头 · 暴发户", color: "#704040", seat: 6,
    persona: "50岁包工头,刚发大财。粗俗金链子。爱炫'我儿子在美国'、'我刚提了辆S级'。粗话不断('你妹的')但对领导秒变笑脸。"
  },
  laohu: {
    name: "老胡", short: "老胡", title: "李主任发小 · 退休", color: "#7a5d8a", seat: 7,
    persona: "65岁李主任发小,退休教师。早就喝多了,爱讲段子,常讲到黄段子让秘书小林明显不适。说话颠三倒四。"
  },
  sijiQiang: {
    name: "阿强", short: "司机", title: "李主任司机 · 不准喝酒", color: "#4a5d6e", seat: 8,
    persona: "35岁李主任司机,今晚开车不能喝酒。'以茶代酒'但要陪笑附和、记每个人喜好。心里怨气但脸上必须笑。"
  },
  guanxihu: {
    name: "宝宝", short: "关系户", title: "某领导小舅子 · 闲职", color: "#9e8348", seat: 9,
    persona: "32岁某市领导小舅子,国企挂闲职。不耐烦地玩手机。不主动敬酒但所有人要敬他(因为他姐夫)。偶尔抬头说一句'我姐夫昨天还说...'全桌就紧张。"
  },
  mishu: {
    name: "小林", short: "秘书", title: "新秘书 · 被要求陪酒", color: "#a8748a", seat: 10,
    persona: "27岁女新秘书,被领导带来陪酒。**明显非常不舒服**——被老胡黄段子困扰、被劝酒、躲眼神、找借口去洗手间。她不是猎物,是这个体制的另一个受害者。回应要突出她的勉强、困境、压抑的厌恶。"
  }
};

const CHAR_ORDER = ["zhuren","wudong","fuzong","kezhang","xiaoLiu","xiaoQian","baogong","laohu","sijiQiang","guanxihu","mishu"];

const DISHES = [
  { name: "凉拌黄瓜", note: "形似某物 · 必有人开黄腔" },
  { name: "海参捞饭", note: "贵气 · 主任和吴总互相夹给对方" },
  { name: "大葱蘸酱", note: "山东标配 · 真材实料" },
  { name: "整条糖醋鲤鱼", note: "鱼头朝主位 · '鱼头敬人三杯'" },
  { name: "九转大肠", note: "'九转'谐音可玩" },
  { name: "白灼大虾", note: "'给您面子' · 一人一只" },
  { name: "葱烧海参", note: "双重贵气 · 海参象征'参'" },
  { name: "德州扒鸡", note: "'扒'字可玩 · 鸡爪叫'抓钱手'" },
  { name: "鲍鱼捞饭", note: "极尽奢华 · '包您发'" },
  { name: "煎饼卷大葱", note: "假装接地气 · 实则炫耀'我们山东人'" },
  { name: "招财进宝水饺", note: "饺子里有硬币 · 谁吃到谁今年发财" },
  { name: "三十年茅台压轴", note: "最后的劝酒高潮 · 不喝就是不给面子" }
];

const LS_KEY_API = "sds_user_gemini_key";
const LS_KEY_GAMES = "sds_games_played";
const LS_KEY_DISCLAIMER = "sds_disclaimer_accepted";

// ============ Markdown 渲染助手 ============
// 支持 **加粗** 和 - 列表项,段落用空行分隔
function renderRichText(text) {
  const paragraphs = text.trim().split(/\n\s*\n/);
  return paragraphs.map((para, pi) => {
    const lines = para.split("\n");
    const isList = lines.every(l => l.trim().startsWith("- ") || l.trim() === "");

    if (isList) {
      return (
        <ul key={pi} className="mb-3 space-y-1" style={{ paddingLeft: "1em" }}>
          {lines.filter(l => l.trim()).map((line, li) => (
            <li key={li} style={{ listStyle: "none", position: "relative" }}>
              <span style={{ position: "absolute", left: "-1em", color: "#9c8068" }}>·</span>
              {renderBold(line.trim().slice(2))}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={pi} className="mb-3 leading-relaxed">
        {lines.map((line, li) => (
          <React.Fragment key={li}>
            {renderBold(line)}
            {li < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} style={{ color: "#c9a558" }}>{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export default function ShandongSimulator() {
  const [phase, setPhase] = useState("intro");
  const [dishIdx, setDishIdx] = useState(0);
  const [turnInDish, setTurnInDish] = useState(0);
  const [history, setHistory] = useState([]);
  const [scores, setScores] = useState({ flattery: 0, lewdness: 0, dignity: 100 });
  const [scoreLog, setScoreLog] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [activeChar, setActiveChar] = useState(null);

  const [userKey, setUserKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [keyInput, setKeyInput] = useState("");

  // 免责声明状态
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true); // 默认 true 避免 SSR 闪烁
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const k = localStorage.getItem(LS_KEY_API) || "";
      const g = parseInt(localStorage.getItem(LS_KEY_GAMES) || "0", 10);
      const accepted = localStorage.getItem(LS_KEY_DISCLAIMER) === DISCLAIMER_VERSION;
      setUserKey(k);
      setKeyInput(k);
      setGamesPlayed(g);
      setDisclaimerAccepted(accepted);
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, loading]);

  const acceptDisclaimer = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY_DISCLAIMER, DISCLAIMER_VERSION);
    }
    setDisclaimerAccepted(true);
  };

  const declineDisclaimer = () => {
    if (DECLINE_REDIRECT_URL && typeof window !== "undefined") {
      window.location.href = DECLINE_REDIRECT_URL;
    } else if (typeof window !== "undefined") {
      window.close();
    }
  };

  const saveKey = () => {
    const k = keyInput.trim();
    if (typeof window !== "undefined") {
      if (k) localStorage.setItem(LS_KEY_API, k);
      else localStorage.removeItem(LS_KEY_API);
    }
    setUserKey(k);
    setShowSettings(false);
  };

  const callBackend = async (systemPrompt, userMessage) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: systemPrompt,
        user: userMessage,
        userKey: userKey || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "未知错误");
    return data;
  };

  const callGM = async (userAction, isNewDish = false) => {
    setLoading(true);
    setError(null);

    const charList = CHAR_ORDER.map(id => `- ${id}(${CHARACTERS[id].name}): ${CHARACTERS[id].persona}`).join("\n");
    const recentHistory = history.slice(-12).map(h => {
      if (h.type === "narration") return `[场景] ${h.text}`;
      if (h.type === "user") return `你(小李): ${h.text}`;
      return `${CHARACTERS[h.char_id]?.name}: ${h.text}`;
    }).join("\n");

    const sysPrompt = `你是一个讽刺剧的游戏总监(Game Master),运行《山东酒桌模拟器》黑色幽默讽刺游戏。

【讽刺基调】对中国部分地区酒桌文化异化的讽刺,不针对地域人群,而是批判权力结构下的人性扭曲。玩家分数越高(谄媚+猥琐),越揭示玩家被同化。秘书小林等弱势角色应被同情刻画。

【11个角色】
${charList}

【当前情况】
- 菜品(第${dishIdx+1}/12道): ${DISHES[dishIdx].name} · ${DISHES[dishIdx].note}
- 分数: 谄媚${scores.flattery} 猥琐${scores.lewdness} 人格${scores.dignity}
- 最近对话:
${recentHistory || "(刚开始)"}

【刚刚发生】
${isNewDish ? `服务员端上"${DISHES[dishIdx].name}"。生成场景+2-3角色反应。` : `玩家(小李)说: "${userAction}"`}

【输出 JSON 格式,所有内容简洁】
{
  "narration": "简短场景描述(<=50字),无则 null",
  "responses": [{"char_id": "ID", "text": "<=60字台词"}],
  "score_delta": {"flattery": 0-15, "lewdness": 0-15, "dignity": -10到5},
  "score_reason": "简短理由"
}

【关键】
1. 1-3条响应,最相关的角色
2. 台词鲜活有方言感
3. 竞争者小刘常拆你台
4. 秘书小林被骚扰要让玩家不适——讽刺核心
5. 玩家反抗→人格上升;卑躬屈膝→谄媚上升;开黄腔→猥琐上升`;

    const userMsg = isNewDish ? "请生成上菜场景和角色反应" : userAction;

    try {
      const parsed = await callBackend(sysPrompt, userMsg);
      const newHistory = [...history];
      if (!isNewDish && userAction) newHistory.push({ type: "user", text: userAction });
      if (parsed.narration) newHistory.push({ type: "narration", text: parsed.narration });
      for (const r of parsed.responses || []) {
        newHistory.push({ type: "char", char_id: r.char_id, text: r.text });
      }
      setHistory(newHistory);

      if (parsed.score_delta) {
        setScores(prev => ({
          flattery: Math.max(0, Math.min(100, prev.flattery + (parsed.score_delta.flattery || 0))),
          lewdness: Math.max(0, Math.min(100, prev.lewdness + (parsed.score_delta.lewdness || 0))),
          dignity: Math.max(0, Math.min(100, prev.dignity + (parsed.score_delta.dignity || 0)))
        }));
        if (parsed.score_reason) {
          setScoreLog(prev => [...prev.slice(-4), parsed.score_reason]);
        }
      }
      if (!isNewDish) setTurnInDish(t => t + 1);
    } catch (e) {
      setError(e.message || "AI 总监打嗝了");
    } finally {
      setLoading(false);
    }
  };

  const nextDish = async () => {
    if (dishIdx >= 11) { await generateFinalReport(); return; }
    setDishIdx(d => d + 1);
    setTurnInDish(0);
    setHistory(h => [...h, { type: "narration", text: `———— 第 ${dishIdx + 2} 道菜 ————` }]);
    setTimeout(() => callGM(null, true), 100);
  };

  const startGame = async () => {
    setPhase("playing");
    setHistory([{ type: "narration", text: "你穿着不合身的衬衫被张副总拽进了包间。十一双眼睛同时看向你。'来来来,小李,就等你了!'" }]);
    setTimeout(() => callGM(null, true), 100);
  };

  const generateFinalReport = async () => {
    setLoading(true);
    try {
      const sysPrompt = "你是讽刺剧总结员,用黑色幽默风格输出 JSON。";
      const userMsg = `游戏终局总结。
最终分数: 谄媚${scores.flattery} 猥琐${scores.lewdness} 人格${scores.dignity}

输出 JSON: {"title": "称号", "verdict": "100-150字黑色幽默总结", "consequence": "一句话后续"}`;

      const parsed = await callBackend(sysPrompt, userMsg);
      setFinalReport(parsed);
      setPhase("ending");

      if (typeof window !== "undefined") {
        const next = gamesPlayed + 1;
        localStorage.setItem(LS_KEY_GAMES, String(next));
        setGamesPlayed(next);
      }
    } catch (e) {
      setFinalReport({
        title: "酒局散场",
        verdict: `谄媚${scores.flattery}/猥琐${scores.lewdness}/人格${scores.dignity}。这个夜晚已经结束。`,
        consequence: "你打车回家。"
      });
      setPhase("ending");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const t = input.trim();
    if (!t || loading) return;
    setInput("");
    callGM(t);
  };

  const handleToast = (charId) => {
    setInput(`(端起酒杯) ${CHARACTERS[charId].name},我敬您一杯!`);
  };

  const reset = () => {
    setPhase("intro"); setDishIdx(0); setTurnInDish(0); setHistory([]);
    setScores({ flattery: 0, lewdness: 0, dignity: 100 }); setScoreLog([]);
    setInput(""); setError(null); setFinalReport(null);
  };

  const SeatingTable = () => {
    const cx = 150, cy = 150, r = 105, total = 12;
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <radialGradient id="tableGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5c3a2a" />
            <stop offset="100%" stopColor="#2a1810" />
          </radialGradient>
          <filter id="seatGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={70} fill="url(#tableGrad)" stroke="#7a5028" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={50} fill="none" stroke="#c9a558" strokeWidth="0.5" opacity="0.3" />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="#c9a558" style={{fontFamily: "'Ma Shan Zheng', cursive"}}>
          第{dishIdx + 1}道
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#e8d5a8">
          {DISHES[dishIdx]?.name.length > 6 ? DISHES[dishIdx]?.name.slice(0,5)+'…' : DISHES[dishIdx]?.name}
        </text>
        {CHAR_ORDER.map((cid) => {
          const c = CHARACTERS[cid];
          const angle = (c.seat / total) * 2 * Math.PI - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          const isActive = activeChar === cid;
          return (
            <g key={cid} style={{cursor: "pointer"}} onClick={() => setActiveChar(activeChar === cid ? null : cid)}>
              <circle cx={x} cy={y} r={isActive ? 14 : 11} fill={c.color}
                stroke={isActive ? "#fff" : "#2a1810"} strokeWidth={isActive ? 2 : 1}
                filter={isActive ? "url(#seatGlow)" : undefined} />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">
                {c.short.slice(0,2)}
              </text>
            </g>
          );
        })}
        {(() => {
          const angle = (11 / total) * 2 * Math.PI - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <g>
              <circle cx={x} cy={y} r={11} fill="#e8d5a8" stroke="#c9a558" strokeWidth="2" strokeDasharray="2,1" />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fill="#2a1810" fontWeight="bold">你</text>
            </g>
          );
        })()}
      </svg>
    );
  };

  const showFreemiumNudge = phase === "intro" && gamesPlayed >= 1 && !userKey;
  const showDisclaimerBlocker = hydrated && !disclaimerAccepted;

  return (
    <div className="min-h-screen w-full relative" style={{
      background: "radial-gradient(ellipse at top, #4a1f15 0%, #2a1208 40%, #1a0a04 100%)",
      fontFamily: "'Noto Serif SC', 'Songti SC', serif"
    }}>
      {/* 右上角控制 */}
      {!showDisclaimerBlocker && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          {userKey && (
            <div className="px-2 py-1 text-xs rounded-full" style={{
              background: "rgba(90,122,62,0.2)", color: "#a8c084", border: "1px solid #5a7a3e"
            }}>
              · 使用自带 key ·
            </div>
          )}
          <button onClick={() => { setKeyInput(userKey); setShowSettings(true); }}
            className="p-2 rounded-full transition-all hover:bg-stone-800"
            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #5c3a2a", color: "#c9a558" }}
            title="设置 API Key">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 右下角:打赏按钮 */}
      {!showDisclaimerBlocker && (
        <button onClick={() => setShowDonate(true)}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #c9a558 0%, #a8842d 100%)",
            color: "#2a1208", fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 500, fontSize: "0.85rem",
            boxShadow: "0 4px 20px rgba(201,165,88,0.3)"
          }}>
          <Coffee className="w-4 h-4" /> 请作者一杯
        </button>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
        {phase === "intro" && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="mb-4 px-4 py-1 rounded-full text-xs tracking-widest" style={{
              background: "rgba(201,165,88,0.15)", color: "#c9a558", border: "1px solid #c9a558"
            }}>
              · 黑色幽默 · 文化讽刺 · 18+ ·
            </div>
            <h1 className="text-7xl md:text-8xl mb-2" style={{
              fontFamily: "'Ma Shan Zheng', cursive",
              color: "#c9a558",
              textShadow: "0 0 30px rgba(201,165,88,0.4), 2px 2px 0 #4a1f15"
            }}>
              山东酒桌模拟器
            </h1>
            <p className="text-2xl mb-8" style={{ color: "#a8748a", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
              The Banquet of Souls
            </p>

            <div className="max-w-xl space-y-4 mb-8 text-left" style={{ color: "#e8d5a8", fontFamily: "'Noto Sans SC', sans-serif" }}>
              <p className="leading-relaxed">
                你叫小李,普通职员。今晚被张副总拽到酒局——李主任主陪,吴总作客,桌上还有八九个各色人等。
              </p>
              <p className="leading-relaxed">
                十二道菜,你要在每道菜上做文章——拍马屁、敬酒、接黄段子、躲明枪暗箭。
                你的<span style={{color:"#c9a558"}}>谄媚指数</span>和<span style={{color:"#a83232"}}>猥琐指数</span>会被悄悄记录。
              </p>
            </div>

            {showFreemiumNudge && (
              <div className="max-w-xl mb-6 p-4 rounded-lg text-sm" style={{
                background: "rgba(201,165,88,0.08)", border: "1px solid #5c3a2a",
                color: "#e8d5a8", fontFamily: "'Noto Sans SC', sans-serif"
              }}>
                <div className="mb-2" style={{ color: "#c9a558" }}>· 你已经玩过 {gamesPlayed} 局 ·</div>
                <div className="leading-relaxed mb-3" style={{ color: "#9c8068" }}>
                  这游戏每局调用十几次 AI,作者掏的腰包。如果你想继续玩,可以:
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button onClick={() => { setKeyInput(userKey); setShowSettings(true); }}
                    className="px-4 py-2 rounded text-sm transition-all hover:opacity-80"
                    style={{ background: "#5a7a3e", color: "#fff" }}>
                    填入自己的 Key (永久免费)
                  </button>
                  <button onClick={() => setShowDonate(true)}
                    className="px-4 py-2 rounded text-sm transition-all hover:opacity-80"
                    style={{ background: "rgba(201,165,88,0.2)", color: "#c9a558", border: "1px solid #c9a558" }}>
                    打赏作者继续 ☕
                  </button>
                </div>
              </div>
            )}

            <button onClick={startGame}
              className="px-8 py-3 rounded-full text-lg transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #c9a558 0%, #a8842d 100%)",
                color: "#2a1208", fontFamily: "'Noto Serif SC', serif", fontWeight: 700,
                boxShadow: "0 4px 20px rgba(201,165,88,0.3)"
              }}>
              入座 →
            </button>
          </div>
        )}

        {phase === "playing" && (
          <>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #5c3a2a" }}>
                <div className="text-xs tracking-widest mb-1" style={{ color: "#9c8068" }}>进度</div>
                <div className="text-xl" style={{ color: "#c9a558", fontFamily: "'Ma Shan Zheng', cursive" }}>
                  {dishIdx + 1} / 12
                </div>
                <div className="text-xs mt-1" style={{ color: "#e8d5a8" }}>{DISHES[dishIdx]?.name}</div>
              </div>
              {[
                { key: "flattery", label: "谄媚指数", color: "#c9a558" },
                { key: "lewdness", label: "猥琐指数", color: "#a83232" },
                { key: "dignity", label: "人格剩余", color: "#5a7a3e" }
              ].map(s => (
                <div key={s.key} className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #5c3a2a" }}>
                  <div className="text-xs tracking-widest mb-1" style={{ color: "#9c8068" }}>{s.label}</div>
                  <div className="text-2xl mb-1" style={{ color: s.color, fontWeight: 700 }}>
                    {scores[s.key]}<span className="text-xs ml-1" style={{ color: "#9c8068" }}>/100</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="h-full transition-all" style={{ width: `${scores[s.key]}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <div className="rounded-lg p-3" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #5c3a2a" }}>
                  <div className="text-xs tracking-widest mb-2" style={{ color: "#9c8068" }}>圆桌座次 (点头像查看)</div>
                  <div className="aspect-square"><SeatingTable /></div>
                  {activeChar && (
                    <div className="mt-3 p-2 rounded text-xs" style={{ background: "rgba(201,165,88,0.1)", border: `1px solid ${CHARACTERS[activeChar].color}` }}>
                      <div style={{ color: CHARACTERS[activeChar].color, fontWeight: 700 }}>
                        {CHARACTERS[activeChar].name} · {CHARACTERS[activeChar].title}
                      </div>
                      <div className="mt-1" style={{ color: "#e8d5a8", lineHeight: 1.5 }}>{CHARACTERS[activeChar].persona}</div>
                    </div>
                  )}
                  {scoreLog.length > 0 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "#5c3a2a" }}>
                      <div className="text-xs mb-1" style={{ color: "#9c8068" }}>评分日志</div>
                      {scoreLog.slice(-3).map((s, i) => (
                        <div key={i} className="text-xs italic mb-1" style={{ color: "#a8748a" }}>· {s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 rounded-lg flex flex-col" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #5c3a2a", minHeight: "70vh" }}>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "60vh" }}>
                  {history.map((h, i) => {
                    if (h.type === "narration") {
                      return <div key={i} className="text-center text-xs italic py-2" style={{ color: "#9c8068" }}>{h.text}</div>;
                    }
                    if (h.type === "user") {
                      return (
                        <div key={i} className="flex justify-end">
                          <div className="max-w-[80%] px-3 py-2 rounded-lg" style={{
                            background: "rgba(232,213,168,0.15)", color: "#e8d5a8",
                            border: "1px solid #c9a558", fontFamily: "'Noto Sans SC', sans-serif", fontSize: "0.9rem"
                          }}>
                            <div className="text-xs opacity-60 mb-1">你 (小李)</div>
                            <div>{h.text}</div>
                          </div>
                        </div>
                      );
                    }
                    const c = CHARACTERS[h.char_id];
                    if (!c) return null;
                    return (
                      <div key={i} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: c.color, color: "#fff" }}>{c.short.slice(0, 1)}</div>
                        <div className="flex-1">
                          <div className="text-xs mb-1" style={{ color: c.color, fontWeight: 700 }}>{c.name}</div>
                          <div className="px-3 py-2 rounded-lg inline-block max-w-full" style={{
                            background: "rgba(255,255,255,0.05)", color: "#e8d5a8",
                            fontFamily: "'Noto Sans SC', sans-serif", fontSize: "0.9rem", lineHeight: 1.6
                          }}>{h.text}</div>
                        </div>
                      </div>
                    );
                  })}
                  {loading && (
                    <div className="flex items-center gap-2 text-xs italic" style={{ color: "#9c8068" }}>
                      <Loader2 className="w-3 h-3 animate-spin" /> 包间里弥漫着烟味...
                    </div>
                  )}
                  {error && (
                    <div className="text-xs p-2 rounded" style={{ background: "rgba(168,50,50,0.2)", color: "#ff9090" }}>{error}</div>
                  )}
                </div>

                <div className="px-3 pt-2 pb-1 border-t flex flex-wrap gap-1" style={{ borderColor: "#5c3a2a" }}>
                  <span className="text-xs self-center mr-1" style={{ color: "#9c8068" }}>敬:</span>
                  {["zhuren", "wudong", "fuzong", "kezhang", "guanxihu", "xiaoLiu"].map(cid => (
                    <button key={cid} onClick={() => handleToast(cid)} disabled={loading}
                      className="px-2 py-0.5 text-xs rounded transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ background: CHARACTERS[cid].color, color: "#fff" }}>
                      {CHARACTERS[cid].short}
                    </button>
                  ))}
                </div>

                <div className="p-3 border-t flex gap-2" style={{ borderColor: "#5c3a2a" }}>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="说点什么... (敬酒、附和、开黄腔、或者... 拒绝?)"
                    disabled={loading}
                    className="flex-1 px-3 py-2 rounded text-sm outline-none"
                    style={{ background: "rgba(0,0,0,0.4)", color: "#e8d5a8", border: "1px solid #5c3a2a", fontFamily: "'Noto Sans SC', sans-serif" }} />
                  <button onClick={handleSend} disabled={loading || !input.trim()}
                    className="px-4 rounded transition-all disabled:opacity-40"
                    style={{ background: "#c9a558", color: "#2a1208" }}>
                    <Send className="w-4 h-4" />
                  </button>
                  <button onClick={nextDish} disabled={loading || turnInDish < 1}
                    className="px-3 rounded transition-all disabled:opacity-30 flex items-center gap-1 text-xs"
                    style={{ background: "rgba(201,165,88,0.15)", color: "#c9a558", border: "1px solid #c9a558" }}>
                    {dishIdx >= 11 ? "散席" : "下一道"} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {phase === "ending" && finalReport && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-10">
            <Skull className="w-12 h-12 mb-4" style={{ color: "#c9a558" }} />
            <div className="text-xs tracking-[0.4em] mb-2" style={{ color: "#9c8068" }}>· 酒局散场 ·</div>
            <h2 className="text-5xl md:text-6xl mb-8" style={{
              fontFamily: "'Ma Shan Zheng', cursive", color: "#c9a558",
              textShadow: "0 0 20px rgba(201,165,88,0.4)"
            }}>{finalReport.title}</h2>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md w-full">
              {[
                { label: "谄媚", val: scores.flattery, color: "#c9a558" },
                { label: "猥琐", val: scores.lewdness, color: "#a83232" },
                { label: "人格", val: scores.dignity, color: "#5a7a3e" }
              ].map(s => (
                <div key={s.label} className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${s.color}` }}>
                  <div className="text-3xl mb-1" style={{ color: s.color, fontWeight: 700 }}>{s.val}</div>
                  <div className="text-xs" style={{ color: "#9c8068" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="max-w-xl space-y-4 mb-8" style={{ color: "#e8d5a8", fontFamily: "'Noto Sans SC', sans-serif" }}>
              <p className="leading-relaxed">{finalReport.verdict}</p>
              <p className="italic text-sm" style={{ color: "#a8748a" }}>{finalReport.consequence}</p>
            </div>

            {!userKey && (
              <div className="mb-6 p-3 rounded-lg max-w-md text-xs" style={{
                background: "rgba(201,165,88,0.08)", border: "1px solid #5c3a2a", color: "#9c8068"
              }}>
                喜欢这局?可以<button onClick={() => setShowDonate(true)} className="underline mx-1" style={{color:"#c9a558"}}>请作者一杯</button>
                或<button onClick={() => { setKeyInput(userKey); setShowSettings(true); }} className="underline mx-1" style={{color:"#5a7a3e"}}>填自己的 Key</button>
                继续畅玩
              </div>
            )}

            <button onClick={reset}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm transition-all hover:scale-105"
              style={{ background: "transparent", color: "#c9a558", border: "1px solid #c9a558" }}>
              <RotateCcw className="w-4 h-4" /> 再来一局
            </button>
          </div>
        )}
      </div>

      {/* ====== 页脚:精简版免责声明 ====== */}
      {!showDisclaimerBlocker && (
        <footer className="border-t mt-8 py-6 px-4" style={{
          borderColor: "#5c3a2a", background: "rgba(0,0,0,0.3)",
          fontFamily: "'Noto Sans SC', sans-serif"
        }}>
          <div className="max-w-3xl mx-auto text-xs leading-relaxed text-center" style={{ color: "#9c8068" }}>
            <div className="mb-2 whitespace-pre-line">{DISCLAIMER_SHORT.trim()}</div>
            <button onClick={() => setShowFullDisclaimer(true)}
              className="inline-flex items-center gap-1 mt-2 underline transition-all hover:opacity-80"
              style={{ color: "#c9a558" }}>
              <FileText className="w-3 h-3" /> 查看完整免责声明
            </button>
          </div>
        </footer>
      )}

      {/* ====== 首次进入:必须确认的免责声明 ====== */}
      {showDisclaimerBlocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
          background: "rgba(0,0,0,0.95)", backdropFilter: "blur(8px)"
        }}>
          <div className="max-w-2xl w-full max-h-[90vh] flex flex-col rounded-lg" style={{
            background: "#2a1810", border: "2px solid #5c3a2a",
            fontFamily: "'Noto Sans SC', sans-serif"
          }}>
            <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: "#5c3a2a" }}>
              <ShieldAlert className="w-6 h-6 flex-shrink-0" style={{ color: "#c9a558" }} />
              <h2 className="text-2xl" style={{
                color: "#c9a558", fontFamily: "'Ma Shan Zheng', cursive"
              }}>{FIRST_VISIT_TITLE}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-sm" style={{ color: "#e8d5a8" }}>
              {renderRichText(DISCLAIMER_FULL)}
            </div>

            <div className="p-6 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: "#5c3a2a" }}>
              <button onClick={declineDisclaimer}
                className="flex-1 px-4 py-3 rounded text-sm transition-all hover:opacity-80"
                style={{ background: "transparent", color: "#9c8068", border: "1px solid #5c3a2a" }}>
                {DECLINE_BUTTON}
              </button>
              <button onClick={acceptDisclaimer}
                className="flex-1 px-4 py-3 rounded text-sm transition-all hover:opacity-80"
                style={{
                  background: "linear-gradient(135deg, #c9a558 0%, #a8842d 100%)",
                  color: "#2a1208", fontWeight: 600
                }}>
                {ACKNOWLEDGE_BUTTON}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== 查看完整免责声明 (任意时刻可调出) ====== */}
      {showFullDisclaimer && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{
          background: "rgba(0,0,0,0.8)"
        }}>
          <div className="max-w-2xl w-full max-h-[85vh] flex flex-col rounded-lg" style={{
            background: "#2a1810", border: "1px solid #5c3a2a",
            fontFamily: "'Noto Sans SC', sans-serif"
          }}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "#5c3a2a" }}>
              <h2 className="text-xl" style={{
                color: "#c9a558", fontFamily: "'Ma Shan Zheng', cursive"
              }}>完整免责声明</h2>
              <button onClick={() => setShowFullDisclaimer(false)}
                className="p-1 rounded hover:bg-stone-800" style={{ color: "#9c8068" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-sm" style={{ color: "#e8d5a8" }}>
              {renderRichText(DISCLAIMER_FULL)}
            </div>
          </div>
        </div>
      )}

      {/* ====== 设置弹窗 ====== */}
      {showSettings && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="max-w-md w-full p-6 rounded-lg relative" style={{
            background: "#2a1810", border: "1px solid #5c3a2a", fontFamily: "'Noto Sans SC', sans-serif"
          }}>
            <button onClick={() => setShowSettings(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-stone-800" style={{ color: "#9c8068" }}>
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl mb-1" style={{ color: "#c9a558", fontFamily: "'Ma Shan Zheng', cursive" }}>
              使用你自己的 Gemini Key
            </h3>
            <p className="text-xs mb-4" style={{ color: "#9c8068" }}>
              填入后所有 API 调用走你的账号,作者不收你一分钱,你想玩多少局都行
            </p>

            <div className="space-y-3 text-sm" style={{ color: "#e8d5a8" }}>
              <div>
                <label className="block text-xs mb-1" style={{ color: "#9c8068" }}>Gemini API Key</label>
                <input value={keyInput} onChange={e => setKeyInput(e.target.value)}
                  placeholder="AIza..." type="password"
                  className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{ background: "rgba(0,0,0,0.4)", color: "#e8d5a8", border: "1px solid #5c3a2a" }} />
              </div>

              <div className="text-xs leading-relaxed p-3 rounded" style={{
                background: "rgba(201,165,88,0.05)", color: "#9c8068", border: "1px solid #5c3a2a"
              }}>
                <div className="mb-2" style={{ color: "#c9a558" }}>怎么拿到 Gemini Key?</div>
                <div>1. 打开 <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline" style={{color:"#c9a558"}}>aistudio.google.com/apikey <ExternalLink className="inline w-3 h-3"/></a></div>
                <div>2. 登录 Google 账号</div>
                <div>3. 点 "Create API key",复制 AIza... 开头的字符串</div>
                <div className="mt-2 pt-2 border-t" style={{ borderColor: "#5c3a2a" }}>
                  Key 只存在你的浏览器里,作者看不到。免费额度足够你玩几十局。
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={saveKey}
                  className="flex-1 px-4 py-2 rounded transition-all hover:opacity-80"
                  style={{ background: "#c9a558", color: "#2a1208", fontWeight: 600 }}>
                  保存
                </button>
                {userKey && (
                  <button onClick={() => { setKeyInput(""); }}
                    className="px-3 py-2 rounded text-xs transition-all hover:opacity-80"
                    style={{ background: "transparent", color: "#9c8068", border: "1px solid #5c3a2a" }}>
                    清空
                  </button>
                )}
              </div>

              <button onClick={() => { setShowSettings(false); setShowFullDisclaimer(true); }}
                className="w-full text-xs underline pt-2" style={{ color: "#9c8068" }}>
                查看完整免责声明
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== 打赏弹窗 ====== */}
      {showDonate && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="max-w-md w-full p-6 rounded-lg relative" style={{
            background: "#2a1810", border: "1px solid #5c3a2a", fontFamily: "'Noto Sans SC', sans-serif"
          }}>
            <button onClick={() => setShowDonate(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-stone-800" style={{ color: "#9c8068" }}>
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl mb-1" style={{ color: "#c9a558", fontFamily: "'Ma Shan Zheng', cursive" }}>
              请作者一杯
            </h3>
            <p className="text-xs mb-4" style={{ color: "#9c8068" }}>
              这游戏每局 AI 调用花作者几毛钱。如果让你笑了一下,可以小小赞助一下,鼓励多写点
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="aspect-square rounded-lg flex items-center justify-center mb-2 overflow-hidden" style={{
                  background: "#fff", border: "1px solid #5c3a2a"
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/donate-wechat.jpg" alt="微信收款码"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div className="w-full h-full hidden items-center justify-center text-xs p-2" style={{ color: "#9c8068" }}>
                    把微信收款码<br/>命名为<br/>donate-wechat.jpg<br/>放在 /public 目录
                  </div>
                </div>
                <div className="text-xs" style={{ color: "#5a7a3e" }}>微信</div>
              </div>

              <div className="text-center">
                <div className="aspect-square rounded-lg flex items-center justify-center mb-2 overflow-hidden" style={{
                  background: "#fff", border: "1px solid #5c3a2a"
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/donate-alipay.jpg" alt="支付宝收款码"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div className="w-full h-full hidden items-center justify-center text-xs p-2" style={{ color: "#9c8068" }}>
                    把支付宝收款码<br/>命名为<br/>donate-alipay.jpg<br/>放在 /public 目录
                  </div>
                </div>
                <div className="text-xs" style={{ color: "#3a6e8e" }}>支付宝</div>
              </div>
            </div>

            <p className="text-xs italic text-center mt-4" style={{ color: "#9c8068" }}>
              不打赏也完全没关系,代码会一直跑下去。<br/>
              想白嫖请玩自己的 key,作者也乐见。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
