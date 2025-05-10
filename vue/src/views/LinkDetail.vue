<!--<template>-->
<!--  <el-card class="detail-container">-->
<!--    <div class="header">-->
<!--      <el-page-header-->
<!--          title="返回列表"-->
<!--          @back="$router.go(-1)"-->
<!--          content="短链详情"-->
<!--      />-->
<!--      <el-tag v-if="currentLink" type="info">ID: {{ currentLink.id }}</el-tag>-->
<!--    </div>-->

<!--    <el-form-->
<!--        v-if="currentLink"-->
<!--        ref="detailForm"-->
<!--        :model="currentLink"-->
<!--        :rules="rules"-->
<!--        label-width="120px"-->
<!--        label-position="top"-->
<!--    >-->
<!--      &lt;!&ndash; 访问控制 &ndash;&gt;-->
<!--      <el-form-item label="访问次数限制：" prop="accessLimit">-->
<!--        <el-input-number-->
<!--            v-model="currentLink.accessLimit"-->
<!--            :min="0"-->
<!--            :max="10000"-->
<!--            controls-position="right"-->
<!--            placeholder="0表示无限制"-->
<!--        />-->
<!--        <span class="tip-text">（0表示不限制访问次数）</span>-->
<!--      </el-form-item>-->

<!--      &lt;!&ndash; 失效时间 &ndash;&gt;-->
<!--      <el-form-item label="失效时间：" prop="expireTime">-->
<!--        <el-date-picker-->
<!--            v-model="currentLink.expireTime"-->
<!--            type="datetime"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            :default-time="['23:59:59']"-->
<!--            :disabled-date="disabledDate"-->
<!--            placeholder="选择失效时间"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      &lt;!&ndash; 私密性控制 &ndash;&gt;-->
<!--      <el-form-item label="私密性设置：">-->
<!--        <el-switch-->
<!--            v-model="currentLink.isPrivate"-->
<!--            active-text="启用密码保护"-->
<!--            inactive-text="公开链接"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      &lt;!&ndash; 密码设置 &ndash;&gt;-->
<!--      <template v-if="currentLink.isPrivate">-->
<!--        <el-form-item-->
<!--            label="访问密码："-->
<!--            prop="password"-->
<!--            key="password"-->
<!--        >-->
<!--          <el-input-->
<!--              v-model="currentLink.password"-->
<!--              type="password"-->
<!--              show-password-->
<!--              placeholder="请输入4-16位密码"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item-->
<!--            label="确认密码："-->
<!--            prop="confirmPassword"-->
<!--            key="confirmPassword"-->
<!--        >-->
<!--          <el-input-->
<!--              v-model="currentLink.confirmPassword"-->
<!--              type="password"-->
<!--              show-password-->
<!--              placeholder="请再次输入密码"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </template>-->

<!--      &lt;!&ndash; 操作按钮 &ndash;&gt;-->
<!--      <el-form-item class="action-buttons">-->
<!--        <el-button-->
<!--            type="primary"-->
<!--            :loading="saving"-->
<!--            @click="saveSettings"-->
<!--        >保存设置</el-button>-->
<!--        <el-button @click="resetForm">恢复默认</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

<!--    &lt;!&ndash; 加载状态 &ndash;&gt;-->
<!--    <el-skeleton v-else :rows="6" animated />-->
<!--  </el-card>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'LinkDetail',-->
<!--  props: ['linkId'],-->
<!--  data() {-->
<!--    // 密码一致性验证-->
<!--    const validatePass = (rule, value, callback) => {-->
<!--      if (this.currentLink.isPrivate && !value) {-->
<!--        callback(new Error('请输入访问密码'));-->
<!--      } else if (this.currentLink.confirmPassword !== value) {-->
<!--        callback(new Error('两次输入密码不一致'));-->
<!--      } else {-->
<!--        callback();-->
<!--      }-->
<!--    };-->

<!--    return {-->
<!--      currentLink: null,-->
<!--      saving: false,-->
<!--      rules: {-->
<!--        accessLimit: [-->
<!--          { type: 'number', min: 0, message: '不能小于0' }-->
<!--        ],-->
<!--        expireTime: [-->
<!--          {-->
<!--            validator: (rule, value, callback) => {-->
<!--              if (value && new Date(value) < new Date()) {-->
<!--                callback(new Error('失效时间不能早于当前时间'));-->
<!--              } else {-->
<!--                callback();-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--        ],-->
<!--        password: [-->
<!--          { required: true, validator: validatePass, trigger: 'blur' },-->
<!--          { min: 4, max: 16, message: '长度在4到16个字符' }-->
<!--        ]-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.fetchLinkDetail()-->
<!--  },-->
<!--  methods: {-->
<!--    // 禁用过去日期-->
<!--    disabledDate(time) {-->
<!--      return time.getTime() < Date.now() - 8.64e7 // 禁用昨天及以前-->
<!--    },-->

<!--    // 获取详情数据-->
<!--    async fetchLinkDetail() {-->
<!--      try {-->
<!--        // 模拟API调用-->
<!--        await new Promise(resolve => setTimeout(resolve, 800))-->
<!--        this.currentLink = {-->
<!--          id: this.linkId,-->
<!--          accessLimit: 100,-->
<!--          expireTime: '2024-04-01 23:59:59',-->
<!--          isPrivate: false,-->
<!--          password: '',-->
<!--          confirmPassword: ''-->
<!--        }-->
<!--      } catch (error) {-->
<!--        this.$message.error('获取详情失败')-->
<!--      }-->
<!--    },-->

<!--    // 保存设置-->
<!--    async saveSettings() {-->
<!--      try {-->
<!--        this.saving = true-->
<!--        await this.$refs.detailForm.validate()-->

<!--        // 模拟API提交-->
<!--        await new Promise(resolve => setTimeout(resolve, 1000))-->
<!--        this.$message.success('设置保存成功')-->
<!--        this.$router.push('/list')-->
<!--      } catch (error) {-->
<!--        this.$message.warning('请正确填写表单')-->
<!--      } finally {-->
<!--        this.saving = false-->
<!--      }-->
<!--    },-->

<!--    // 重置表单-->
<!--    resetForm() {-->
<!--      this.$refs.detailForm.resetFields()-->
<!--      this.fetchLinkDetail()-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.detail-container {-->
<!--  max-width: 800px;-->
<!--  margin: 20px auto;-->
<!--  padding: 30px;-->
<!--}-->

<!--.header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-bottom: 30px;-->
<!--}-->

<!--.action-buttons {-->
<!--  margin-top: 40px;-->
<!--  text-align: center;-->
<!--}-->

<!--.tip-text {-->
<!--  font-size: 12px;-->
<!--  color: #909399;-->
<!--  margin-left: 10px;-->
<!--}-->

<!--.el-form-item {-->
<!--  margin-bottom: 22px;-->
<!--}-->

<!--.el-date-editor,-->
<!--.el-input-number {-->
<!--  width: 100%;-->
<!--}-->
<!--</style>-->
<template>
  <el-card class="detail-container">
    <div class="header">
      <el-page-header
          title="返回列表"
          @back="$router.go(-1)"
          content="短链详情"
      />
      <el-tag v-if="currentLink" type="info">ID: {{ currentLink.id }}</el-tag>
    </div>

    <!-- 内容区域 -->
    <template v-if="currentLink">
      <el-form
          ref="detailForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
          label-position="top"
      >
        <!-- 访问次数限制 -->
        <el-form-item label="允许访问次数：" prop="allowNum">
          <el-input-number
              v-model="formData.allowNum"
              :min="0"
              :max="10000"
              controls-position="right"
              placeholder="0表示无限制"
          />
          <span class="tip-text">（0表示不限制访问次数）</span>
        </el-form-item>

        <!-- 过期时间 -->
        <el-form-item label="过期时间：" prop="expireTime">
          <el-date-picker
              v-model="formData.expireTime"
              type="datetime"
              value-format="timestamp"
              :disabled-date="disabledDate"
              placeholder="选择过期时间"
          />
        </el-form-item>

        <!-- 私密性设置 -->
        <el-form-item label="私密链接：">
          <el-switch
              v-model="formData.privateTarget"
              active-text="启用"
              inactive-text="关闭"
          />
        </el-form-item>

        <!-- 密码设置 -->
        <template v-if="formData.privateTarget">
          <el-form-item
              label="访问密码："
              prop="password"
              key="password"
          >
            <el-input
                v-model="formData.password"
                type="password"
                show-password
                placeholder="请输入4-16位密码"
            />
            <div class="action-buttons">
              <el-button
                  size="mini"
                  @click="handleChangePassword"
              >修改密码</el-button>
              <el-button
                  size="mini"
                  @click="showRetrieveDialog"
              >找回密码</el-button>
            </div>
          </el-form-item>
        </template>

        <!-- 操作按钮 -->
        <el-form-item class="action-buttons">
          <el-button
              type="primary"
              :loading="saving"
              @click="saveSettings"
          >保存设置</el-button>
          <el-button @click="resetForm">恢复默认</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <!-- 加载状态 -->
      <el-skeleton :rows="6" animated />
    </template>

    <!-- 找回密码对话框 -->
    <el-dialog
        title="找回密码"
        :visible.sync="retrieveDialogVisible"
        width="30%"
    >
      <el-form :model="retrieveForm" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input
              v-model="retrieveForm.email"
              placeholder="请输入注册邮箱"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="retrieveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRetrievePassword">提交</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LinkDetail',
  props: ['linkId'],
  data() {
    const validatePassword = (rule, value, callback) => {
      if (this.formData.privateTarget && !value) {
        callback(new Error('私密链接必须设置密码'));
      } else if (value && (value.length < 4 || value.length > 16)) {
        callback(new Error('密码长度4-16位'));
      } else {
        callback();
      }
    };

    return {
      currentLink: null,
      formData: {
        allowNum: 0,
        expireTime: null,
        privateTarget: false,
        password: ''
      },
      retrieveForm: {
        email: ''
      },
      retrieveDialogVisible: false,
      saving: false,
      rules: {
        allowNum: [
          { type: 'number', min: 0, message: '不能小于0' }
        ],
        expireTime: [
          {
            validator: (rule, value, callback) => {
              if (value && value < Date.now()) {
                callback(new Error('过期时间不能早于当前时间'));
              } else {
                callback();
              }
            }
          }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'formData.privateTarget'(newVal) {
      if (!newVal) this.$refs.detailForm.clearValidate('password');
    }
  },
  created() {
    this.fetchLinkDetail();
  },
  methods: {
    // 禁用过去日期
    disabledDate(time) {
      return time < Date.now() - 8.64e7;
    },

    // 获取详情
    async fetchLinkDetail() {
      try {
        const res = await axios.get(`/shortLink/list?id=${this.linkId}`, {
          headers: { accessToken: '你的accessToken' }
        });

        if (res.data.code === 0) {
          const data = res.data.data.list[0];
          this.currentLink = data;
          this.formData = {
            allowNum: data.allowNum,
            expireTime: data.expireTime,
            privateTarget: data.privateTarget,
            password: ''
          };
        }
      } catch (error) {
        this.$message.error('获取详情失败');
      }
    },

    // 保存设置
    async saveSettings() {
      try {
        await this.$refs.detailForm.validate();
        this.saving = true;

        // 构造请求参数
        const params = {
          id: this.linkId,
          ...this.formData
        };

        // 根据修改字段选择接口
        let apiPath = '/control/shortLink/';
        if (this.formData.expireTime) {
          apiPath += 'deadTime';
        } else if (this.formData.allowNum !== this.currentLink.allowNum) {
          apiPath += 'visitNum';
        } else if (this.formData.privateTarget || this.formData.password) {
          apiPath += 'private';
        }

        const res = await axios.put(apiPath, params, {
          headers: { accessToken: '你的accessToken' }
        });

        if (res.data.code === 0) {
          this.$message.success('设置保存成功');
          this.currentLink = res.data.data;
          this.resetForm();
        }
      } catch (error) {
        this.$message.error(error.response?.data?.msg || '保存失败');
      } finally {
        this.saving = false;
      }
    },

    // 修改密码
    async handleChangePassword() {
      try {
        const res = await axios.put('/control/shortLink/changePwd', {
          id: this.linkId,
          newPassword: this.formData.password
        }, {
          headers: { accessToken: '你的accessToken' }
        });

        if (res.data.data) {
          this.$message.success('密码修改成功');
        }
      } catch (error) {
        this.$message.error('密码修改失败');
      }
    },

    // 找回密码
    async handleRetrievePassword() {
      try {
        const res = await axios.post('/control/shortLink/retrievePassword', {
          id: this.linkId,
          email: this.retrieveForm.email
        }, {
          headers: { accessToken: '你的accessToken' }
        });

        if (res.data.data) {
          this.$message.success('密码已发送至邮箱');
          this.retrieveDialogVisible = false;
        }
      } catch (error) {
        this.$message.error('找回密码失败');
      }
    },

    showRetrieveDialog() {
      this.retrieveDialogVisible = true;
      this.retrieveForm.email = '';
    },

    resetForm() {
      this.formData = {
        allowNum: this.currentLink.allowNum,
        expireTime: this.currentLink.expireTime,
        privateTarget: this.currentLink.privateTarget,
        password: ''
      };
    }
  }
}
</script>

<style scoped>
/* 保持原有样式不变 */
.detail-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.action-buttons {
  margin-top: 40px;
  text-align: center;
}

.tip-text {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-date-editor,
.el-input-number {
  width: 100%;
}
</style>