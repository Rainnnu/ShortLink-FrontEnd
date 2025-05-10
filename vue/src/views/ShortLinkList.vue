<template>
  <div class="list-container">
    <!-- 搜索和操作区 -->
    <div class="operation-bar">
      <el-input
          v-model="searchQuery"
          placeholder="输入短链/原始URL搜索"
          clearable
          class="search-input"
          @clear="handleSearchClear"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>

      <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="refreshList"
      >刷新列表</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
        :data="pagedLinks"
        stripe
        border
        v-loading="loading"
        element-loading-text="正在加载..."
        class="data-table"
    >
      <el-table-column prop="shortUrl" label="短链" sortable width="240">
        <template #default="{ row }">
          <el-link
              type="primary"
              :href="row.shortUrl"
              target="_blank"
              @click.prevent="handleShortLinkClick(row)"
          >{{ row.shortUrl }}</el-link>
        </template>
      </el-table-column>

      <el-table-column
          prop="originalUrl"
          label="原始URL"
          show-overflow-tooltip
          width="400"
      />

      <el-table-column
          prop="createdAt"
          label="创建时间"
          sortable
          width="180"
          :formatter="formatDate"
      />

      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button
              type="primary"
              icon="el-icon-view"
              @click="showDetail(row)"
          >详情</el-button>

          <el-popconfirm
              title="确认删除该短链吗？"
              @confirm="deleteLink(row.id)"
          >
            <template #reference>
              <el-button
                  type="danger"
                  icon="el-icon-delete"
              >删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="filteredLinks.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  name: 'ShortLinkList',
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      loading: false,
      links: [
        // 示例数据（建议通过API获取）
        {
          id: 1,
          shortUrl: 'https://s.link/abc123',
          originalUrl: 'https://example.com/long-url',
          createdAt: '2024-03-01 14:30',
          accessCount: 150
        }
      ]
    }
  },
  computed: {
    filteredLinks() {
      return this.links.filter(link =>
          [link.shortUrl, link.originalUrl].some(
              text => text.toLowerCase().includes(
                  this.searchQuery.toLowerCase()
              )
          )
      )
    },
    pagedLinks() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredLinks.slice(start, end)
    }
  },
  methods: {
    // 格式时间显示
    formatDate(row, column, cellValue) {
      // 使用day.js库更可靠
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm');
    },
    // 处理分页变化
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1
    },

    handleCurrentChange(newPage) {
      this.currentPage = newPage
    },

    // 刷新列表
    async refreshList() {
      try {
        this.loading = true;
        // 模拟API调用
        const response = await axios.get('/api/links');
        this.links = response.data;
      } finally {
        this.loading = false;
      }
    },

    // 删除确认
    async deleteLink(id) {
      try {
        await axios.delete(`/api/links/${id}`);
        this.links = this.links.filter(link => link.id !== id);
        this.$message.success('删除成功');
      } catch (error) {
        this.$message.error('删除失败');
      }
    },

    // 短链点击处理
    handleShortLinkClick(link) {
      this.$confirm(`即将跳转到：${link.originalUrl}`, '安全提示', {
        confirmButtonText: '继续访问',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.open(link.shortUrl, '_blank')
      })
    }
  }
}
</script>

<style scoped>
.list-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.operation-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.data-table {
  margin: 20px 0;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.el-button + .el-button {
  margin-left: 8px;
}
</style>