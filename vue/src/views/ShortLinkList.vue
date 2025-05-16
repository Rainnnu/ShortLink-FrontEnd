<!--<template>-->
<!--  <div class="list-container">-->
<!--    &lt;!&ndash; 搜索和过滤区 &ndash;&gt;-->
<!--    <div class="filter-bar">-->
<!--      <el-input-->
<!--        v-model="queryParams.keyword"-->
<!--        placeholder="输入标题/长链/短链"-->
<!--        clearable-->
<!--        class="search-input"-->
<!--        @keyup.enter="fetchData"-->
<!--      >-->
<!--        <template #prefix>-->
<!--          <i class="el-icon-search"></i>-->
<!--        </template>-->
<!--      </el-input>-->

<!--      <el-select-->
<!--        v-model="queryParams.tags"-->
<!--        multiple-->
<!--        filterable-->
<!--        placeholder="选择标签"-->
<!--        style="width: 240px"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="tag in tagOptions"-->
<!--          :key="tag.id"-->
<!--          :label="tag.name"-->
<!--          :value="tag.id"-->
<!--        />-->
<!--      </el-select>-->

<!--      <el-select-->
<!--        v-model="queryParams.status"-->
<!--        placeholder="选择状态"-->
<!--        clearable-->
<!--        style="width: 120px"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="item in statusOptions"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value"-->
<!--        />-->
<!--      </el-select>-->

<!--      <el-button type="primary" icon="el-icon-search" @click="fetchData"-->
<!--        >查询</el-button-->
<!--      >-->

<!--      <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>-->
<!--    </div>-->

<!--    &lt;!&ndash; 数据表格 &ndash;&gt;-->
<!--    <el-table-->
<!--      :data="tableData"-->
<!--      stripe-->
<!--      border-->
<!--      v-loading="loading"-->
<!--      element-loading-text="加载中..."-->
<!--      class="data-table"-->
<!--    >-->
<!--      <el-table-column prop="title" label="标题" min-width="150" />-->

<!--      <el-table-column prop="fullShortUrl" label="短链" width="220">-->
<!--        <template #default="{ row }">-->
<!--          <el-tooltip-->
<!--            effect="dark"-->
<!--            :content="`点击次数: ${row.visits} | 独立IP: ${row.ipNum}`"-->
<!--            placement="top"-->
<!--          >-->
<!--            <el-link-->
<!--              type="primary"-->
<!--              :underline="false"-->
<!--              @click="handleLinkClick(row)"-->
<!--              >{{ row.fullShortUrl }}</el-link-->
<!--            >-->
<!--          </el-tooltip>-->
<!--          <el-tag-->
<!--            v-if="row.hasPassword"-->
<!--            size="mini"-->
<!--            type="danger"-->
<!--            effect="dark"-->
<!--            class="link-tag"-->
<!--            >加密</el-tag-->
<!--          >-->
<!--          <el-tag-->
<!--            v-if="row.privateTarget"-->
<!--            size="mini"-->
<!--            type="warning"-->
<!--            effect="dark"-->
<!--            class="link-tag"-->
<!--            >私有</el-tag-->
<!--          >-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="标签" width="180">-->
<!--        <template #default="{ row }">-->
<!--          <el-tag-->
<!--            v-for="tag in row.tags"-->
<!--            :key="tag"-->
<!--            size="mini"-->
<!--            class="tag-item"-->
<!--            >{{ tag }}</el-tag-->
<!--          >-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--        prop="longUrl"-->
<!--        label="原始链接"-->
<!--        min-width="280"-->
<!--        show-overflow-tooltip-->
<!--      />-->

<!--      <el-table-column label="状态" width="100">-->
<!--        <template #default="{ row }">-->
<!--          <el-tag :type="statusMap[row.status].type" size="small">{{-->
<!--            statusMap[row.status].label-->
<!--          }}</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="操作" width="280" fixed="right">-->
<!--        <template #default="{ row }">-->
<!--          <el-button type="primary" size="mini" @click="handleShowDetail(row)"-->
<!--            >详情</el-button-->
<!--          >-->

<!--          <el-button-->
<!--            type="primary"-->
<!--            size="mini"-->
<!--            :disabled="!row.hasPassword"-->
<!--            @click="openChangePasswordDialog(row)"-->
<!--            >修改密码</el-button-->
<!--          >-->

<!--          <el-popconfirm-->
<!--            title="确认删除该短链吗？"-->
<!--            @confirm="handleDelete(row.id)"-->
<!--          >-->
<!--            <template #reference>-->
<!--              <el-button type="danger" size="mini" style="margin-left: 10px"-->
<!--                >删除</el-button-->
<!--              >-->
<!--            </template>-->
<!--          </el-popconfirm>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    &lt;!&ndash; 遮罩层 &ndash;&gt;-->
<!--    <div-->
<!--      class="modal-mask"-->
<!--      v-if="activeDetail"-->
<!--      @click.self="activeDetail = null"-->
<!--    ></div>-->

<!--    &lt;!&ndash; 短链详情卡片 &ndash;&gt;-->
<!--    <transition name="el-zoom-in-top">-->
<!--      <el-card v-if="activeDetail" class="detail-card" style="margin-top: 20px">-->
<!--        <div class="detail-header">-->
<!--          <h3>短链详情（title: {{ activeDetail.title }}）</h3>-->
<!--          <el-button-->
<!--            icon="el-icon-close"-->
<!--            circle-->
<!--            @click="activeDetail = null"-->
<!--            class="close-btn"-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; 集成LinkDetail的核心表单 &ndash;&gt;-->
<!--        <el-form-->
<!--          :model="activeDetail"-->
<!--          :rules="detailRules"-->
<!--          ref="detailForm"-->
<!--          label-width="120px"-->
<!--        >-->
<!--          <el-form-item label="允许访问次数" prop="allowNum">-->
<!--            <el-input-number-->
<!--              v-model="activeDetail.allowNum"-->
<!--              :min="0"-->
<!--              controls-position="right"-->
<!--            />-->
<!--          </el-form-item>-->

<!--          <el-form-item label="过期时间">-->
<!--            <el-date-picker-->
<!--              v-model="activeDetail.expireTime"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="选择过期时间"-->
<!--              clearable-->
<!--              style="width: 100%"-->
<!--            />-->
<!--          </el-form-item>-->

<!--          <el-form-item label="私密链接">-->
<!--            <el-switch v-model="activeDetail.privateTarget" />-->
<!--          </el-form-item>-->

<!--          <el-form-item v-if="activeDetail.privateTarget" label="设置密码">-->
<!--            <el-input-->
<!--              v-model="activeDetail.password"-->
<!--              :disabled="activeDetail.hasPassword"-->
<!--              type="password"-->
<!--              show-password-->
<!--              placeholder="设置访问密码"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-form>-->

<!--        &lt;!&ndash; 操作按钮 &ndash;&gt;-->
<!--        <div class="action-btns">-->
<!--          <el-button type="primary" @click="saveDetail">保存</el-button>-->
<!--          <el-button @click="resetDetail">重置</el-button>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </transition>-->

<!--    &lt;!&ndash; 分页组件 &ndash;&gt;-->
<!--    <el-pagination-->
<!--      background-->
<!--      :current-page="queryParams.pageNum"-->
<!--      :page-sizes="[10, 20, 50, 100]"-->
<!--      :page-size="queryParams.pageSize"-->
<!--      :total="total"-->
<!--      layout="total, sizes, prev, pager, next, jumper"-->
<!--      @size-change="handleSizeChange"-->
<!--      @current-change="handleCurrentChange"-->
<!--      class="pagination"-->
<!--    />-->

<!--    &lt;!&ndash; 密码验证对话框 &ndash;&gt;-->
<!--    <el-dialog-->
<!--      title="访问验证"-->
<!--      :visible.sync="passwordDialogVisible"-->
<!--      width="30%"-->
<!--    >-->
<!--      <el-input-->
<!--        v-model="password"-->
<!--        type="password"-->
<!--        placeholder="请输入访问密码"-->
<!--        show-password-->
<!--        @keyup.enter="verifyPassword"-->
<!--      />-->
<!--      <span slot="footer">-->
<!--        <el-button @click="passwordDialogVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="verifyPassword">确认</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->

<!--    <el-dialog-->
<!--      title="修改密码"-->
<!--      :visible.sync="changePwdDialogVisible"-->
<!--      width="400px"-->
<!--    >-->
<!--      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef">-->
<!--        <el-form-item label="旧密码" prop="oldPassword">-->
<!--          <el-input-->
<!--            v-model="pwdForm.oldPassword"-->
<!--            type="password"-->
<!--            show-password-->
<!--            placeholder="请输入原密码"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="新密码" prop="newPassword">-->
<!--          <el-input-->
<!--            v-model="pwdForm.newPassword"-->
<!--            type="password"-->
<!--            show-password-->
<!--            placeholder="6-20位字符"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <span slot="footer">-->
<!--        <el-button @click="changePwdDialogVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="handleChangePassword"-->
<!--          >确认修改</el-button-->
<!--        >-->
<!--      </span>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import request from "@/utils/request";-->
<!--import md5 from "js-md5";-->

<!--const API_MAP = {-->
<!--  expireTime: "/control/shortLink/deadTime",-->
<!--  allowNum: "/control/shortLink/visitNum",-->
<!--  privateTarget: "/control/shortLink/private",-->
<!--  password: "/control/shortLink/changePwd",-->
<!--};-->

<!--export default {-->
<!--  name: "ShortLinkList",-->
<!--  data() {-->
<!--    return {-->
<!--      pwdRules: {-->
<!--        oldPassword: [-->
<!--          { required: true, message: "必须输入旧密码", trigger: "blur" },-->
<!--        ],-->
<!--        newPassword: [-->
<!--          { required: true, message: "必须输入新密码", trigger: "blur" },-->
<!--          { min: 6, max: 20, message: "密码长度6-20位", trigger: "blur" },-->
<!--        ],-->
<!--      },-->
<!--      activeDetail: null,-->
<!--      originalData: null,-->
<!--      detailRules: {-->
<!--        allowNum: [{ type: "number", min: 0, message: "不能小于0" }],-->
<!--        expireTime: [{ validator: this.validateExpireTime }],-->
<!--        password: [-->
<!--          {-->
<!--            validator: (rule, value, callback) => {-->
<!--              // 仅在启用私密时校验-->
<!--              if (this.activeDetail.privateTarget && !value) {-->
<!--                callback(new Error("启用私密必须设置密码"));-->
<!--              } else {-->
<!--                callback();-->
<!--              }-->
<!--            },-->
<!--            trigger: "blur",-->
<!--          },-->
<!--        ],-->
<!--      },-->
<!--      changePwdDialogVisible: false,-->
<!--      pwdForm: {-->
<!--        id: "",-->
<!--        oldPassword: "",-->
<!--        newPassword: "",-->
<!--      },-->
<!--      loading: false,-->
<!--      tableData: [],-->
<!--      total: 0,-->
<!--      tagOptions: [],-->
<!--      password: "",-->
<!--      currentLink: null,-->
<!--      passwordDialogVisible: false,-->
<!--      queryParams: {-->
<!--        pageNum: 1,-->
<!--        pageSize: 10,-->
<!--        keyword: "",-->
<!--        tags: [],-->
<!--        status: null,-->
<!--      },-->
<!--      statusOptions: [-->
<!--        { value: 0, label: "草稿" },-->
<!--        { value: 1, label: "发布" },-->
<!--        { value: 2, label: "禁用" },-->
<!--      ],-->
<!--      statusMap: {-->
<!--        0: { label: "草稿", type: "info" },-->
<!--        1: { label: "正常", type: "success" },-->
<!--        2: { label: "禁用", type: "danger" },-->
<!--      },-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    this.fetchData();-->
<!--    this.fetchTags();-->
<!--  },-->
<!--  methods: {-->
<!--    // async fetchData() {-->
<!--    //   this.loading = true;-->
<!--    //   // 确保参数格式正确（多选标签转为逗号分隔）-->
<!--    //   console.log(this.queryParams.pageNum, this.queryParams.pageSize);-->
<!--    //   let params = {-->
<!--    //     pageNum: this.queryParams.pageNum,-->
<!--    //     pageSize: this.queryParams.pageSize,-->
<!--    //   };-->
<!--    //   if (this.queryParams.keyword) params.keyword = this.queryParams.keyword;-->
<!--    //   if (this.queryParams.status) params.status = this.queryParams.status;-->
<!--    //   // params = {-->
<!--    //   //   tags: this.queryParams.tags,-->
<!--    //   // };-->
<!--    //   request-->
<!--    //     .get("/shortLink/list", { ...params })-->
<!--    //     .then((res) => {-->
<!--    //       if (res.code === 200) {-->
<!--    //         console.log("请求参数:", { ...params });-->
<!--    //         console.log("接口返回res:", res);-->
<!--    //         this.tableData = res.data.list;-->
<!--    //         this.total = res.data.total || 0;-->
<!--    //       }-->
<!--    //     })-->
<!--    //     .catch((error) => {-->
<!--    //       this.$message.error("加载失败");-->
<!--    //     })-->
<!--    //     .finally(() => {-->
<!--    //       this.loading = false;-->
<!--    //     });-->
<!--    // },-->
<!--    async fetchData() {-->
<!--      try {-->
<!--        this.loading = true;-->

<!--        // 构造请求参数-->
<!--        const params = {-->
<!--          pageNum: this.queryParams.pageNum,-->
<!--          pageSize: this.queryParams.pageSize,-->
<!--          keyword: this.queryParams.keyword || undefined, // 空值不传-->
<!--          status: this.queryParams.status || undefined, // 空值不传-->
<!--          tags: this.queryParams.tags?.length-->
<!--            ? this.queryParams.tags.join(",")-->
<!--            : undefined,-->
<!--        };-->

<!--        // 移除值为undefined的参数-->
<!--        const filteredParams = Object.fromEntries(-->
<!--          Object.entries(params).filter(([_, value]) => value !== undefined)-->
<!--        );-->

<!--        const res = await request.get("/shortLink/list", {-->
<!--          params: filteredParams, // 正确传递GET参数-->
<!--        });-->

<!--        if (res.code === 200) {-->
<!--          console.log("list:", res);-->
<!--          this.tableData = res.data.list || [];-->
<!--          this.total = res.data.total || 0;-->
<!--        } else {-->
<!--          // 处理业务逻辑错误-->
<!--          this.$message.error(res.msg || "获取数据失败");-->
<!--        }-->
<!--      } catch (error) {-->
<!--        // 拦截器已经处理了401/40005等错误，这里处理其他错误-->
<!--        console.error("请求异常:", error);-->
<!--        if (!error.response) {-->
<!--          this.$message.error("网络错误，请检查连接");-->
<!--        }-->
<!--        // 其他错误消息已在拦截器中显示-->
<!--      } finally {-->
<!--        this.loading = false;-->
<!--      }-->
<!--    },-->
<!--    // async fetchTags() {-->
<!--    //   try {-->
<!--    //     const res = await request.get("/tag/get");-->
<!--    //     // 处理可能的空值-->
<!--    //     if (res && res.data) {-->
<!--    //       this.tagOptions = res.data.data || [];-->
<!--    //     } else {-->
<!--    //       this.tagOptions = [];-->
<!--    //       console.error("标签接口返回数据异常:", res);-->
<!--    //     }-->
<!--    //   } catch (error) {-->
<!--    //     console.error("获取标签失败:", error);-->
<!--    //     this.tagOptions = [];-->
<!--    //   }-->
<!--    // },-->

<!--    async fetchTags() {-->
<!--      try {-->
<!--        const res = await request.get("/tag/get");-->
<!--        if (res.code === 200) {-->
<!--          this.tagOptions = res.data || [];-->

<!--          console.log(this.tagList);-->
<!--        } else {-->
<!--          this.$message.error(res.msg || "获取标签失败");-->
<!--          this.tagOptions = [];-->
<!--        }-->
<!--      } catch (error) {-->
<!--        console.error("获取标签失败:", error);-->
<!--        this.$message.error("获取标签失败，请检查网络连接");-->
<!--        this.tagOptions = [];-->
<!--      }-->
<!--    },-->

<!--    async handleDelete(id) {-->
<!--      try {-->
<!--        await request.delete(`/delete/shortLink/${id}`, {-->
<!--          headers: { accessToken: localStorage.getItem("accessToken") },-->
<!--        });-->
<!--        this.$message.success("删除成功");-->

<!--        // 删除后检查当前页是否为空-->
<!--        if (this.tableData.length === 1 && this.queryParams.pageNum > 1) {-->
<!--          this.queryParams.pageNum -= 1;-->
<!--        }-->
<!--        await this.fetchData();-->
<!--      } catch (error) {-->
<!--        this.$message.error("删除失败");-->
<!--      }-->
<!--    },-->

<!--    // handleLinkClick(row) {-->
<!--    //   if (row.hasPassword) {-->
<!--    //     this.currentLink = row;-->
<!--    //     this.passwordDialogVisible = true;-->
<!--    //   } else {-->
<!--    //     this.accessLink(row.fullShortUrl);-->
<!--    //   }-->
<!--    // },-->
<!--    // handleLinkClick(row) {-->
<!--    //   if (row.hasPassword) {-->
<!--    //     this.currentLink = row;-->
<!--    //     this.passwordDialogVisible = true;-->
<!--    //   } else {-->
<!--    //     this.accessLink(row.fullShortUrl);-->
<!--    //   }-->
<!--    // },-->
<!--    handleLinkClick(row) {-->
<!--      // 直接跳转到/sparrow/{shortLink}路由-->
<!--      // 由RedirectPage组件处理是否需要密码-->
<!--      this.$router.push({-->
<!--        name: "Redirect",-->
<!--        params: { shortLink: row.shortUrl },-->
<!--      });-->
<!--    },-->

<!--    async verifyPassword() {-->
<!--      console.log(this.currentLink.shortUrl);-->
<!--      console.log(this.password);-->
<!--      try {-->
<!--        const res = await request.post("/shortLink/verifyPassword", {-->
<!--          shortLink: this.currentLink.shortUrl,-->
<!--          password: this.password,-->
<!--        });-->

<!--        console.log(res);-->

<!--        if (res.code === 200) {-->
<!--          this.accessLink(this.currentLink.fullShortUrl);-->
<!--          this.passwordDialogVisible = false;-->
<!--        } else {-->
<!--          this.$message.error("密码错误");-->
<!--        }-->
<!--      } catch (error) {-->
<!--        this.$message.error("验证失败");-->
<!--      }-->
<!--    },-->
<!--    -->
<!--    accessLink(fullShortUrl) {-->
<!--      // 立即跳转（不等待统计结果）-->
<!--      window.open(fullShortUrl, "_blank");-->

<!--      // 异步发送统计请求（不阻塞跳转）-->
<!--      const shortUrl = fullShortUrl.split("/").pop();-->
<!--      const res = request-->
<!--        .get(`/sparrow/${shortUrl}`, {-->
<!--          headers: { accessToken: localStorage.getItem("accessToken") },-->
<!--        })-->
<!--        .catch((error) => {-->
<!--          console.error("统计失败（不影响跳转）:", error);-->
<!--        });-->

<!--      console.log("res:", res);-->
<!--    },-->

<!--    // 显示详情-->
<!--    handleShowDetail(row) {-->
<!--      this.activeDetail = { ...row }; // 克隆行数据-->
<!--      console.log(this.activeDetail);-->
<!--    },-->

<!--    // 保存修改-->
<!--    async saveDetail() {-->
<!--      try {-->
<!--        await this.$refs.detailForm.validate();-->
<!--        const originalData = this.tableData.find(-->
<!--          (item) => item.id === this.activeDetail.id-->
<!--        );-->
<!--        const changedFields = this.getChangedFields(originalData);-->

<!--        // 批量调用接口-->
<!--        const requests = changedFields.map((field) =>-->
<!--          this.callSpecificApi(field)-->
<!--        );-->
<!--        await Promise.all(requests);-->

<!--        this.$message.success("保存成功");-->
<!--        await this.fetchData();-->
<!--      } catch (error) {-->
<!--        this.$message.error(`保存失败: ${error.message}`);-->
<!--      }-->
<!--    },-->

<!--    // getChangedFields(original) {-->
<!--    //   let fields = Object.keys(API_MAP).filter(key =>-->
<!--    //       JSON.stringify(this.activeDetail[key]) !== JSON.stringify(original[key])-->
<!--    //   );-->
<!--    //-->
<!--    //   // 排除密码单独修改的情况-->
<!--    //   if (fields.includes('password')) {-->
<!--    //     fields = fields.filter(f => f !== 'privateTarget');-->
<!--    //   }-->
<!--    //   return fields;-->
<!--    // },-->
<!--    getChangedFields(original) {-->
<!--      // 只检测以下字段变化-->
<!--      const compareFields = ["expireTime", "allowNum", "privateTarget"];-->
<!--      return compareFields.filter(-->
<!--        (key) => this.activeDetail[key] !== original[key]-->
<!--      );-->
<!--    },-->

<!--    async callSpecificApi(field) {-->
<!--      const apiPath = API_MAP[field];-->
<!--      const params = this.buildParamsByField(field);-->
<!--      const res = await request.put(apiPath, params);-->

<!--      if (res.code !== 200) throw new Error(res.msg || "接口异常");-->
<!--    },-->

<!--    // 在 methods 中添加以下方法-->
<!--    buildParamsByField(field) {-->
<!--      const baseParams = { id: this.activeDetail.id };-->

<!--      switch (field) {-->
<!--        // 过期时间-->
<!--        case "expireTime":-->
<!--          return {-->
<!--            ...baseParams,-->
<!--            expireTime: this.activeDetail.expireTime,-->
<!--          };-->

<!--        // 访问次数-->
<!--        case "allowNum":-->
<!--          return {-->
<!--            ...baseParams,-->
<!--            allowNum: this.activeDetail.allowNum,-->
<!--          };-->

<!--        // 私密状态（需校验密码）-->
<!--        case "privateTarget":-->
<!--          if (this.activeDetail.privateTarget) {-->
<!--            if (!this.activeDetail.password) {-->
<!--              throw new Error("启用私密必须设置密码");-->
<!--            }-->
<!--            if (-->
<!--              this.activeDetail.password.length < 4 ||-->
<!--              this.activeDetail.password.length > 12-->
<!--            ) {-->
<!--              // ✅ 添加长度校验-->
<!--              throw new Error("请输入4-12位密码");-->
<!--            }-->
<!--          }-->
<!--          return {-->
<!--            ...baseParams,-->
<!--            privateTarget: this.activeDetail.privateTarget,-->
<!--            password: md5(this.activeDetail.password), // 新密码直接加密-->
<!--          };-->

<!--        // 密码修改（参数名转换 newPassword）-->
<!--        // case 'password':-->
<!--        //   if (this.activeDetail.password.length < 6) {-->
<!--        //     throw new Error('密码至少6位');-->
<!--        //   }-->
<!--        //   return {-->
<!--        //     ...baseParams,-->
<!--        //     oldPassword: md5(this.oldPassword),      // 新增旧密码字段-->
<!--        //     newPassword: md5(this.activeDetail.password)-->
<!--        //   };-->

<!--        default:-->
<!--          throw new Error("未知字段类型");-->
<!--      }-->
<!--    },-->

<!--    openChangePasswordDialog(row) {-->
<!--      if (!row.hasPassword) {-->
<!--        this.$message.error("该短链未设置密码");-->
<!--        return;-->
<!--      }-->
<!--      this.pwdForm.id = row.id;-->
<!--      this.changePwdDialogVisible = true;-->
<!--    },-->

<!--    async handleChangePassword() {-->
<!--      try {-->
<!--        console.log(this.pwdForm.oldPassword);-->
<!--        console.log(this.pwdForm.newPassword);-->
<!--        const res = await request.put("/control/shortLink/changePwd", {-->
<!--          id: this.pwdForm.id,-->
<!--          password: md5(this.pwdForm.oldPassword),-->
<!--          newPassword: md5(this.pwdForm.newPassword),-->
<!--        });-->

<!--        if (res.code === 200) {-->
<!--          this.$message.success("密码修改成功");-->
<!--          this.changePwdDialogVisible = false;-->
<!--          await this.fetchData();-->
<!--        } else {-->
<!--          this.$message.error(res.msg);-->
<!--        }-->
<!--      } catch (error) {-->
<!--        this.$message.error("修改失败: " + error.response?.data?.msg);-->
<!--      }-->
<!--    },-->

<!--    // 重置修改-->
<!--    resetDetail() {-->
<!--      this.activeDetail = {-->
<!--        ...this.tableData.find((item) => item.id === this.activeDetail.id),-->
<!--      };-->
<!--    },-->

<!--    handleSizeChange(val) {-->
<!--      this.queryParams.pageSize = val;-->
<!--      this.queryParams.pageNum = 1;-->
<!--      this.fetchData();-->
<!--    },-->

<!--    handleCurrentChange(val) {-->
<!--      this.queryParams.pageNum = val;-->
<!--      this.fetchData();-->
<!--    },-->

<!--    resetQuery() {-->
<!--      this.queryParams = {-->
<!--        pageNum: 1,-->
<!--        pageSize: 10,-->
<!--        keyword: "",-->
<!--        tags: [],-->
<!--        status: null,-->
<!--      };-->
<!--      this.fetchData();-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.filter-bar {-->
<!--  display: flex;-->
<!--  gap: 10px;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.link-tag {-->
<!--  margin-left: 8px;-->
<!--  transform: translateY(-2px);-->
<!--}-->

<!--.tag-item {-->
<!--  margin: 2px;-->
<!--}-->

<!--.data-table {-->
<!--  margin: 20px 0;-->
<!--}-->

<!--.pagination {-->
<!--  margin-top: 20px;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--.modal-mask {-->
<!--  position: fixed;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--  background: rgba(0, 0, 0, 0.5); /* 半透明黑色 */-->
<!--  z-index: 99; /* 比卡片低一级 */-->
<!--  transition: opacity 0.3s ease;-->
<!--}-->

<!--.detail-card {-->
<!--  position: fixed; /* 改为fixed定位 */-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  width: 50%;-->
<!--  max-height: 80vh;-->
<!--  overflow-y: auto;-->
<!--  background: #fff;-->
<!--  z-index: 100;-->
<!--  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.detail-header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.action-btns {-->
<!--  text-align: center;-->
<!--  margin-top: 20px;-->
<!--}-->
<!--</style>-->



<template>
  <div class="list-container">
    <!-- 搜索和过滤区 -->
    <div class="filter-bar">
      <el-input
          v-model="queryParams.keyword"
          placeholder="输入标题/长链/短链"
          clearable
          class="search-input"
          @keyup.enter="fetchData"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>

      <el-select
          v-model="queryParams.tags"
          multiple
          filterable
          placeholder="选择标签"
          style="width: 240px"
      >
        <el-option
            v-for="tag in tagOptions"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
        />
      </el-select>

      <el-select
          v-model="queryParams.status"
          placeholder="选择状态"
          clearable
          style="width: 120px"
      >
        <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>

      <el-button type="primary" icon="el-icon-search" @click="fetchData"
      >查询</el-button
      >

      <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
        element-loading-text="加载中..."
        class="data-table"
    >
      <el-table-column prop="title" label="标题" min-width="150" />

      <el-table-column prop="fullShortUrl" label="短链" width="220">
        <template #default="{ row }">
          <el-tooltip
              effect="dark"
              :content="`点击次数: ${row.visits} | 独立IP: ${row.ipNum}`"
              placement="top"
          >
            <el-link
                type="primary"
                :underline="false"
                @click="accessLink(row)"
            >{{ row.fullShortUrl }}</el-link
            >
          </el-tooltip>
          <el-tag
              v-if="row.hasPassword"
              size="mini"
              type="danger"
              effect="dark"
              class="link-tag"
          >加密</el-tag
          >
          <el-tag
              v-if="row.privateTarget"
              size="mini"
              type="warning"
              effect="dark"
              class="link-tag"
          >私有</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="标签" width="180">
        <template #default="{ row }">
          <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="mini"
              class="tag-item"
          >{{ tag }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
          prop="longUrl"
          label="原始链接"
          min-width="280"
          show-overflow-tooltip
      />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusMap[row.status].type" size="small">{{
              statusMap[row.status].label
            }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleShowDetail(row)"
          >详情</el-button
          >

          <el-button
              type="primary"
              size="mini"
              :disabled="!row.hasPassword"
              @click="openChangePasswordDialog(row)"
          >修改密码</el-button
          >

          <el-popconfirm
              title="确认删除该短链吗？"
              @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="mini" style="margin-left: 10px"
              >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 遮罩层 -->
    <div
        class="modal-mask"
        v-if="activeDetail"
        @click.self="activeDetail = null"
    ></div>

    <!-- 短链详情卡片 -->
    <transition name="el-zoom-in-top">
      <el-card v-if="activeDetail" class="detail-card" style="margin-top: 20px">
        <div class="detail-header">
          <h3>短链详情（title: {{ activeDetail.title }}）</h3>
          <el-button
              icon="el-icon-close"
              circle
              @click="activeDetail = null"
              class="close-btn"
          />
        </div>

        <!-- 集成LinkDetail的核心表单 -->
        <el-form
            :model="activeDetail"
            :rules="detailRules"
            ref="detailForm"
            label-width="120px"
        >
          <el-form-item label="允许访问次数" prop="allowNum">
            <el-input-number
                v-model="activeDetail.allowNum"
                :min="0"
                controls-position="right"
            />
          </el-form-item>

          <el-form-item label="过期时间">
            <el-date-picker
                v-model="activeDetail.expireTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择过期时间"
                clearable
                style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="私密链接">
            <el-switch v-model="activeDetail.privateTarget" />
          </el-form-item>

          <el-form-item v-if="activeDetail.privateTarget" label="设置密码">
            <el-input
                v-model="activeDetail.password"
                :disabled="activeDetail.hasPassword"
                type="password"
                show-password
                placeholder="设置访问密码"
            />
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div class="action-btns">
          <el-button type="primary" @click="saveDetail">保存</el-button>
          <el-button @click="resetDetail">重置</el-button>
        </div>
      </el-card>
    </transition>

    <!-- 分页组件 -->
    <el-pagination
        background
        :current-page="queryParams.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
    />

<!--    &lt;!&ndash; 密码验证对话框 &ndash;&gt;-->
<!--    <el-dialog-->
<!--        title="访问验证"-->
<!--        :visible.sync="passwordDialogVisible"-->
<!--        width="30%"-->
<!--    >-->
<!--      <el-input-->
<!--          v-model="password"-->
<!--          type="password"-->
<!--          placeholder="请输入访问密码"-->
<!--          show-password-->
<!--          @keyup.enter="verifyPassword"-->
<!--      />-->
<!--      <span slot="footer">-->
<!--        <el-button @click="passwordDialogVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="verifyPassword">确认</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->

    <el-dialog
        title="修改密码"
        :visible.sync="changePwdDialogVisible"
        width="400px"
    >
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
              v-model="pwdForm.oldPassword"
              type="password"
              show-password
              placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="pwdForm.newPassword"
              type="password"
              show-password
              placeholder="6-20位字符"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="changePwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword"
        >确认修改</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

const API_MAP = {
  expireTime: "/control/shortLink/deadTime",
  allowNum: "/control/shortLink/visitNum",
  privateTarget: "/control/shortLink/private",
  password: "/control/shortLink/changePwd",
};

export default {
  name: "ShortLinkList",
  data() {
    return {
      pwdRules: {
        oldPassword: [
          { required: true, message: "必须输入旧密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "必须输入新密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度6-20位", trigger: "blur" },
        ],
      },
      activeDetail: null,
      originalData: null,
      detailRules: {
        allowNum: [{ type: "number", min: 0, message: "不能小于0" }],
        expireTime: [{ validator: this.validateExpireTime }],
        password: [
          {
            validator: (rule, value, callback) => {
              // 仅在启用私密时校验
              if (this.activeDetail.privateTarget && !value) {
                callback(new Error("启用私密必须设置密码"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      changePwdDialogVisible: false,
      pwdForm: {
        id: "",
        oldPassword: "",
        newPassword: "",
      },
      loading: false,
      tableData: [],
      total: 0,
      tagOptions: [],
      // password: "",
      // currentLink: null,
      // passwordDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: "",
        tags: [],
        status: null,
      },
      statusOptions: [
        { value: 0, label: "草稿" },
        { value: 1, label: "发布" },
        { value: 2, label: "禁用" },
      ],
      statusMap: {
        0: { label: "草稿", type: "info" },
        1: { label: "正常", type: "success" },
        2: { label: "禁用", type: "danger" },
      },
    };
  },
  mounted() {
    this.fetchData();
    this.fetchTags();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;

        // 构造请求参数
        const params = {
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize,
          keyword: this.queryParams.keyword || undefined, // 空值不传
          status: this.queryParams.status || undefined, // 空值不传
          tags: this.queryParams.tags?.length
              ? this.queryParams.tags.join(",")
              : undefined,
        };

        // 移除值为undefined的参数
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );

        const res = await request.get("/shortLink/list", {
          params: filteredParams, // 正确传递GET参数
        });

        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.total = res.data.total || 0;
        } else {
          // 处理业务逻辑错误
          this.$message.error(res.msg || "获取数据失败");
        }
      } catch (error) {
        // 拦截器已经处理了401/40005等错误，这里处理其他错误
        console.error("请求异常:", error);
        if (!error.response) {
          this.$message.error("网络错误，请检查连接");
        }
        // 其他错误消息已在拦截器中显示
      } finally {
        this.loading = false;
      }
    },

    async fetchTags() {
      try {
        const res = await request.get("/tag/get");
        if (res.code === 200) {
          this.tagOptions = res.data || [];

          console.log(this.tagList)
        } else {
          this.$message.error(res.msg || "获取标签失败");
          this.tagOptions = [];
      }
    } catch (error) {
      console.error("获取标签失败:", error);
        this.$message.error("获取标签失败，请检查网络连接");
        this.tagOptions = [];
      }
    },

    async handleDelete(id) {
      try {
        await request.delete(`/delete/shortLink/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });
        this.$message.success("删除成功");

        // 删除后检查当前页是否为空
        if (this.tableData.length === 1 && this.queryParams.pageNum > 1) {
          this.queryParams.pageNum -= 1;
        }
        await this.fetchData();
      } catch (error) {
        this.$message.error("删除失败");
      }
    },


    async accessLink(row) {
      try {
        // // 创建新窗口避免被浏览器拦截
        // const newWindow = window.open('', '_blank');
        console.log("row:",row)

        // 调用后端接口进行跳转
        const response = await request.post('/shortLink/verifyPassword', {
          shortLink: row.shortLink,
          password: row.password // 传递空密码由后端处理
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        // 处理重定向
        if (response.data.code === 200) {
          // 显示倒计时界面
          this.showRedirectPage(newWindow, response.data.data);

          // 发送统计请求（不阻塞主流程）
          this.sendStatistics(row.shortLink);
        }
      } catch (error) {
        console.error('跳转失败:', error);
        this.$message.error('链接打开失败');
      }
    },

    // 显示重定向页面
    showRedirectPage(newWindow, targetUrl) {
      let seconds = 5;

      const htmlContent = `
        <div style="padding: 20px; text-align: center">
          <h3>正在跳转...</h3>
          <p>将在 <span id="countdown">5</span> 秒后自动跳转</p>
          <p>或 <a href="${targetUrl}" style="color: blue">立即跳转</a></p>
        </div>
      `;

      newWindow.document.write(htmlContent);

      // 倒计时逻辑
      const timer = setInterval(() => {
        seconds--;
        newWindow.document.getElementById('countdown').textContent = seconds;

        if (seconds <= 0) {
          clearInterval(timer);
          newWindow.location.href = targetUrl;
        }
      }, 1000);

      // 立即跳转处理
      newWindow.document.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        newWindow.location.href = targetUrl;
      });
    },
    // 发送统计请求
    async sendStatistics(shortLink) {
      try {
        await request.get(`/sparrow/${shortLink}`);
      } catch (error) {
        console.error('统计请求失败:', error);
      }
    },

    // async verifyPassword() {
    //   console.log(this.currentLink.shortUrl)
    //   console.log(this.password)
    //   try {
    //     const res = await request.post("/shortLink/verifyPassword", requestData,{
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    //       }});
    //
    //     console.log(res)
    //
    //     if (res.code === 200 && res.data) {
    //       // 成功处理
    //       this.$message.success('密码验证成功');
    //       this.passwordDialogVisible = false;
    //
    //       // 跳转逻辑
    //       this.handleRedirect(res.data);
    //     } else {
    //       throw new Error(res.msg || '验证失败');
    //     }
    //   } catch (error) {
    //     // 错误处理
    //     let errorMsg = '验证失败';
    //     if (error.response) {
    //       errorMsg = `服务器错误: ${error.response.status}`;
    //     } else if (error.message.includes('Network Error')) {
    //       errorMsg = '网络连接异常';
    //     }
    //     this.$message.error(errorMsg);
    //     console.error('验证错误:', error);
    //   }
    // },

    // async verifyPassword() {
    //   try {
    //     const requestData = {
    //       shortLink: this.currentLink.shortLink,
    //       password: this.password
    //     };
    //
    //     const res = await request.post("/shortLink/verifyPassword", requestData);
    //
    //     if (res.code === 200 && res.data) {
    //       // this.$message.success('密码验证成功');
    //       // this.passwordDialogVisible = false;
    //       this.handleRedirect(res.data, this.currentLink);
    //     } else {
    //       throw new Error(res.msg || '验证失败');
    //     }
    //   } catch (error) {
    //     let errorMsg = '验证失败';
    //     if (error.response) {
    //       errorMsg = `服务器错误: ${error.response.status}`;
    //     } else if (error.message.includes('Network Error')) {
    //       errorMsg = '网络连接异常';
    //     }
    //     this.$message.error(errorMsg);
    //   }
    // },

    async handleRedirect(targetUrl, row) {
      // 显示成功提示
      this.$notify({
        title: '跳转提示',
        message: '验证成功，即将跳转...',
        type: 'success',
        duration: 2000
      });

      // 先发送统计请求
      try {
        await request.get(`/sparrow/${row.shortLink}`);
      } catch (error) {
        console.error('统计请求失败:', error);
      }

      // 创建新窗口
      const newWindow = window.open('', '_blank');

      // 倒计时跳转逻辑
      let seconds = 5;
      const countdownElement = document.createElement('div');
      countdownElement.innerHTML = `
        <div style="padding: 20px; text-align: center">
          <h3>验证成功！即将跳转到目标页面</h3>
          <p>URL: ${targetUrl}</p>
          <p>将在 <span style="color: #409EFF; font-weight: bold">${seconds}</span> 秒后自动跳转</p>
          <p>或 <a href="${targetUrl}" style="color: #409EFF; cursor: pointer">立即跳转</a></p>
        </div>
      `;
      newWindow.document.body.appendChild(countdownElement);

      // 倒计时更新
      const timer = setInterval(() => {
        seconds--;
        countdownElement.querySelector('span').textContent = seconds;

        if (seconds <= 0) {
          clearInterval(timer);
          newWindow.location.href = targetUrl;
        }
      }, 1000);

      // 立即跳转点击处理
      countdownElement.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        newWindow.location.href = targetUrl;
      });
    },

    // 显示详情
    handleShowDetail(row) {
      this.activeDetail = { ...row }; // 克隆行数据
      console.log(this.activeDetail)
    },

    // 保存修改
    async saveDetail() {
      try {
        await this.$refs.detailForm.validate();
        const originalData = this.tableData.find(
            (item) => item.id === this.activeDetail.id
        );
        const changedFields = this.getChangedFields(originalData);

        // 批量调用接口
        const requests = changedFields.map((field) =>
            this.callSpecificApi(field)
        );
        await Promise.all(requests);

        this.$message.success("保存成功");
        await this.fetchData();
      } catch (error) {
        this.$message.error(`保存失败: ${error.message}`);
      }
    },

    getChangedFields(original) {
      // 只检测以下字段变化
      const compareFields = ["expireTime", "allowNum", "privateTarget"];
      return compareFields.filter(
          (key) => this.activeDetail[key] !== original[key]
      );
    },

    async callSpecificApi(field) {
      const apiPath = API_MAP[field];
      const params = this.buildParamsByField(field);
      const res = await request.put(apiPath, params);

      if (res.code !== 200) throw new Error(res.msg || "接口异常");
    },

    // 在 methods 中添加以下方法
    buildParamsByField(field) {
      const baseParams = { id: this.activeDetail.id };

      switch (field) {
          // 过期时间
        case "expireTime":
          return {
            ...baseParams,
            expireTime: this.activeDetail.expireTime,
          };

          // 访问次数
        case "allowNum":
          return {
            ...baseParams,
            allowNum: this.activeDetail.allowNum,
          };

          // 私密状态（需校验密码）
        case "privateTarget":
          if (this.activeDetail.privateTarget) {
            if (!this.activeDetail.password) {
              throw new Error("启用私密必须设置密码");
            }
            if (
                this.activeDetail.password.length < 4 ||
                this.activeDetail.password.length > 12
            ) {
              // ✅ 添加长度校验
              throw new Error("请输入4-12位密码");
            }
          }
          return {
            ...baseParams,
            privateTarget: this.activeDetail.privateTarget,
            password: this.activeDetail.password, // 新密码直接加密
          };

        default:
          throw new Error("未知字段类型");
      }
    },

    openChangePasswordDialog(row) {
      if (!row.hasPassword) {
        this.$message.error("该短链未设置密码");
        return;
      }
      this.pwdForm.id = row.id;
      this.changePwdDialogVisible = true;
    },

    async handleChangePassword() {
      try {
        console.log(this.pwdForm.oldPassword);
        console.log(this.pwdForm.newPassword);
        const res = await request.put("/control/shortLink/changePwd", {
          id: this.pwdForm.id,
          password: this.pwdForm.oldPassword,
          newPassword: this.pwdForm.newPassword,
        });

        if (res.code === 200) {
          this.$message.success("密码修改成功");
          this.changePwdDialogVisible = false;
          await this.fetchData();
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        this.$message.error("修改失败: " + error.response?.data?.msg);
      }
    },

    // 重置修改
    resetDetail() {
      this.activeDetail = {
        ...this.tableData.find((item) => item.id === this.activeDetail.id),
      };
    },

    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.queryParams.pageNum = 1;
      this.fetchData();
    },

    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.fetchData();
    },

    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        keyword: "",
        tags: [],
        status: null,
      };
      this.fetchData();
    },
  },
};
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.link-tag {
  margin-left: 8px;
  transform: translateY(-2px);
}

.tag-item {
  margin: 2px;
}

.data-table {
  margin: 20px 0;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
  z-index: 99; /* 比卡片低一级 */
  transition: opacity 0.3s ease;
}

.detail-card {
  position: fixed; /* 改为fixed定位 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-height: 80vh;
  overflow-y: auto;
  background: #fff;
  z-index: 100;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.action-btns {
  text-align: center;
  margin-top: 20px;
}
</style>