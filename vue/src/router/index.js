import Vue from "vue";
import VueRouter from "vue-router";
import CreateShortLink from "../views/CreateShortLink.vue";
import Layout from "@/views/Layout.vue";
import LinkDetail from "@/views/LinkDetail.vue";
import ShortLinkList from "@/views/ShortLinkList.vue";
import Login from "@/views/Login.vue";
import User from "@/views/User.vue";

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
      {
        path: "/detail",
        name: "LinkDetail",
        component: LinkDetail,
      },
      {
        path: "/user",
        name: "User",
        component: User,
      },
    ],
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
  // 否则继续导航
  next();
});

export default router;
