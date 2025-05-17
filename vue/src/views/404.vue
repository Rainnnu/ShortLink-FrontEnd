<template>
  <div class="page-container">
    <div class="background"></div>

    <el-row type="flex" justify="center" align="middle" class="container">
      <el-col :span="24" class="text-center">
        <h1>404</h1>
        <p class="description">麻雀短链提醒您</p>
        <p class="description">抱歉，当前链接无法访问，或许已被限制 🐾</p>
        <p class="description">可能是你迷路了，也可能是页面被移除了～</p>

        <el-button type="primary" class="custom-button" @click="goHome">
          返回首页
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.page-container {
  margin: 0;
  padding: 0;
  background: linear-gradient(#a0cfe6, #f0f8ff);
  height: 100vh;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../assets/404.jpg") no-repeat center center;
  background-size: cover;
  z-index: 0;
  animation: floatBackground 60s linear infinite;
}

.container {
  position: relative;
  z-index: 1;
  animation: fadeIn 2s ease-out forwards;
}

h1 {
  font-size: 5em;
  margin: 0;
  color: #ff6b6b;
  animation: bounce 2s infinite alternate;
}

.description {
  font-size: 1.5em;
  margin: 10px 0;
  color: #000;
}

.custom-button {
  margin-top: 30px;
  padding: 10px 30px;
  font-size: 1.2em;
  border-radius: 30px;
  transition: background 0.3s ease;
}

/* 动画定义 */
@keyframes floatBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  to {
    transform: translateY(-10px);
  }
}
</style>
