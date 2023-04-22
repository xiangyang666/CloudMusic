export default [
  {
    path: "/",
    redirect: "/layout",
  },
  // 登录页面路由
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
    meta: {
      isAuth: false,
    },
  },
  // 总页面布局路由
  {
    path: "/layout",
    name: "layout",
    redirect: "/layout/home",
    component: () => import("@/views/layout"),
    // 网易云首页的页面路由
    children: [
      // 首页
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home"),
      },
      // 歌单详情
      {
        path: "musicdetail/:id",
        name: "musicDetail",
        component: () => import("@/components/MusicDetail"),
      },
      // 个人页面（网易云用户的页面，不是自己）
      {
        path: "personal/:id",
        name: "personal",
        component: () => import("@/components/Personal"),
      },
      // 搜索关键词结果详情页
      {
        path: "/search/:keyword",
        name: "search",
        component: () => import("@/components/SearchResultDetail"),
      },
      // 用户中心
      {
        path: "userInfo",
        name: "userInfo",
        component: () => import("@/views/UserInfo"),
        meta: {
          isAuth: true,
        },
      },
      // 关于我们
      {
        path: "aboutInfo",
        name: "aboutInfo",
        component: () => import("@/views/aboutView"),
      },
      // mv视频
      {
        path: "video",
        name: "video",
        component: () => import("@/views/VideoView"),
        meta: {
          isAuth: true,
        },
      },
      // 播放视频详情组件
      {
        path: "videodetail/:id",
        name: "videodetail",
        component: () => import("@/components/VideoDetail"),
        meta: {
          isAuth: true,
        },
      },
      // MV详情组件
      {
        path: "mvdetail/:id",
        name: "mvdetail",
        component: () => import("@/components/MvDetail"),
        meta: {
          isAuth: true,
        },
      },
      // 时间线
      {
        path: "timeline",
        name: "timeline",
        component: () => import("@/components/TimeLine"),
        meta: {
          isAuth: true,
        },
      },
      // 每日推荐
      {
        path: "dayrecommend",
        name: "dayrecommend",
        component: () => import("@/components/DayRecommend"),
        meta: {
          isAuth: true,
        },
      },
      // 歌手详情页
      {
        path: "singerdetail/:id",
        name: "singerdetail",
        component: () => import("@/components/SingerDetail"),
      },
      // 歌手专辑详情页
      {
        path: "album/:id",
        name: "album",
        component: () => import("@/components/Album"),
      },
      // 收藏页
      {
        path: "collect",
        name: "collect",
        component: () => import("@/views/collect"),
        meta: {
          isAuth: true,
        },
      },
      {
        path: "setting",
        name: "setting",
        component: () => import("@/views/set"),
      },
    ],
  },
  {
    // 匹配所有的路径
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/errorPage"),
  },
];
