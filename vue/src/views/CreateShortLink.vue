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

    <!-- 原始URL输入 -->
    <el-form-item
        label="原始URL："
        prop="originalUrl"
        class="custom-form-item"
    >
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

    <!-- 自定义后缀输入 -->
    <el-form-item
        label="自定义后缀："
        prop="customSuffix"
        class="custom-form-item"
    >
      <el-input
          v-model="form.customSuffix"
          placeholder="my-custom-link (可选)"
          clearable
          autocomplete="off"
      >
        <template #prepend>
          <i class="el-icon-edit"></i>
        </template>
        <template #append>
          .yourdomain.com
        </template>
      </el-input>
      <div class="tip-text">（仅支持字母、数字和下划线，最长20字符）</div>
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
export default {
  name: 'CreateShortLink',
  data() {
    // 自定义后缀验证规则
    const validateSuffix = (rule, value, callback) => {
      if (value && !/^[a-zA-Z0-9_]{1,20}$/.test(value)) {
        callback(new Error('仅支持字母、数字和下划线，最长20字符'));
      } else {
        callback();
      }
    };

    return {
      form: {
        originalUrl: '',
        customSuffix: ''
      },
      submitting: false,
      rules: {
        originalUrl: [
          { required: true, message: '请输入原始URL', trigger: 'blur' },
          {
            type: 'url',
            message: '请输入有效的URL地址（需包含http/https）',
            trigger: ['blur', 'change']
          }
        ],
        customSuffix: [
          { validator: validateSuffix, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.shortLinkForm.validate(valid => {
        if (valid) {
          this.submitting = true;

          // 模拟API调用
          setTimeout(() => {
            console.log('提交表单:', this.form);
            this.$message.success('短链创建成功！');

            // 清空表单
            this.$refs.shortLinkForm.resetFields();
            this.submitting = false;
          }, 1000);
        } else {
          this.$message.warning('请正确填写表单内容');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.create-form {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.form-title {
  text-align: center;
  color: #409EFF;
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

/* 调整输入框前缀图标颜色 */
.el-input-group__prepend .el-icon-link,
.el-input-group__prepend .el-icon-edit {
  color: #409EFF;
}

/* 响应式布局 */
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