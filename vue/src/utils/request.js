import axios from "axios";
import router from "@/router"; // 引入路由实例

const request = axios.create({
  baseURL: "http://8.138.124.114:9766/sparrow/api",
  timeout: 60000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }

    const accessToken = localStorage.getItem("accessToken");
    const accessToken2 = localStorage.getItem("templeAccessToken");

    // 不需要token的接口
    if (
      config.url.includes("/users/loginByPassword") ||
      config.url.includes("/users/loginByEmail") ||
      config.url.includes("/users/email") ||
      config.url.includes("/users/verify")
    ) {
      return config;
    }

    // 忘记密码需要临时token
    if (config.url.includes("/users/resetPassword") && accessToken2) {
      config.headers["accessToken"] = `${accessToken2}`;
      return config;
    }

    if (accessToken) {
      config.headers["accessToken"] = `${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
let isRefreshing = false;
let requests = [];

request.interceptors.response.use(
  (response) => {
    let res = response.data;
    if (typeof res === "string") {
      res = res ? JSON.parse(res) : res;
    }
    return res;
  },
  async (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("请求超时");
      return Promise.reject(new Error("请求超时，请重试"));
    }

    if (error.message === "Network Error") {
      console.error("网络错误，请检查连接");
      return Promise.reject(new Error("网络连接失败"));
    }
    const { config, response } = error;

    // 处理401 token过期
    if (response && response.data && response.data.code === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const refreshResponse = await axios.post(
              `${request.defaults.baseURL}/user/refresh`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } =
              refreshResponse.data;
            localStorage.setItem("accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // 重试所有挂起的请求
            requests.forEach((cb) => cb(accessToken));
            requests = [];
            return request(config);
          }
        } catch (refreshError) {
          // 刷新token失败，跳转登录
          handleLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 将请求加入队列等待token刷新
        return new Promise((resolve) => {
          requests.push((accessToken) => {
            config.headers["accessToken"] = `${accessToken}`;
            resolve(request(config));
          });
        });
      }
    }

    // 处理40005 用户未登录
    if (response && response.data && response.data.code === 40005) {
      handleLogout();
      return Promise.reject(error);
    }

    console.log("请求错误:", error);
    return Promise.reject(error);
  }
);

// 处理退出登录逻辑
function handleLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("templeAccessToken");

  // 跳转到登录页，并携带当前路由信息
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
}

export default request;
