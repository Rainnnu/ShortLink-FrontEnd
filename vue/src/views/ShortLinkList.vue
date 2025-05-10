<!--<template>-->
<!--  <div class="list-container">-->
<!--    &lt;!&ndash; 搜索和操作区 &ndash;&gt;-->
<!--    <div class="operation-bar">-->
<!--      <el-input-->
<!--          v-model="searchQuery"-->
<!--          placeholder="输入短链/原始URL搜索"-->
<!--          clearable-->
<!--          class="search-input"-->
<!--          @clear="handleSearchClear"-->
<!--      >-->
<!--        <template #prefix>-->
<!--          <i class="el-icon-search"></i>-->
<!--        </template>-->
<!--      </el-input>-->

<!--      <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-refresh"-->
<!--          @click="refreshList"-->
<!--      >刷新列表</el-button>-->
<!--    </div>-->

<!--    &lt;!&ndash; 数据表格 &ndash;&gt;-->
<!--    <el-table-->
<!--        :data="pagedLinks"-->
<!--        stripe-->
<!--        border-->
<!--        v-loading="loading"-->
<!--        element-loading-text="正在加载..."-->
<!--        class="data-table"-->
<!--    >-->
<!--      <el-table-column prop="shortUrl" label="短链" sortable width="240">-->
<!--        <template #default="{ row }">-->
<!--          <el-link-->
<!--              type="primary"-->
<!--              :href="row.shortUrl"-->
<!--              target="_blank"-->
<!--              @click.prevent="handleShortLinkClick(row)"-->
<!--          >{{ row.shortUrl }}</el-link>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--          prop="originalUrl"-->
<!--          label="原始URL"-->
<!--          show-overflow-tooltip-->
<!--          width="400"-->
<!--      />-->

<!--      <el-table-column-->
<!--          prop="createdAt"-->
<!--          label="创建时间"-->
<!--          sortable-->
<!--          width="180"-->
<!--          :formatter="formatDate"-->
<!--      />-->

<!--      <el-table-column label="操作" width="180" fixed="right">-->
<!--        <template #default="{ row }">-->
<!--          <el-button-->
<!--              type="primary"-->
<!--              icon="el-icon-view"-->
<!--              @click="showDetail(row)"-->
<!--          >详情</el-button>-->

<!--          <el-popconfirm-->
<!--              title="确认删除该短链吗？"-->
<!--              @confirm="deleteLink(row.id)"-->
<!--          >-->
<!--            <template #reference>-->
<!--              <el-button-->
<!--                  type="danger"-->
<!--                  icon="el-icon-delete"-->
<!--              >删除</el-button>-->
<!--            </template>-->
<!--          </el-popconfirm>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    &lt;!&ndash; 分页 &ndash;&gt;-->
<!--    <el-pagination-->
<!--        background-->
<!--        :current-page="currentPage"-->
<!--        :page-sizes="[10, 20, 50, 100]"-->
<!--        :page-size="pageSize"-->
<!--        :total="filteredLinks.length"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        class="pagination"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import dayjs from 'dayjs';-->
<!--export default {-->
<!--  name: 'ShortLinkList',-->
<!--  data() {-->
<!--    return {-->
<!--      searchQuery: '',-->
<!--      currentPage: 1,-->
<!--      pageSize: 10,-->
<!--      loading: false,-->
<!--      links: [-->
<!--        // 示例数据（建议通过API获取）-->
<!--        {-->
<!--          id: 1,-->
<!--          shortUrl: 'https://s.link/abc123',-->
<!--          originalUrl: 'https://example.com/long-url',-->
<!--          createdAt: '2024-03-01 14:30',-->
<!--          accessCount: 150-->
<!--        }-->
<!--      ]-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    filteredLinks() {-->
<!--      return this.links.filter(link =>-->
<!--          [link.shortUrl, link.originalUrl].some(-->
<!--              text => text.toLowerCase().includes(-->
<!--                  this.searchQuery.toLowerCase()-->
<!--              )-->
<!--          )-->
<!--      )-->
<!--    },-->
<!--    pagedLinks() {-->
<!--      const start = (this.currentPage - 1) * this.pageSize-->
<!--      const end = start + this.pageSize-->
<!--      return this.filteredLinks.slice(start, end)-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    // 格式时间显示-->
<!--    formatDate(row, column, cellValue) {-->
<!--      // 使用day.js库更可靠-->
<!--      return dayjs(cellValue).format('YYYY-MM-DD HH:mm');-->
<!--    },-->
<!--    // 处理分页变化-->
<!--    handleSizeChange(newSize) {-->
<!--      this.pageSize = newSize-->
<!--      this.currentPage = 1-->
<!--    },-->

<!--    handleCurrentChange(newPage) {-->
<!--      this.currentPage = newPage-->
<!--    },-->

<!--    // 刷新列表-->
<!--    async refreshList() {-->
<!--      try {-->
<!--        this.loading = true;-->
<!--        // 模拟API调用-->
<!--        const response = await axios.get('/api/links');-->
<!--        this.links = response.data;-->
<!--      } finally {-->
<!--        this.loading = false;-->
<!--      }-->
<!--    },-->

<!--    // 删除确认-->
<!--    async deleteLink(id) {-->
<!--      try {-->
<!--        await axios.delete(`/api/links/${id}`);-->
<!--        this.links = this.links.filter(link => link.id !== id);-->
<!--        this.$message.success('删除成功');-->
<!--      } catch (error) {-->
<!--        this.$message.error('删除失败');-->
<!--      }-->
<!--    },-->

<!--    // 短链点击处理-->
<!--    handleShortLinkClick(link) {-->
<!--      this.$confirm(`即将跳转到：${link.originalUrl}`, '安全提示', {-->
<!--        confirmButtonText: '继续访问',-->
<!--        cancelButtonText: '取消',-->
<!--        type: 'warning'-->
<!--      }).then(() => {-->
<!--        window.open(link.shortUrl, '_blank')-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.list-container {-->
<!--  padding: 20px;-->
<!--  background: #fff;-->
<!--  border-radius: 8px;-->
<!--}-->

<!--.operation-bar {-->
<!--  display: flex;-->
<!--  gap: 15px;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.search-input {-->
<!--  flex: 1;-->
<!--  max-width: 400px;-->
<!--}-->

<!--.data-table {-->
<!--  margin: 20px 0;-->
<!--}-->

<!--.pagination {-->
<!--  margin-top: 20px;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--.el-button + .el-button {-->
<!--  margin-left: 8px;-->
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
              type="text"
              size="mini"
              @click="showDetail(row)"
          >详情</el-button>

          <el-popconfirm
              title="确认删除该短链吗？"
              @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button
                  type="text"
                  size="mini"
                  style="color: #F56C6C"
              >删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
import axios from 'axios';

export default {
  name: 'ShortLinkList',
  data() {
    return {
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
        const res = await axios.get('/shortLink/list', {
          params: this.queryParams,
          headers: { accessToken: localStorage.getItem("accessToken") }
        });

        if (res.data.code === 0) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchTags() {
      // 调用之前实现的标签查询接口
      const res = await axios.get('/tag/get', {
        headers: { accessToken: localStorage.getItem("accessToken") }
      });
      this.tagOptions = res.data.data || [];
    },

    async handleDelete(id) {
      try {
        await axios.delete(`/delete/shortLink/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") }
        });
        this.$message.success('删除成功');
        this.fetchData();
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
        const res = await axios.post('/shortLink/verifyPassword', {
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
      axios.get(`/sparrow/${this.currentLink.shortUrl}`, {
        headers: { accessToken: localStorage.getItem("accessToken") }
      });
    },

    handleSizeChange(val) {
      this.queryParams.pageSize = val;
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

/*::v-deep .el-table__row td {*/
/*  vertical-align: top;*/
/*}*/
</style>