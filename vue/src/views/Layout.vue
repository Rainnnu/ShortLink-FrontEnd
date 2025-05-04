<template>
  <div>
    <el-container>
      <el-header style="background-color: #303133">
        <span
          style="
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            color: #c0c4cc;
            margin-top: 10px;
          "
          >麻雀短链</span
        >
      </el-header>

      <el-container>
        <el-aside
          style="
            overflow: hidden;
            min-height: 100vh;
            background-color: #545c64;
            width: 200px;
          "
        >
          <el-menu
            default-active="$route.path"
            router
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/create">
              <span slot="title">创建短链</span>
            </el-menu-item>

            <el-menu-item index="/list">
              <span slot="title">短链列表</span>
            </el-menu-item>

            <el-menu-item index="/detail">
              <span slot="title">短链管理</span>
            </el-menu-item>

            <el-menu-item index="/user">
              <span slot="title">我的信息</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Layout",
};
</script>

<style scoped>
.el-menu {
  border-right: none !important;
}
</style>
