<template>
  <div class="login-container">
    <!-- 登录表单，通过 isLoginFormVisible 控制显示隐藏 -->
    <div v-if="isLoginFormVisible">
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        label-width="80px"
        :rules="loginFormRules"
      >
        <h2 class="title">登录</h2>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="isPasswordLogin" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          v-if="!isPasswordLogin"
          prop="verificationCode"
        >
          <el-input v-model="loginForm.verificationCode"></el-input>
          <el-button @click="sendCode" :disabled="isSendingCode">
            {{ isSendingCode ? `重新发送(${countdown}s)` : "发送验证码" }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <span class="hint-text"
            >（用户初次使用该方式视为注册，密码需要到个人信息页面设置）</span
          >
          <el-button type="primary" @click="submitLogin">登录</el-button>
          <el-button @click="toggleLoginType">
            切换到 {{ isPasswordLogin ? "验证码登录" : "密码登录" }}
          </el-button>
          <el-button @click="showForgotPassword">忘记密码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 忘记密码表单，通过 isForgotPasswordFormVisible 控制显示隐藏 -->
    <div v-if="isForgotPasswordFormVisible">
      <el-form
        :model="forgotPasswordForm"
        ref="forgotPasswordFormRef"
        label-width="80px"
        :rules="forgotPasswordFormRules"
      >
        <h2 class="title">重置密码</h2>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="forgotPasswordForm.email"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!isNewPasswordInputVisible"
          label="验证码"
          prop="verificationCode"
        >
          <el-input v-model="forgotPasswordForm.verificationCode"></el-input>
          <el-button @click="sendVerifyCode" :disabled="isSendingVerifyCode">
            {{
              isSendingVerifyCode
                ? `重新发送(${countdownVerify}s)`
                : "发送验证码"
            }}
          </el-button>
          <el-button @click="submitVerifyCode">提交验证码</el-button>
        </el-form-item>
        <el-form-item
          v-if="isNewPasswordInputVisible"
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="forgotPasswordForm.newPassword"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitResetPassword"
            >重置密码</el-button
          >
          <el-button @click="showLoginForm">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  data() {
    return {
      isPasswordLogin: true,
      isLoginFormVisible: true,
      isNewPasswordInputVisible: false,
      isForgotPasswordFormVisible: false,
      loginForm: {
        email: "",
        password: "",
        verificationCode: "",
      },
      forgotPasswordForm: {
        email: "",
        verificationCode: "",
        newPassword: "",
      },
      loginFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "验证码长度必须为6", trigger: "blur" },
        ],
      },
      forgotPasswordFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "验证码长度必须为6", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
      },
      isSendingCode: false, // 登录验证码发送状态
      isSendingVerifyCode: false, // 忘记密码的验证码发送状态
      countdown: 60,
      countdownVerify: 60,
      sentCodeTime: null, // 登录验证码发送时间
      verifyCodeTime: null, // 忘记密码的验证码发送时间
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          if (!this.isPasswordLogin) {
            const currentTime = Date.now();
            if (
              this.sentCodeTime &&
              currentTime - this.sentCodeTime > 60 * 1000
            ) {
              this.$message.error("验证码已过期，请重新获取");
              return;
            }
          }
          this.login();
        } else {
          console.log("表单校验不通过");
          return false;
        }
      });
    },

    submitResetPassword() {
      this.$refs.forgotPasswordFormRef.validate((valid) => {
        if (valid) {
          const currentTime = Date.now();
          if (
            this.verifyCodeTime &&
            currentTime - this.verifyCodeTime > 60 * 1000
          ) {
            this.$message.error("验证码已过期，请重新获取");
            return;
          }
          this.resetPassword();
        } else {
          console.log("表单校验不通过");
          return false;
        }
      });
    },

    login() {
      if (this.isPasswordLogin) {
        // 密码登录
        request
          .post("/users/loginByPassword", {
            email: this.loginForm.email,
            password: this.loginForm.password,
          })
          .then((response) => {
            const { refreshToken, accessToken } = response.data;
            //删去临时token
            localStorage.removeItem("templeAccessToken");
            // 存储 refreshToken 到 localStorage
            localStorage.setItem("refreshToken", refreshToken);
            // 存储 accessToken 到 localStorage
            localStorage.setItem("accessToken", accessToken);
            // 存储用户信息到 localStorage
            localStorage.setItem("userEmail", this.loginForm.email);
            this.$message.success("登录成功");
            // 页面跳转
            this.$router.push("/create");
          })
          .catch((error) => {
            // 处理登录失败逻辑
            console.log(error);
            this.$message.error("登录失败!");
          });
      } else {
        // 验证码登录
        request
          .post("/users/loginByEmail", {
            email: this.loginForm.email,
            verificationCode: this.loginForm.verificationCode,
          })
          .then((response) => {
            const { refreshToken, accessToken } = response.data;
            // 存储 refreshToken 到 localStorage
            localStorage.setItem("refreshToken", refreshToken);
            // 存储 accessToken 到 localStorage
            localStorage.setItem("accessToken", accessToken);
            // 存储用户信息到 localStorage
            localStorage.setItem("userEmail", this.loginForm.email);
            this.$message.success("登录成功");
            // 页面跳转
            this.$router.push("/create");
          })
          .catch((error) => {
            // 处理登录失败逻辑
            console.log(error);
            this.$message.error("登录失败，请检查邮箱和验证码");
          });
      }
    },

    toggleLoginType() {
      this.isPasswordLogin = !this.isPasswordLogin;
      // 切换登录方式时重置验证码时间和状态
      this.sentCodeTime = null;
      this.isSendingCode = false;
      this.countdown = 60;
      this.loginForm.verificationCode = "";
    },

    // 登录验证码
    sendCode() {
      if (this.isSendingCode) return;
      this.isSendingCode = true;
      request
        .post(`/users/email?email=${this.loginForm.email}`)
        .then((response) => {
          // 处理发送验证码成功逻辑
          this.$message.success("验证码已发送");
          this.sentCodeTime = Date.now();
          let timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--;
            } else {
              clearInterval(timer);
              this.isSendingCode = false;
              this.countdown = 60;
            }
          }, 1000);
        })
        .catch((error) => {
          // 处理发送验证码失败逻辑
          this.$message.error("验证码发送失败，请稍后重试");
          this.isSendingCode = false;
          this.countdown = 60;
        });
    },

    showForgotPassword() {
      this.isLoginFormVisible = false;
      this.isForgotPasswordFormVisible = true;
    },

    //通过验证码登录
    sendVerifyCode() {
      if (this.isSendingVerifyCode) return;
      this.isSendingVerifyCode = true;
      request
        .post(`/users/email?email=${this.forgotPasswordForm.email}`)
        .then((response) => {
          // 处理发送验证邮件成功逻辑
          if (response.code == 200) {
            this.$message.success("验证码已发送");
            this.verifyCodeTime = Date.now();
            let timer = setInterval(() => {
              if (this.countdownVerify > 0) {
                this.countdownVerify--;
              } else {
                clearInterval(timer);
                this.isSendingVerifyCode = false;
                this.countdownVerify = 60;
              }
            }, 1000);
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch((error) => {
          // 处理发送验证邮件失败逻辑
          this.$message.error("验证邮件发送失败，请稍后重试");
          this.isSendingVerifyCode = false;
          this.countdownVerify = 60;
        });
    },

    submitVerifyCode() {
      if (this.forgotPasswordForm.verificationCode.length !== 6) {
        this.$message.error("请输入6位验证码！");
        return;
      }
      request
        .put("/users/verify", {
          email: this.forgotPasswordForm.email,
          verificationCode: this.forgotPasswordForm.verificationCode,
        })
        .then((response) => {
          // 处理重置密码成功逻辑
          if (response.code === 200) {
            this.isNewPasswordInputVisible = true;
            //存储临时token
            localStorage.setItem(
              "templeAccessToken",
              response.data.accessToken
            );
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch((error) => {
          // 处理重置密码失败逻辑
          console.log(error);
        });
    },
    resetPassword() {
      request
        .put("/users/resetPassword", {
          password: this.forgotPasswordForm.newPassword,
        })
        .then((response) => {
          // 处理重置密码成功逻辑
          if (response.code === 200) {
            this.isForgotPasswordFormVisible = false;
            this.isLoginFormVisible = true;
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch((error) => {
          // 处理重置密码失败逻辑
          console.log(error);
        });
    },

    showLoginForm() {
      this.isLoginFormVisible = true;
      this.isForgotPasswordFormVisible = false;
    },
  },
};
</script>

<style scoped>
h2 {
  padding: 0;
  text-align: center;
  color: #333;
}

.login-container {
  min-height: 100vh;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container > div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-form {
  width: 50%;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.el-input {
  width: calc(100% - 18px);
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.el-button {
  margin: 5px;
  padding: 8px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.el-button--primary {
  background-color: #42b983;
  color: white;
}

.el-button--primary:hover {
  background-color: #37a373;
}

.el-button--default {
  background-color: #f4f4f4;
  color: #333;
}

.el-button--default:hover {
  background-color: #e9e9e9;
}

.hint-text {
  display: block;
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
}

.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 3px;
}
</style>
