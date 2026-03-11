# IMA Studio Skills — 宣传页 / Landing Page

本仓库为 **IMA Studio 技能包** 的 GitHub Pages 宣传站点，支持中英双语。

This repository hosts the **IMA Studio Skills** landing page for GitHub Pages, with Chinese and English support.

---

## 本地预览 / Local Preview

```bash
# 进入项目目录
cd ima-skills-pages

# 用本地服务器打开（任选其一）
npx serve .
# 或
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

---

## 启用 GitHub Pages / Enable GitHub Pages

1. **将本目录推送到独立仓库（推荐）**
   - 新建仓库，例如 `ima-skills-pages` 或 `ima-studio-skills`
   - 将当前目录内容推送到该仓库的 `main` 分支

2. **在 GitHub 仓库设置中开启 Pages**
   - 打开仓库 **Settings → Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `master`，根目录 `/ (root)`
   - 保存后等待部署，访问 `https://<username>.github.io/<repo-name>/`

3. **自定义域名（可选）**
   - 在仓库根目录添加 `CNAME` 文件，内容为你的域名（如 `skills.imastudio.com`）
   - 在 DNS 中为该域名添加 CNAME 记录指向 `<username>.github.io`

---

## 项目结构 / Structure

```
ima-skills-pages/
├── index.html          # 单页入口，中英切换由 JS 注入
├── assets/
│   ├── css/
│   │   └── style.css   # 样式
│   └── js/
│       ├── i18n.js     # 中英文案
│       └── main.js     # 语言切换与渲染
└── README.md
```

- **多语言**：`assets/js/i18n.js` 中的 `window.I18N` 含 `zh` / `en`，修改此处即可更新文案。
- **样式**：`assets/css/style.css` 使用 CSS 变量，便于改主题色和间距。

---

## 技能列表与链接 / Skills & Links

| 技能名 (Name)     | Slug               | 说明概要 |
|-------------------|--------------------|----------|
| IMA Studio        | ima-all-ai         | 一站式图像 / 视频 / 音乐 / TTS |
| IMA 图像生成      | ima-image-ai       | SeeDream、Midjourney、Nano Banana |
| IMA 视频生成      | ima-video-ai       | Wan、Kling、Veo、Sora、Pixverse |
| IMA 音乐生成      | ima-voice-ai       | Suno、DouBao BGM/Song |
| IMA TTS           | ima-tts-ai         | 文字转语音 |
| IMA Knowledge AI  | ima-knowledge-ai   | 工作流与模型选择知识库 |
| IMA Nano Banana   | ai-nano-banana-ima | 仅 Nano Banana 系列图像 |

安装方式：在 [ClawHub](https://claw-hub.net) 或 OpenClaw 中搜索上述 **slug** 或「IMA」即可。

---

## 许可 / License

与 IMA Studio 技能包保持一致。  
Same as the IMA Studio skills packages.
