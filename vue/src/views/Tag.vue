<template>
  <div class="tag-management">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="showCreateDialog">新建标签</el-button>
      <el-button type="danger" @click="batchDelete" :disabled="selectedIds.length === 0">批量删除</el-button>
    </div>

    <!-- 标签表格 -->
    <el-table
        :data="tagList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="标签名称"></el-table-column>
      <el-table-column prop="color" label="颜色">
        <template #default="{row}">
          <div class="color-block" :style="{backgroundColor: row.color}"></div>
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" label="创建人"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="currentTag" :rules="rules" ref="tagForm">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="currentTag.name"></el-input>
        </el-form-item>
        <el-form-item label="父类ID" prop="parentId">
          <el-input v-model="currentTag.parentId"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="currentTag.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="创建人" prop="createdBy">
          <el-input v-model="currentTag.createdBy"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tagList: [],
      selectedIds: [],
      dialogVisible: false,
      dialogType: 'create',
      currentTag: {
        name: '',
        parentId: '',
        color: '#409EFF',
        createdBy: ''
      },
      rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        createdBy: [{ required: true, message: '请输入创建人', trigger: 'blur' }]
      }
    };
  },
  computed: {
    dialogTitle() {
      return this.dialogType === 'create' ? '新建标签' : '编辑标签';
    }
  },
  created() {
    this.fetchTags();
  },
  methods: {
    async fetchTags() {
      try {
        const res = await axios.get('/tag/get', {
          params: { userId: localStorage.getItem("userId") },
          headers: { accessToken: localStorage.getItem('accessToken') }
        });
        this.tagList = res.data.data;
      } catch (error) {
        this.$message.error('获取标签失败');
      }
    },

    showCreateDialog() {
      this.dialogType = 'create';
      this.currentTag = {
        name: '',
        parentId: '',
        color: '#409EFF',
        createdBy: ''
      };
      this.dialogVisible = true;
    },

    handleEdit(row) {
      this.dialogType = 'edit';
      this.currentTag = { ...row };
      this.dialogVisible = true;
    },

    async submitForm() {
      this.$refs.tagForm.validate(async valid => {
        if (valid) {
          try {
            if (this.dialogType === 'create') {
              await axios.post('/tag/create', this.currentTag, {
                headers: { accessToken: localStorage.getItem('accessToken') }
              });
            } else {
              await axios.put('/tag/modify', this.currentTag, {
                params: { id: this.currentTag.id },
                headers: { accessToken: localStorage.getItem('accessToken') }
              });
            }
            this.$message.success('操作成功');
            this.dialogVisible = false;
            this.fetchTags();
          } catch (error) {
            this.$message.error('操作失败');
          }
        }
      });
    },

    async handleDelete(id) {
      try {
        await axios.put('/tag/delete', null, {
          params: { id, userId: '当前用户ID' },
          headers: { accessToken: localStorage.getItem('accessToken') }
        });
        this.$message.success('删除成功');
        this.fetchTags();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },

    async batchDelete() {
      try {
        await axios.put('/tag/deletes', null, {
          params: { ids: this.selectedIds, userId: '当前用户ID' },
          headers: { accessToken: localStorage.getItem('accessToken') }
        });
        this.$message.success('批量删除成功');
        this.fetchTags();
        this.selectedIds = [];
      } catch (error) {
        this.$message.error('批量删除失败');
      }
    },

    handleSelectionChange(selection) {
      this.selectedIds = selection.map(item => item.id);
    }
  }
};
</script>

<style>
.color-block {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.operation-bar {
  margin-bottom: 20px;
}
</style>