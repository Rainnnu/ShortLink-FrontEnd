import Vue from "vue";
import VueRouter from "vue-router";
import CreateShortLink from "../views/CreateShortLink.vue";
import Layout from "@/views/Layout.vue";
import LinkDetail from "@/views/LinkDetail.vue";
import ShortLinkList from "@/views/ShortLinkList.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";
import Tag from "@/views/Tag.vue";
import RedirectPage from "@/views/RedirectPage.vue";
import NotFound from "@/views/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/create",

    children: [
      {
        path: "/create",
        name: "CreateShortLink",
        component: CreateShortLink,
      },
      {
        path: "/list",
        name: "ShortLinkList",
        component: ShortLinkList,
      },
      // {
      //   path: "/detail",
      //   name: "LinkDetail",
      //   component: LinkDetail,
      // },
      {
        path: "/user",
        name: "User",
        component: User,
      },
      {
        path: "/Tag",
        name: "Tag",
        component: Tag,
      },
      {
        path: "/sparrow/:shortLink",
        name: "Redirect",
        component: RedirectPage,
        props: true,
      },
    ],
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "*", // 捕获所有未匹配的路由
    redirect: "/404",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("accessToken");

  // 如果要访问的是登录页，直接放行
  if (to.name === "Login") {
    return next();
  }
  // 如果没有token，重定向到登录页
  if (!accessToken) {
    return next({ name: "Login" });
  }

  // 如果访问的是不存在的路由
  if (!to.matched.length) {
    next({ name: "NotFound" });
    return;
  }

  // 否则继续导航
  next();
});

export default router;
