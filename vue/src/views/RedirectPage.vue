<template>
  <div class="redirect-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="status-box">
      <i class="el-icon-loading"></i>
      <p>正在验证链接...</p>
    </div>

    <!-- 密码输入表单 -->
    <div v-else-if="needPassword" class="password-form">
      <h2>该链接需要访问密码</h2>
      <el-form @submit.native.prevent="handleSubmit">
        <el-form-item label="访问密码">
          <el-input
            v-model="password"
            type="password"
            placeholder="请输入访问密码"
            show-password
            @keyup.enter="handleSubmit"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          验证密码
        </el-button>
      </el-form>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-box">
      <i class="el-icon-warning"></i>
      <p>{{ errorMessage }}</p>
      <el-button type="text" @click="retryCheck">重试</el-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { md5 } from "js-md5";

export default {
  name: "RedirectPage",
  data() {
    return {
      loading: true,
      needPassword: false,
      error: false,
      errorMessage: "",
      password: "",
      submitting: false,
      shortLink: "",
      originalUrl: "",
    };
  },
  created() {
    this.shortLink = this.$route.params.shortLink;
    this.checkLink();
  },
  methods: {
    // 检查短链状态
    async checkLink() {
      try {
        this.loading = true;
        this.error = false;

        const res = await request.get(`/sparrow/${this.shortLink}`);

        if (res.code === 200) {
          if (res.data.needPassword) {
            this.needPassword = true;
            this.originalUrl = res.data.originalUrl;
          } else {
            // 不需要密码直接跳转
            window.location.href = res.data.originalUrl;
          }
        } else if (res.code === 403) {
          this.needPassword = true;
          this.originalUrl = res.data?.originalUrl || "";
        } else {
          this.error = true;
          this.errorMessage = res.msg || "链接无效或已过期";
        }
      } catch (error) {
        this.error = true;
        this.errorMessage = "链接验证失败，请稍后重试";
        console.error("检查短链失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 提交密码验证
    async handleSubmit() {
      if (!this.password) {
        this.$message.warning("请输入访问密码");
        return;
      }

      this.submitting = true;
      try {
        const res = await request.post("/sparrow/verify", {
          shortLink: this.shortLink,
          password: md5(this.password),
        });

        if (res.code === 200) {
          // 验证成功，跳转到原始URL
          window.location.href = this.originalUrl;
        } else {
          this.$message.error(res.msg || "密码错误");
        }
      } catch (error) {
        this.$message.error("验证失败，请稍后重试");
        console.error("密码验证失败:", error);
      } finally {
        this.submitting = false;
      }
    },

    // 重试检查
    retryCheck() {
      this.loading = true;
      this.error = false;
      this.checkLink();
    },
  },
};
</script>

<style scoped>
.redirect-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 20px;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
}

.el-icon-loading {
  font-size: 50px;
  color: #409eff;
  animation: rotating 2s linear infinite;
}

.password-form {
  padding: 30px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.error-box {
  padding: 30px;
}

.el-icon-warning {
  font-size: 50px;
  color: #f56c6c;
  margin-bottom: 20px;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
