/* ============================================
   曲焱作品集 · 站点数据文件
   后台管理修改此文件，前台自动更新
   ============================================ */
window.SITE_DATA = {

  /* ===== 站点基础信息 ===== */
  site: {
    logo: "QU YAN · 曲焱",
    contact: {
      wechatQr: "",          // 微信二维码图片路径，如 images/qr.png
      phone: "138-0000-0000",
      email: "quyan@design.com",
      address: "吉林市"
    }
  },

  /* ===== 首页内容 ===== */
  home: {

    /* 首屏 */
    hero: {
      title1: "方寸之间",
      title2: "境由心生",
      bgImage: ""            // 首屏背景图路径，留空用渐变占位
    },

    /* 经验介绍（两行） */
    intro: {
      line1: "空间有界，意境无界——在有限的方寸之间，营造无限的生活可能。",
      line2: "一光一影，一砖一瓦——好的设计从不喧哗，只在细节里静静生长。"
    },

    /* 视频区 */
    video: {
      src: "",               // 视频文件路径，如 videos/showreel.mp4
      poster: "",            // 视频封面图路径
      label: "SHOWREEL · 设计影像"
    },

    /* 空间叙事（作品轮播） */
    works: {
      label: "SELECTED WORKS",
      title: "空间叙事",
      subtitle: "商业空间、住宅全案、办公环境——每一个项目都是对空间与生活方式的回应。",
      slides: [
        { tag: "COMMERCIAL", title: "酒店大堂", desc: "商业空间设计 · 全案落地", image: "" },
        { tag: "RESIDENTIAL", title: "住宅全案", desc: "私宅空间 · 从概念到落地", image: "" },
        { tag: "OFFICE", title: "办公空间", desc: "现代办公 · 高效与美学", image: "" },
        { tag: "HOSPITALITY", title: "餐饮娱乐", desc: "商业空间 · 氛围营造", image: "" }
      ]
    },

    /* 设计理念 */
    philosophy: {
      label: "PHILOSOPHY",
      title: "设计理念",
      text: "设计不是堆砌风格，而是理解生活。每一个空间都有它的性格，每一位使用者都有他的习惯。我们做的，是让空间与人彼此成就。",
      image: ""
    },

    /* 服务内容（2×2卡片） */
    services: {
      label: "SERVICES",
      title: "服务内容",
      items: [
        { num: "01", name: "室内全案设计", desc: "从概念方案到效果呈现，一站式全案落地" },
        { num: "02", name: "施工图深化", desc: "专业施工图绘制，节点细节精准可施工" },
        { num: "03", name: "建筑设计", desc: "建筑方案与改造设计，兼顾功能与形态" },
        { num: "04", name: "消防改造设计", desc: "消防规范把控，改造方案合规落地" }
      ]
    },

    /* 工作流程 */
    process: {
      label: "PROCESS",
      title: "工作流程",
      text: "需求沟通 → 现场勘测 → 概念方案 → 效果呈现 → 施工图深化 → 施工配合。每一步都有明确交付物，不脱节、不模糊。",
      button: "查看流程",
      image: ""
    },

    /* 关于我（页脚） */
    about: {
      label: "ABOUT",
      title: "关于我",
      paragraphs: [
        "室内设计师，深耕室内全案设计与施工图深化多年。",
        "相信好的设计不只是好看，更要好用、好施工、好落地。",
        "从空间规划到节点细节，从效果呈现到图纸交付，用专业能力把设计想法变成可施工的现实。"
      ],
      button: "更多项目"
    }
  },

  /* ===== 项目列表页 ===== */
  projectsPage: {
    label: "PROJECTS",
    title: "项目",
    subtitle: "精选作品 · 室内 / 建筑 / 景观",
    categories: [
      { key: "all", name: "全部" },
      { key: "interior", name: "室内" },
      { key: "architecture", name: "建筑" },
      { key: "landscape", name: "景观" }
    ],
    loadMoreText: "显示更多"
  },

  /* ===== 项目数据 ===== */
  projects: [
    {
      id: 1,
      title: "酒店大堂全案",
      category: "interior",
      categoryName: "室内",
      location: "吉林",
      year: "2024",
      cover: "",
      detail: {
        heroImage: "",
        description: "本案位于吉林市中心，是一家精品商务酒店的大堂全案设计。设计以「城市会客厅」为概念，将东北地域文化与现代商务空间融合，通过材质、光线与尺度的精心把控，营造出既庄重又温暖的抵达体验。从入口雨棚到接待台，从休息区到电梯厅，每一处细节都经过反复推敲，确保宾客从踏入酒店的第一步起，就能感受到空间的品质与温度。",
        info: {
          type: "室内全案设计",
          location: "吉林市",
          year: "2024",
          area: "1,200 ㎡",
          scope: "方案设计 / 施工图深化 / 软装搭配"
        },
        quote: "空间的温度，来自对人的理解。",
        quoteAuthor: "曲焱 · 设计主创",
        blocks: [
          { type: "full-image", image: "" },
          { type: "text-image", align: "left", title: "设计概念", text: "以「城市会客厅」为核心概念，打破传统酒店大堂的对称布局，用流动的动线引导宾客自然抵达接待区。", image: "" },
          { type: "image-text", align: "right", title: "材质语言", text: "深色木饰面与浅灰石材形成对比，局部金属点缀提升精致感，整体色调沉稳而不沉闷。", image: "" },
          { type: "double-image", image1: "", image2: "" },
          { type: "quote", text: "空间的温度，来自对人的理解。", author: "曲焱 · 设计主创" },
          { type: "full-image", image: "" }
        ]
      }
    },
    {
      id: 2,
      title: "住宅全案设计",
      category: "interior",
      categoryName: "室内",
      location: "长春",
      year: "2024",
      cover: "",
      detail: {
        heroImage: "",
        description: "一套280㎡的私宅全案设计，业主为三口之家。设计以「留白」为核心，用克制的色彩和材质，为生活留出更多可能。",
        info: {
          type: "住宅全案设计",
          location: "长春市",
          year: "2024",
          area: "280 ㎡",
          scope: "方案设计 / 施工图深化 / 软装搭配"
        },
        quote: "家不是展示品，是每天都要回去的地方。",
        quoteAuthor: "曲焱 · 设计主创",
        blocks: [
          { type: "full-image", image: "" },
          { type: "text-image", align: "left", title: "空间规划", text: "公共区域完全打开，客餐厨一体化，让家人的互动不被墙体阻隔。", image: "" },
          { type: "full-image", image: "" }
        ]
      }
    },
    {
      id: 3,
      title: "文化活动中心",
      category: "architecture",
      categoryName: "建筑",
      location: "吉林",
      year: "2023",
      cover: "",
      detail: {
        heroImage: "",
        description: "社区文化活动中心建筑设计，包含展览、阅读、多功能厅等功能。建筑以简洁的几何体块回应周边环境。",
        info: {
          type: "建筑设计",
          location: "吉林市",
          year: "2023",
          area: "3,500 ㎡",
          scope: "建筑方案 / 施工图"
        },
        quote: "公共建筑应该属于每一个人。",
        quoteAuthor: "曲焱 · 设计主创",
        blocks: [
          { type: "full-image", image: "" },
          { type: "text-image", align: "left", title: "形体生成", text: "三个几何体块交错组合，形成丰富的室内外空间层次。", image: "" },
          { type: "full-image", image: "" }
        ]
      }
    },
    {
      id: 4,
      title: "办公空间设计",
      category: "interior",
      categoryName: "室内",
      location: "吉林",
      year: "2023",
      cover: "",
      detail: {
        heroImage: "",
        description: "科技公司办公空间设计，800㎡，开放工位与独立办公室结合，注重协作与专注的平衡。",
        info: {
          type: "室内设计",
          location: "吉林市",
          year: "2023",
          area: "800 ㎡",
          scope: "方案设计 / 施工图深化"
        },
        quote: "好的办公空间让人愿意来上班。",
        quoteAuthor: "曲焱 · 设计主创",
        blocks: [
          { type: "full-image", image: "" },
          { type: "full-image", image: "" }
        ]
      }
    },
    {
      id: 5,
      title: "园区景观规划",
      category: "landscape",
      categoryName: "景观",
      location: "吉林",
      year: "2023",
      cover: "",
      detail: {
        heroImage: "",
        description: "产业园区景观规划设计，以慢行系统串联各功能区块，营造宜人的工作环境。",
        info: {
          type: "景观设计",
          location: "吉林市",
          year: "2023",
          area: "50,000 ㎡",
          scope: "景观方案 / 施工图"
        },
        quote: "景观是建筑与自然之间的对话。",
        quoteAuthor: "曲焱 · 设计主创",
        blocks: [
          { type: "full-image", image: "" },
          { type: "full-image", image: "" }
        ]
      }
    },
    {
      id: 6,
      title: "商业综合体改造",
      category: "architecture",
      categoryName: "建筑",
      location: "吉林",
      year: "2022",
      cover: "",
      detail: {
        heroImage: "",
        description: "老旧商业综合体改造项目，通过外立面更新、动线重组和消防改造，让建筑重新焕发活力。",
        info: {
          type: "建筑改造 / 消防设计",
          location: "吉林市",
          year: "2022",
          area: "12,000 ㎡",
          scope: "改造方案 / 消防设计 / 施工图"
        },
        quote: "改造不是推翻，是让旧空间适应新生活。",
        quoteAuthor: "曲焱 · 设计主创",
        blocks: [
          { type: "full-image", image: "" },
          { type: "text-image", align: "left", title: "改造策略", text: "保留主体结构，更新外立面和公共区域，重新组织商业动线。", image: "" },
          { type: "full-image", image: "" }
        ]
      }
    }
  ],

  /* ===== 访问统计（由后端自动更新） ===== */
  stats: {
    totalVisits: 0,
    lastVisit: ""
  }
};
