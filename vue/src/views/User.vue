<template>
  <div>
    <el-form
      :model="userInfo"
      ref="userInfoFormRef"
      label-width="80px"
      class="create-form"
    >
      <h2 class="form-title">用户信息</h2>

      <el-form-item label="邮箱">
        <el-input v-model="userInfo.email" disabled></el-input>
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
        <el-input v-model="userInfo.oldPassword" type="password"></el-input>
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
        <el-button @click="showLogoutConfirm">注销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import defaultAvatar from "@/assets/logo.png"; // 引入默认头像，需确保路径正确

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
      this.$http
        .get("/user/information")
        .then((response) => {
          // 更新用户信息
          this.userInfo = response.data;
        })
        .catch((error) => {
          // 处理获取用户信息失败逻辑，使用默认信息
          console.log(error);
          // 这里可以根据需要设置默认信息，目前使用空字符串作为默认值
          this.userInfo = {
            email: "",
            nickname: "",
            avatar: "",
            profile: "",
            oldPassword: "",
            newPassword: "",
          };
        });
    },
    saveNickname() {
      this.$http
        .put("/user/name", {
          email: this.userInfo.email,
          nickname: this.userInfo.nickname,
        })
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
      this.$http
        .put("/user/profile", {
          email: this.userInfo.email,
          profile: this.userInfo.profile,
        })
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
      this.$http
        .put("/user/change/password", {
          email: this.userInfo.email,
          oldPassword: this.userInfo.oldPassword,
          newPassword: this.userInfo.newPassword,
        })
        .then((response) => {
          // 处理修改密码成功逻辑
          this.isChangingPassword = false;
          console.log("密码修改成功");
          this.$message.success("密码修改成功");
        })
        .catch((error) => {
          // 处理修改密码失败逻辑
          console.log(error);
          this.$message.error("密码修改失败");
        });
    },
    toggleChangePassword() {
      this.isChangingPassword = !this.isChangingPassword;
    },
    // 触发文件上传选择框
    triggerAvatarUpload() {
      document.getElementById("avatarInput").click();
    },
    // 处理头像上传
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("email", this.userInfo.email);
        this.$http
          .post("/user/uploadAvatar", formData)
          .then((response) => {
            // 更新用户头像信息
            this.userInfo.avatar = response.data.avatarUrl;
            console.log("头像上传成功");
            this.$message.success("头像上传成功");
          })
          .catch((error) => {
            console.log(error);
            this.$message.error("头像上传失败");
          });
      }
    },
    // 显示注销确认弹窗
    showLogoutConfirm() {
      MessageBox.confirm("确定要注销账号吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/user/logout")
            .then((response) => {
              // 处理注销成功逻辑，跳转到登录页面
              this.$router.push("/login");
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
</style>
