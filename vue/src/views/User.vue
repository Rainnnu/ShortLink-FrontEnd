<template>
  <div>
    <el-form
      :model="userInfo"
      ref="userInfoFormRef"
      label-width="80px"
      class="create-form"
    >
      <h2 class="form-title">用户信息</h2>
      <!-- 邮箱信息，从接口获取并展示，不使用input框 -->
      <el-form-item label="邮箱">
        <span class="email-display">{{ userInfo.email }}</span>
      </el-form-item>
      <el-form-item label="头像">
        <div class="avatar-container">
          <!-- 展示头像 -->
          <img
            :src="userInfo.avatar || defaultAvatar"
            alt="Avatar"
            class="avatar"
          />
          <!-- 隐藏的文件上传 input -->
          <input
            type="file"
            accept="image/*"
            @change="handleAvatarUpload"
            style="display: none"
            id="avatarInput"
          />
          <el-button @click="triggerAvatarUpload">上传头像</el-button>
        </div>
      </el-form-item>
      <el-form-item label="昵称">
        <div class="input-button-group">
          <el-input v-model="userInfo.nickname"></el-input>
          <el-button @click="saveNickname">保存昵称</el-button>
        </div>
      </el-form-item>

      <el-form-item label="个人简介">
        <div class="input-button-group">
          <el-input v-model="userInfo.profile" type="textarea"></el-input>
          <el-button @click="saveProfile">保存简介</el-button>
        </div>
      </el-form-item>
      <el-form-item label="旧密码" v-if="isChangingPassword">
        <el-input
          v-model="userInfo.oldPassword"
          type="password"
          placeholder="初始密码为邮箱账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" v-if="isChangingPassword">
        <el-input v-model="userInfo.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="savePassword"
          v-if="isChangingPassword"
          >保存密码</el-button
        >
        <el-button @click="toggleChangePassword">
          {{ isChangingPassword ? "取消修改密码" : "修改密码" }}
        </el-button>
        <el-button @click="showLogoutConfirm">退出登录</el-button>
        <el-button @click="showZhuxiaoConfirm">注销账号</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import defaultAvatar from "@/assets/logo.png"; // 引入默认头像，需确保路径正确
import request from "../utils/request";

export default {
  data() {
    return {
      isChangingPassword: false,
      userInfo: {
        email: "",
        nickname: "",
        avatar: "",
        profile: "",
        oldPassword: "",
        newPassword: "",
      },
      defaultAvatar, // 存储默认头像路径
    };
  },
  created() {
    this.fetchUserInformation();
  },
  methods: {
    fetchUserInformation() {
      // 从本地存储获取参数
      const email = localStorage.getItem("userEmail");
      if (!email) {
        this.$message.error("未找到用户邮箱信息，请重新登录！");
        // 注销成功，清除token和用户信息
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        // 跳转到登录页面
        this.$router.push("/login");
        return;
      }

      request
        .get(`/users/information`)
        .then((response) => {
          if (response.code === 200) {
            const { name, avatar, profile, email } = response.data;
            this.userInfo = {
              ...this.userInfo,
              nickname: name,
              avatar,
              profile,
              email,
            };
          } else {
            console.error(response.msg);
          }
        })
        .catch((error) => {
          console.error("获取用户信息失败", error);
          this.$message.error("获取用户信息失败");
        });
    },
    saveNickname() {
      request
        .put(`/users/name?name=${this.userInfo.nickname}`)
        .then((response) => {
          // 处理修改昵称成功逻辑
          console.log("昵称修改成功");
          this.$message.success("昵称修改成功");
        })
        .catch((error) => {
          // 处理修改昵称失败逻辑
          console.log(error);
          this.$message.error("昵称修改失败");
        });
    },
    saveProfile() {
      request
        .put(`/users/profile?profile=${this.userInfo.profile}`)
        .then((response) => {
          // 处理修改个人简介成功逻辑
          console.log("个人简介修改成功");
          this.$message.success("个人简介修改成功");
        })
        .catch((error) => {
          // 处理修改个人简介失败逻辑
          console.log(error);
          this.$message.error("个人简介修改失败");
        });
    },
    savePassword() {
      request
        .put("/users/change/password", {
          prePassword: String(this.userInfo.oldPassword),
          newPassword: String(this.userInfo.newPassword),
        })
        .then((response) => {
          // 处理修改密码成功逻辑
          if (response.code === 200) {
            this.isChangingPassword = false;
            this.$message.success("密码修改成功");
          } else {
            this.userInfo.newPassword = "";
            this.userInfo.oldPassword = "";
            this.$message.error(response.msg);
          }
        })
        .catch((error) => {
          // 处理修改密码失败逻辑
          console.log(error);
          this.$message.error("密码修改失败");
        });
    },
    toggleChangePassword() {
      this.userInfo.newPassword = "";
      this.userInfo.oldPassword = "";
      this.isChangingPassword = !this.isChangingPassword;
    },
    // 触发文件上传选择框
    triggerAvatarUpload() {
      document.getElementById("avatarInput").click();
    },
    // 处理头像上传
    // 处理头像上传
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("multipartFile", file);

        // 添加调试信息
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        request
          .put("/users/avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // 显式设置 Content-Type
            },
          })
          .then((response) => {
            if (response.code === 200) {
              this.userInfo.avatar =
                response.data?.url || response.data || this.userInfo.avatar;
              this.$message.success("头像上传成功");
            } else {
              a;
              throw new Error(response.msg || "头像上传失败");
            }
          })
          .catch((error) => {
            console.error("头像上传错误:", error);
            this.$message.error(error.msg || "头像上传失败");
            this.fetchUserInformation();
          });
      }
    },
    // 显示注销确认弹窗
    showZhuxiaoConfirm() {
      MessageBox.confirm("确定要注销账号吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request
            .post("/users/logout")
            .then((response) => {
              if (response.code === 200) {
                // 注销成功，清除token和用户信息
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userEmail");
                // 跳转到登录页面
                this.$router.push("/login");
              } else {
                this.$message.error(response.msg);
              }
            })
            .catch((error) => {
              // 处理注销失败逻辑
              console.log(error);
              this.$message.error("注销失败");
            });
        })
        .catch(() => {
          // 用户取消操作
        });
    },

    showLogoutConfirm() {
      MessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //清除token和用户信息
          //仅为前端简易实现的退出登录
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userEmail");
          // 跳转到登录页面
          this.$router.push("/login");
        })
        .catch(() => {
          // 用户取消操作
        });
    },
  },
};
</script>

<style scoped>
.avatar-container {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  border: 1px solid #409eff;
}

.create-form {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #409eff;
  margin-bottom: 30px;
}

.input-button-group {
  display: flex;
  gap: 5px;
  align-items: center;
}

.input-button-group.el-input {
  flex: 1;
  margin-right: 10px;
}

.email-display {
  display: inline-block;
  text-align: left;
  width: 100%;
}
</style>
