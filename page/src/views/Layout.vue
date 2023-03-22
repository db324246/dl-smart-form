<template>
  <div class="page-container">
    <header class="page-header" :class="{
      'mobile-header': this.isMobile
    }">
      <router-link to="/" class="link-a">
        <span v-if="$route.name === 'home'" class="app-title">SmartForm</span>
        <img v-else class="app-logo" :src="require('@/assets/logo.png')" alt="SmartForm" title="SmartForm">
      </router-link>
      <el-dropdown v-if="isMobile" trigger="click">
        <i class="el-icon-menu"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><router-link class="link-a" to="/doc">文档</router-link></el-dropdown-item>
          <!-- <el-dropdown-item><router-link class="link-a" to="/create">创建表单</router-link></el-dropdown-item> -->
          <el-dropdown-item><router-link class="link-a" to="/report">填报表单</router-link></el-dropdown-item>
          <el-dropdown-item><router-link class="link-a" to="/detail">详情展示</router-link></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <ul v-else class="page-nav">
        <li><router-link class="link-a" to="/doc">文档</router-link></li>
        <li><router-link class="link-a" to="/create">创建表单</router-link></li>
        <li><router-link class="link-a" to="/report">填报表单</router-link></li>
        <li><router-link class="link-a" to="/detail">详情展示</router-link></li>
      </ul>
    </header>
    <div class="page-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  height: 50px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}
.app-logo {
  vertical-align: middle;
  height: 45px;
}
.app-title {
  font-size: 28px;
  line-height: 40px;
  color: #273849;
  font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
}
.link-a {
  color: #304455;
  text-decoration: none;
}
.page-header a {
  margin-left: 20px;
}
.mobile-header {
  padding: 0 10px;
  .el-icon-menu {
    font-size: 22px;
  }
  a {
    margin-left: 0;
  }
}
.page-nav {
  display: flex;
  align-items: center;
  list-style: none;
}
.page-body {
  min-height: calc(100vh - 50px);
}
</style>
