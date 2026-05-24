# 山东酒桌模拟器 · The Banquet of Souls

一场关于酒桌文化的黑色幽默讽刺游戏。由 Gemini 2.5 Flash 驱动。

## 快速部署 (Vercel)

1. 把这个文件夹整个上传到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入这个仓库
3. 在 Vercel 项目的 **Settings → Environment Variables** 添加:
   - Name: `GEMINI_API_KEY`
   - Value: 你的 Google Gemini API key (`AIza...` 开头)
4. 点击 Deploy

## 可选环境变量

- `GEMINI_MODEL` —— 默认 `gemini-2.5-flash`。如果想用 Pro 模型,改成 `gemini-2.5-pro`

## 本地开发 (可选,不需要部署的话跳过)

```bash
npm install
# 创建 .env.local 文件,内容: GEMINI_API_KEY=你的key
npm run dev
```

打开 http://localhost:3000

## 成本预估

每位玩家完整玩一局 (12 道菜 × ~3 轮对话) 大约消耗:
- gemini-2.5-flash: $0.02 - $0.05 / 局
- gemini-2.5-pro: $0.30 - $0.80 / 局

建议在 Google Cloud Console 设置每日预算告警,防止超支。

## 文件结构

```
shandong-simulator/
├── app/
│   ├── api/chat/route.js    # 后端: 调用 Gemini 的代理
│   ├── globals.css           # 全局样式
│   ├── layout.js             # 根布局 + 字体加载
│   └── page.js               # 游戏主界面
├── package.json              # 依赖
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```
