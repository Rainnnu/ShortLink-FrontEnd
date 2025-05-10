<template>
  <el-form
      ref="shortLinkForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="create-form"
      @submit.native.prevent="handleSubmit"
  >
    <h2 class="form-title">创建短链</h2>

    <!-- 标题 -->
    <el-form-item label="标题：" prop="title" class="custom-form-item">
      <el-input
          v-model="form.title"
          placeholder="请输入链接标题"
          clearable
          autocomplete="off"
      >
        <template #prepend>
          <i class="el-icon-edit-outline"></i>
        </template>
      </el-input>
    </el-form-item>

    <!-- 原始URL -->
    <el-form-item label="原始URL：" prop="originalUrl" class="custom-form-item">
      <el-input
          v-model="form.originalUrl"
          type="url"
          placeholder="https://example.com/very-long-url"
          clearable
          autocomplete="off"
      >
        <template #prepend>
          <i class="el-icon-link"></i>
        </template>
      </el-input>
    </el-form-item>

    <!-- 自定义后缀 -->
    <el-form-item label="自定义后缀：" prop="customSuffix" class="custom-form-item">
      <el-input
          v-model="form.customSuffix"
          placeholder="my-custom-link (可选)"
          clearable
          autocomplete="off"
      >
        <template #prepend>
          <i class="el-icon-edit"></i>
        </template>
        <template #append> .yourdomain.com </template>
      </el-input>
      <div class="tip-text">（仅支持字母、数字和下划线，最长20字符）</div>
    </el-form-item>

    <!-- 标签选择 -->
    <el-form-item label="选择标签：" prop="tags" class="custom-form-item">
      <el-select
          v-model="form.tags"
          multiple
          filterable
          placeholder="请选择标签"
          style="width: 100%"
      >
        <el-option
            v-for="tag in tagOptions"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
        >
          <span class="tag-option">
            <div class="color-block" :style="{backgroundColor: tag.color}"></div>
            {{ tag.name }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 访问控制 -->
    <el-form-item label="访问设置：" class="custom-form-item">
      <div class="access-settings">
        <el-switch
            v-model="form.privateTarget"
            active-text="私密链接"
            style="margin-right: 20px"
        />
        <el-input-number
            v-model="form.allowNum"
            :min="0"
            :max="999999"
            label="允许访问次数"
            placeholder="不限次数"
            style="width: 180px"
        />
      </div>
    </el-form-item>

    <!-- 密码设置 -->
    <el-form-item
        v-if="form.privateTarget"
        label="访问密码："
        prop="password"
        class="custom-form-item"
    >
      <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入4-12位密码"
          show-password
      />
    </el-form-item>

    <!-- 过期时间 -->
    <el-form-item label="过期时间：" prop="expireTime" class="custom-form-item">
      <el-date-picker
          v-model="form.expireTime"
          type="datetime"
          placeholder="选择过期时间"
          value-format="timestamp"
          :default-time="new Date().getTime() + 7 * 24 * 60 * 60 * 1000"
      />
    </el-form-item>

    <!-- 提交按钮 -->
    <el-form-item class="submit-item">
      <el-button
          type="primary"
          native-type="submit"
          :loading="submitting"
          @click="handleSubmit"
      >
        <i class="el-icon-magic-stick"></i>
        生成短链
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios';

export default {
  name: "CreateShortLink",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (this.form.privateTarget && !value) {
        callback(new Error("私密链接必须设置密码"));
      } else if (this.form.privateTarget && (value.length < 4 || value.length > 12)) {
        callback(new Error("密码长度4-12位"));
      } else {
        callback();
      }
    };

    return {
      form: {
        title: "",
        originalUrl: "",
        customSuffix: "",
        tags: [],
        privateTarget: false,
        password: "",
        expireTime: null,
        allowNum: 0
      },
      tagOptions: [],
      submitting: false,
      rules: {
        title: [
          { required: true, message: "请输入链接标题", trigger: "blur" },
          { max: 30, message: "标题最长30个字符", trigger: "blur" }
        ],
        originalUrl: [
          { required: true, message: "请输入原始URL", trigger: "blur" },
          { type: "url", message: "请输入有效的URL地址", trigger: ["blur", "change"] }
        ],
        customSuffix: [
          { pattern: /^[a-zA-Z0-9_]{0,20}$/, message: "仅支持字母、数字和下划线", trigger: "blur" }
        ],
        password: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  created() {
    this.fetchTags();
  },
  methods: {
    async fetchTags() {
      try {
        const res = await axios.get('/tag/get', {
          params: { userId: "当前用户ID" },
          headers: { accessToken: "你的accessToken" }
        });
        this.tagOptions = res.data.data || [];
      } catch (error) {
        this.$message.error("获取标签失败");
      }
    },

    async handleSubmit() {
      this.$refs.shortLinkForm.validate(async valid => {
        if (valid) {
          this.submitting = true;
          try {
            const params = {
              title: this.form.title,
              longUrl: this.form.originalUrl,
              customSuffix: this.form.customSuffix,
              tags: this.form.tags,
              privateTarget: this.form.privateTarget,
              password: this.form.privateTarget ? this.form.password : undefined,
              expireTime: this.form.expireTime,
              allowNum: this.form.allowNum || 0
            };

            const res = await axios.post('/creat/shortLink', params, {
              headers: { accessToken: localStorage.getItem("accessToken") }
            });

            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.$refs.shortLinkForm.resetFields();
              this.form.allowNum = 0;
              this.form.expireTime = null;
            } else {
              this.$message.error(res.data.msg || "创建失败");
            }
          } catch (error) {
            this.$message.error("请求失败，请检查网络");
          } finally {
            this.submitting = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.color-block {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 8px;
  vertical-align: middle;
}

.tag-option {
  display: flex;
  align-items: center;
}

.access-settings {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 保持原有样式不变 */
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

.custom-form-item {
  margin-bottom: 24px;
}

.tip-text {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}

.submit-item {
  text-align: center;
  margin-top: 40px;
}

.el-input-group__prepend .el-icon-link,
.el-input-group__prepend .el-icon-edit {
  color: #409eff;
}

@media (max-width: 768px) {
  .create-form {
    padding: 20px;
    margin: 10px;
  }

  .el-form-item__label {
    line-height: 1.5;
    text-align: left !important;
  }
}
</style>