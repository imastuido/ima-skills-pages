/**
 * IMA Skills Landing — Bilingual content (ZH / EN)
 */
window.I18N = {
  zh: {
    nav: {
      features: '能力与优势',
      skills: '技能列表',
      how: '使用方式',
      cta: '开始使用',
    },
    hero: {
      title: 'IMA Studio — 全栈创作引擎',
      subtitle: '图像 · 视频 · 音乐 · 语音，一链打通。40+ 顶尖模型智能编排，从想法到成片，一条指令。',
      cta: '查看技能',
      ctaSecondary: '了解 IMA',
    },
    features: {
      title: '能力与优势',
      subtitle: '面向 AI Agent 与开发者的专业创作技能，覆盖业界主流模型与完整工作流',
      items: [
        {
          title: '多模型统一入口',
          desc: 'SeeDream、Midjourney、Nano Banana、Wan、Kling、Veo、Sora、Suno、DouBao 等一网打尽，无需切换多套 API。',
        },
        {
          title: '知识库驱动',
          desc: 'ima-knowledge-ai 提供工作流设计、模型选择、视觉一致性、长视频制作等最佳实践，先读后做、少踩坑。',
        },
        {
          title: '跨媒体工作流',
          desc: '图→视频、视频+音乐、角色一致性、多镜头成片，从单次生成到完整 MV/宣传片均可编排。',
        },
        {
          title: '模型智能选择',
          desc: '按任务类型、预算与质量需求自动或推荐模型，成本与效果可控。',
        },
        {
          title: '即装即用',
          desc: '兼容 OpenClaw / ClawHub、Cursor 等 Agent 平台，安装技能后配置 API Key 即可调用。',
        },
      ],
    },
    skills: {
      title: '技能列表',
      subtitle: '可按需安装单一技能，或使用 IMA Studio 一站式覆盖全部创作场景',
      repoBaseUrl: 'https://github.com/imastudio',
      copyInstall: 'GITHUB 安装',
      copyClawhub: 'clawhub 安装',
      copied: '已复制',
      viewOnGitHub: 'GitHub 仓库',
      list: [
        {
          name: 'IMA Studio',
          slug: 'ima-all-ai',
          tag: '一站式',
          shortDesc: '图像、视频、音乐、TTS 全能力统一入口，多模型智能调度与工作流编排。',
          models: 'SeeDream · Midjourney · Nano Banana · Wan · Kling · Veo · Sora · Suno · DouBao · TTS',
        },
        {
          name: 'IMA 图像生成',
          slug: 'ima-image-ai',
          tag: '图像',
          shortDesc: '文生图 / 图生图，SeeDream 4.5、Midjourney、Nano Banana 2/Pro，支持 1K/2K/4K。',
          models: 'SeeDream 4.5 · Midjourney · Nano Banana 2 · Nano Banana Pro',
        },
        {
          name: 'IMA 视频生成',
          slug: 'ima-video-ai',
          tag: '视频',
          shortDesc: '文生视频 / 图生视频，Wan 2.6、Kling、Veo、Sora、Pixverse 等，支持角色一致性。',
          models: 'Wan 2.6 · Kling O1/2.6 · Veo 3.1 · Sora 2 Pro · Pixverse · SeeDance',
        },
        {
          name: 'IMA 音乐生成',
          slug: 'ima-voice-ai',
          tag: '音乐',
          shortDesc: 'Suno、DouBao BGM/Song，文本作曲、BGM、人声歌曲，输出 MP3/WAV。',
          models: 'Suno sonic · DouBao BGM · DouBao Song',
        },
        {
          name: 'IMA TTS',
          slug: 'ima-tts-ai',
          tag: '语音',
          shortDesc: '文字转语音，多音色动态列表，适合配音与有声内容。',
          models: 'seed-tts-2.0 等',
        },
        {
          name: 'IMA Knowledge AI',
          slug: 'ima-knowledge-ai',
          tag: '知识库',
          shortDesc: '工作流设计、模型选择、视觉一致性、长视频制作等文档，建议在任意生成前先读。',
          models: '文档与最佳实践',
        },
        {
          name: 'IMA Nano Banana',
          slug: 'ai-nano-banana-ima',
          tag: '轻量图像',
          shortDesc: '仅 Nano Banana 系列三款模型，文生图/图生图，独立发布、无外部技能依赖。',
          models: 'Nano Banana · Nano Banana Pro · Nano Banana 2',
        },
      ],
      installHint: '每个技能卡片上均有 GitHub 仓库地址与「GITHUB 安装」按钮（复制 git clone 命令），可直接用 git clone 或 curl 从 GitHub 拉取，无需经 ClawHub。下方另有纯文本列表供爬虫/无 JS 环境使用。使用前请阅读 ima-knowledge-ai。',
    },
    how: {
      title: '使用方式',
      subtitle: '安装技能后，在 Agent 中通过自然语言或脚本调用即可',
      steps: [
        { step: '1', title: '安装技能', desc: '在 ClawHub / OpenClaw 或 Cursor 技能目录中搜索「IMA」或技能 slug，安装所需技能。' },
        { step: '2', title: '配置 API Key', desc: '获取 IMA API Key（imaclaw.ai），在环境中配置 IMA_API_KEY。' },
        { step: '3', title: '先读知识库', desc: '复杂任务（MV、多镜头、角色一致）建议先让 Agent 阅读 ima-knowledge-ai 中的相关文档。' },
        { step: '4', title: '发起创作', desc: '用自然语言描述需求，如「用 SeeDream 画一只柴犬」「用 Kling 把这张图做成 5 秒视频」。' },
      ],
    },
    cta: {
      title: '立即体验',
      subtitle: '在 ClawHub 或 OpenClaw 中搜索 IMA，或访问 imaclaw.ai 获取 API。',
      button: '访问 IMA Studio',
    },
    footer: {
      brand: 'IMA Studio Skills',
      links: 'ClawHub · OpenClaw · imaclaw.ai',
      lang: '语言',
    },
  },
  en: {
    nav: {
      features: 'Features',
      skills: 'Skills',
      how: 'How to Use',
      cta: 'Get Started',
    },
    hero: {
      title: 'IMA Studio — Full-Stack Creation Engine',
      subtitle: 'Image · Video · Music · Voice — one pipeline. 40+ models, one command. Idea to asset, intelligently orchestrated.',
      cta: 'View Skills',
      ctaSecondary: 'Learn about IMA',
    },
    features: {
      title: 'Capabilities & Advantages',
      subtitle: 'Professional creation skills for AI agents and developers, covering leading models and full workflows',
      items: [
        {
          title: 'Unified multi-model access',
          desc: 'SeeDream, Midjourney, Nano Banana, Wan, Kling, Veo, Sora, Suno, DouBao and more — one entry point, no juggling multiple APIs.',
        },
        {
          title: 'Knowledge-base driven',
          desc: 'ima-knowledge-ai provides workflow design, model selection, visual consistency, and long-form video best practices — read first, create better.',
        },
        {
          title: 'Cross-media workflows',
          desc: 'Image→video, video+music, character consistency, multi-shot production — from single generations to full MV or promo workflows.',
        },
        {
          title: 'Smart model selection',
          desc: 'Choose or recommend models by task type, budget, and quality; cost and outcome are predictable.',
        },
        {
          title: 'Install and go',
          desc: 'Works with OpenClaw, ClawHub, Cursor and other agent platforms; configure API key and start calling.',
        },
      ],
    },
    skills: {
      title: 'Skills',
      subtitle: 'Install individual skills or use IMA Studio for all creation scenarios',
      repoBaseUrl: 'https://github.com/imastudio',
      copyInstall: 'GITHUB install',
      copyClawhub: 'Clawhub install',
      copied: 'Copied',
      viewOnGitHub: 'View on GitHub',
      list: [
        {
          name: 'IMA Studio',
          slug: 'ima-all-ai',
          tag: 'All-in-one',
          shortDesc: 'Unified image, video, music, and TTS with multi-model orchestration and workflow support.',
          models: 'SeeDream · Midjourney · Nano Banana · Wan · Kling · Veo · Sora · Suno · DouBao · TTS',
        },
        {
          name: 'IMA Image Generation',
          slug: 'ima-image-ai',
          tag: 'Image',
          shortDesc: 'Text-to-image and image-to-image with SeeDream 4.5, Midjourney, Nano Banana 2/Pro; 1K/2K/4K.',
          models: 'SeeDream 4.5 · Midjourney · Nano Banana 2 · Nano Banana Pro',
        },
        {
          name: 'IMA Video Generation',
          slug: 'ima-video-ai',
          tag: 'Video',
          shortDesc: 'Text-to-video and image-to-video with Wan 2.6, Kling, Veo, Sora, Pixverse; character consistency supported.',
          models: 'Wan 2.6 · Kling O1/2.6 · Veo 3.1 · Sora 2 Pro · Pixverse · SeeDance',
        },
        {
          name: 'IMA Music Generation',
          slug: 'ima-voice-ai',
          tag: 'Music',
          shortDesc: 'Suno, DouBao BGM/Song — text-to-music, BGM, vocal tracks; MP3/WAV output.',
          models: 'Suno sonic · DouBao BGM · DouBao Song',
        },
        {
          name: 'IMA TTS',
          slug: 'ima-tts-ai',
          tag: 'Speech',
          shortDesc: 'Text-to-speech with multiple voices; ideal for dubbing and audio content.',
          models: 'seed-tts-2.0 and more',
        },
        {
          name: 'IMA Knowledge AI',
          slug: 'ima-knowledge-ai',
          tag: 'Knowledge',
          shortDesc: 'Workflow design, model selection, visual consistency, long-video production; read before any generation.',
          models: 'Docs & best practices',
        },
        {
          name: 'IMA Nano Banana',
          slug: 'ai-nano-banana-ima',
          tag: 'Lightweight image',
          shortDesc: 'Nano Banana family only — text/image to image; standalone, no external skill dependencies.',
          models: 'Nano Banana · Nano Banana Pro · Nano Banana 2',
        },
      ],
      installHint: 'Each skill card shows the GitHub repo URL and a "GITHUB install" button (copies git clone command). You can git clone or curl from GitHub directly without ClawHub. A plain-text list below is available for crawlers / no-JS. Read ima-knowledge-ai before use.',
    },
    how: {
      title: 'How to Use',
      subtitle: 'After installing, invoke via natural language or scripts in your agent',
      steps: [
        { step: '1', title: 'Install skills', desc: 'Search for "IMA" or the skill slug in ClawHub, OpenClaw, or Cursor skills; install what you need.' },
        { step: '2', title: 'Set API key', desc: 'Get an IMA API key (imaclaw.ai) and set IMA_API_KEY in your environment.' },
        { step: '3', title: 'Read the knowledge base', desc: 'For complex tasks (MV, multi-shot, character consistency), have the agent read relevant ima-knowledge-ai docs first.' },
        { step: '4', title: 'Create', desc: 'Describe in natural language, e.g. "Draw a Shiba Inu with SeeDream" or "Turn this image into a 5s video with Kling".' },
      ],
    },
    cta: {
      title: 'Get Started',
      subtitle: 'Search for IMA on ClawHub or OpenClaw, or visit imaclaw.ai for API access.',
      button: 'Visit IMA Studio',
    },
    footer: {
      brand: 'IMA Studio Skills',
      links: 'ClawHub · OpenClaw · imaclaw.ai',
      lang: 'Language',
    },
  },
};
