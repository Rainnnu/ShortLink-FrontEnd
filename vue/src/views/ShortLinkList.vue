以下代码有何问题？
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

      <el-button
          type="primary"
          icon="el-icon-search"
          @click="fetchData"
      >查询</el-button>

      <el-button
          icon="el-icon-refresh"
          @click="resetQuery"
      >重置</el-button>
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
                @click="handleLinkClick(row)"
            >{{ row.fullShortUrl }}</el-link>
          </el-tooltip>
          <el-tag
              v-if="row.hasPassword"
              size="mini"
              type="danger"
              effect="dark"
              class="link-tag"
          >加密</el-tag>
          <el-tag
              v-if="row.privateTarget"
              size="mini"
              type="warning"
              effect="dark"
              class="link-tag"
          >私有</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="标签" width="180">
        <template #default="{ row }">
          <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="mini"
              class="tag-item"
          >{{ tag }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="longUrl" label="原始链接" min-width="280" show-overflow-tooltip />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag
              :type="statusMap[row.status].type"
              size="small"
          >{{ statusMap[row.status].label }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
              type="primary"
              size="mini"
              @click="handleShowDetail(row)"
          >详情</el-button>

          <el-popconfirm
              title="确认删除该短链吗？"
              @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button
                  type="danger"
                  size="mini"
              >删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 短链详情卡片 -->
    <transition name="el-zoom-in-top">
      <el-card
          v-if="activeDetail"
          class="detail-card"
          style="margin-top: 20px;"
      >
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
            label-width="120px">
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
                value-format="timestamp"
            />
          </el-form-item>

          <el-form-item label="私密链接">
            <el-switch v-model="activeDetail.privateTarget" />
          </el-form-item>

          <el-form-item v-if="activeDetail.privateTarget" label="访问密码">
            <el-input
                v-model="activeDetail.password"
                type="password"
                show-password
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

    <!-- 密码验证对话框 -->
    <el-dialog
        title="访问验证"
        :visible.sync="passwordDialogVisible"
        width="30%"
    >
      <el-input
          v-model="password"
          type="password"
          placeholder="请输入访问密码"
          show-password
          @keyup.enter="verifyPassword"
      />
      <span slot="footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="verifyPassword">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'ShortLinkList',
  data() {
    return {
      activeDetail: null,
      detailRules: {
        allowNum: [
          { type: 'number', min: 0, message: '不能小于0' }
        ],
        expireTime: [
          { validator: this.validateExpireTime }
        ]
      },
      loading: false,
      tableData: [],
      total: 0,
      tagOptions: [],
      password: '',
      currentLink: null,
      passwordDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        tags: [],
        status: null
      },
      statusOptions: [
        { value: 0, label: '草稿' },
        { value: 1, label: '发布' },
        { value: 2, label: '禁用' }
      ],
      statusMap: {
        0: { label: '草稿', type: 'info' },
        1: { label: '正常', type: 'success' },
        2: { label: '禁用', type: 'danger' }
      }
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
        // 确保参数格式正确（多选标签转为逗号分隔）
        const params = {
          ...this.queryParams,
          tags: this.queryParams.tags.join(',') // 数组转字符串
        };

        const res = await request.get('/shortLink/list', {
          params,
          headers: { accessToken: localStorage.getItem("accessToken") }
        });

        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total || 0; // ✅ 绑定正确的总条数

          this.queryParams.pageNum = res.data.pageNum;
        }
      } catch (error) {
        this.$message.error("加载失败");
      } finally {
        this.loading = false;
      }
    },

    async fetchTags() {
      try {
        const res = await request.get('/tag/get',{

          headers:{ accessToken: localStorage.getItem('accessToken') }
        });
        // 处理可能的空值
        if (res && res.data) {
          this.tagOptions = res.data.data || [];
        } else {
          this.tagOptions = [];
          console.error('标签接口返回数据异常:', res);
        }
      } catch (error) {
        console.error('获取标签失败:', error);
        this.tagOptions = [];
      }
    },

    async handleDelete(id) {
      try {
        await request.delete(`/delete/shortLink/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") }
        });
        this.$message.success('删除成功');

        // 删除后检查当前页是否为空
        if (this.tableData.length === 1 && this.queryParams.pageNum > 1) {
          this.queryParams.pageNum -= 1;
        }
        await this.fetchData();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },

    handleLinkClick(row) {
      if (row.hasPassword) {
        this.currentLink = row;
        this.passwordDialogVisible = true;
      } else {
        this.accessLink(row.fullShortUrl);
      }
    },

    async verifyPassword() {
      try {
        const res = await request.post('/shortLink/verifyPassword', {
          shortLink: this.currentLink.shortUrl,
          password: this.password
        }, {
          headers: { accessToken: localStorage.getItem("accessToken") }
        });

        if (res.data.data) {
          this.accessLink(this.currentLink.fullShortUrl);
          this.passwordDialogVisible = false;
        } else {
          this.$message.error('密码错误');
        }
      } catch (error) {
        this.$message.error('验证失败');
      }
    },

    accessLink(url) {
      window.open(url, '_blank');
      // 记录访问统计
      request.get(`/sparrow/${this.currentLink.shortUrl}`, {
        headers: { accessToken: localStorage.getItem("accessToken") }
      });
    },

    // 显示详情
    handleShowDetail(row) {
      this.activeDetail = { ...row }; // 克隆行数据
    },

    // 保存修改
    async saveDetail() {
      try {
        await this.$refs.detailForm.validate();

        const params = {
          ...this.activeDetail,
          password: this.activeDetail.privateTarget
              ? md5(this.activeDetail.password)
              : undefined
        };

        const res = await request.put('/control/shortLink/update', params);
        if (res.code === 200) {
          this.$message.success('保存成功');
          this.fetchData();
        }
      } catch (error) {
        this.$message.error('保存失败');
      }
    },

    // 重置修改
    resetDetail() {
      this.activeDetail = { ...this.tableData.find(item => item.id === this.activeDetail.id) };
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
        keyword: '',
        tags: [],
        status: null
      };
      this.fetchData();
    }
  }
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

.detail-card {
  position: sticky;
  bottom: 20px;
  background: #fff;
  z-index: 100;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
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