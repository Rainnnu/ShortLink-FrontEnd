<template>
  <div class="tag-management">
    <!-- 操作工具栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="showCreateDialog">新建标签</el-button>
      <el-button
        type="danger"
        @click="batchDelete"
        :disabled="selectedIds.length === 0"
        >批量删除</el-button
      >
    </div>

    <!-- 标签表格 -->
    <el-table
      :data="tagList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="标签名称"></el-table-column>
      <el-table-column
        prop="parentId"
        label="父类ID"
        width="100"
      ></el-table-column>
      <el-table-column prop="color" label="颜色" width="120">
        <template #default="{ row }">
          <div
            class="color-block"
            :style="{ backgroundColor: row.color || '#409EFF' }"
          ></div>
          <span style="margin-left: 8px">{{ row.color }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form :model="currentTag" :rules="rules" ref="tagForm">
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="currentTag.name"
            placeholder="请输入标签名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="父类ID" prop="parentId">
          <el-input
            v-model.number="currentTag.parentId"
            type="number"
            placeholder="请输入父类ID"
            min="1"
          ></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker
            v-model="currentTag.color"
            :predefine="predefineColors"
            :show-alpha="false"
          ></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      tagList: [],
      selectedIds: [],
      dialogVisible: false,
      dialogType: "create",
      loading: false,
      submitting: false,
      currentTag: {
        name: "",
        parentId: null,
        color: "#409EFF",
      },
      predefineColors: [
        "#409EFF",
        "#67C23A",
        "#E6A23C",
        "#F56C6C",
        "#909399",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#8a2be2",
        "#ff1493",
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF",
      ],
      rules: {
        name: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
          { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value && value.trim() === "") {
                callback(new Error("标签名称不能全是空格"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        parentId: [
          {
            validator: (rule, value, callback) => {
              if (value === null || value === "" || !isNaN(value)) {
                callback();
              } else {
                callback(new Error("必须为数字值"));
              }
            },
            trigger: "blur",
          },
        ],
        color: [
          {
            pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            message: "颜色格式必须为十六进制(如#FFFFFF)",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      return this.dialogType === "create" ? "新建标签" : "编辑标签";
    },
  },
  created() {
    this.fetchTags();
  },
  methods: {
    async fetchTags() {
      this.loading = true;
      try {
        const res = await request.get("/tag/get");
        if (res.code === 200) {
          this.tagList = res.data || [];

          console.log(this.tagList);
        } else {
          this.$message.error(res.msg || "获取标签失败");
        }
      } catch (error) {
        console.error("获取标签失败:", error);
        this.$message.error("获取标签失败，请检查网络连接");
      } finally {
        this.loading = false;
      }
    },

    showCreateDialog() {
      this.dialogType = "create";
      this.currentTag = {
        name: "",
        parentId: null,
        color: "#409EFF",
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.tagForm && this.$refs.tagForm.clearValidate();
      });
    },

    handleEdit(row) {
      this.dialogType = "edit";
      this.currentTag = {
        ...row,
        parentId: row.parentId ? Number(row.parentId) : null,
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.tagForm && this.$refs.tagForm.clearValidate();
      });
    },

    async submitForm() {
      this.$refs.tagForm.validate(async (valid) => {
        if (!valid) return;

        this.submitting = true;
        try {
          // 准备请求数据
          const requestData = {
            name: this.currentTag.name.trim(),
            color: this.currentTag.color || "#409EFF",
            ...(this.currentTag.parentId !== null && {
              parentId: Number(this.currentTag.parentId),
            }),
          };

          if (this.dialogType === "create") {
            const res = await request.post("/tag/create", requestData);
            this.handleResponse(res, "创建");
          } else {
            const res = await request.put(
              `/tag/modify?id=${this.currentTag.id}`,
              requestData
            );
            this.handleResponse(res, "修改");
          }
        } catch (error) {
          console.error("操作失败:", error);
          if (error.response) {
            this.$message.error(
              `服务器错误: ${error.response.data.msg || error.response.status}`
            );
          } else if (error.request) {
            this.$message.error("请求超时，请检查网络连接");
          } else {
            this.$message.error("操作失败，请重试");
          }
        } finally {
          this.submitting = false;
        }
      });
    },

    handleResponse(res, action) {
      if (res.code === 200) {
        this.$message.success(`${action}成功`);
        this.dialogVisible = false;
        this.fetchTags();
      } else {
        this.$message.error(res.msg || `${action}失败`);
      }
    },

    handleDelete(id) {
      this.$confirm("确定要删除该标签吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await request.put(`/tag/delete?id=${id}`);
            if (res.code === 200) {
              this.$message.success("删除成功");
              this.fetchTags();
            } else {
              this.$message.error(res.msg || "删除失败");
            }
          } catch (error) {
            console.error("删除失败:", error);
            this.$message.error("删除失败，请重试");
          }
        })
        .catch(() => {});
    },

    batchDelete() {
      if (this.selectedIds.length === 0) return;

      this.$confirm(
        `确定要删除选中的${this.selectedIds.length}个标签吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          // 创建URLSearchParams对象
          const params = new URLSearchParams();

          // 添加多个同名参数（Spring会自动接收为List）
          this.selectedIds.forEach((id) => params.append("ids", id));
          request
            .put(`/tag/deletes?${params.toString()}`)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success(
                  `成功删除${this.selectedIds.length}个标签`
                );
                this.selectedIds = [];
                this.fetchTags();
              } else {
                this.$message.error(res.msg || "批量删除失败");
              }
            })
            .catch((error) => {
              console.error("批量删除失败:", error);
              this.$message.error("批量删除失败，请重试");
            });
        })
        .catch(() => {
          console.log("用户取消了删除操作");
        });
    },

    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
    },

    resetForm() {
      this.$refs.tagForm && this.$refs.tagForm.resetFields();
    },
  },
};
</script>

<style scoped>
.tag-management {
  padding: 20px;
}

.color-block {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  vertical-align: middle;
}

.operation-bar {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}
</style>
