import axios from "axios";

// 创建一个axios对象出来
const request = axios.create({
  baseURL: "http://8.138.124.114:9766/sparrow/api",
  timeout: 60000,
});

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(
  (config) => {
    // 只有未设置 Content-Type 的请求才设置默认值
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }
    // 从本地存储中获取 accessToken
    const accessToken = localStorage.getItem("accessToken");
    const accessToken2 = localStorage.getItem("templeAccessToken"); //临时token

    if (
      config.url.includes("/users/loginByPassword") ||
      config.url.includes("/users/loginByEmail") ||
      config.url.includes("/users/email") ||
      config.url.includes("/users/verify")
    ) {
      // 无需设置token请求头
      return config;
    }

    if (config.url.includes("/users/resetPassword") && accessToken2) {
      //忘记密码需要一个临时token
      config.headers["accessToken"] = `${accessToken2}`; //后端要求为accessToken
      return config;
    }

    if (accessToken) config.headers["accessToken"] = `${accessToken}`; //后端要求为accessToken

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 拦截器
// 可以在接口响应后统一处理结果
let isRefreshing = false;
let requests = [];

request.interceptors.response.use(
  (response) => {
    // response.data即为后端返回的Result
    let res = response.data;
    // 兼容服务端返回的字符串数据
    if (typeof res === "string") {
      res = res ? JSON.parse(res) : res;
    }
    return res;
  },
  async (error) => {
    const { config, response } = error;
    if (response && response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 从本地存储中获取 refreshToken
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            // 发送刷新 token 的请求
            const refreshResponse = await axios.post(
              `${request.defaults.baseURL}/user/refresh`,
              {
                refreshToken,
              }
            );
            const { accessToken, refreshToken: newRefreshToken } =
              refreshResponse.data;
            // 更新本地存储的 token
            localStorage.setItem("accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
            // 重新发起之前失败的请求
            requests.forEach((cb) => cb(accessToken));
            requests = [];
            return request(config);
          }
        } catch (refreshError) {
          // 刷新 token 失败，清除本地存储的 token 并跳转到登录页
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // 这里需要根据你的项目实际情况进行跳转登录页的操作
          // 例如在 Vue 项目中可以使用 this.$router.push('/login')
          console.log("刷新 token 失败，跳转到登录页");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 正在刷新 token，将请求挂起
        return new Promise((resolve) => {
          requests.push((accessToken) => {
            config.headers["Authorization"] = `${accessToken}`;
            resolve(request(config));
          });
        });
      }
    }
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default request;
