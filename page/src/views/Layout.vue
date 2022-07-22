<template>
  <div class="page-container">
    <header class="page-header">
      <router-link to="/">
        <span v-if="$route.name === 'home'" class="app-title">SmartForm</span>
        <img v-else class="app-logo" :src="require('@/assets/logo.png')" alt="SmartForm" title="SmartForm">
      </router-link>
      <ul class="page-nav">
        <li><router-link to="/doc">文档</router-link></li>
        <li><router-link to="/create">创建表单</router-link></li>
        <li><router-link to="/report">填报表单</router-link></li>
        <li><router-link to="/detail">详情展示</router-link></li>
      </ul>
    </header>
    <div class="page-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  height: 50px;
  border-bottom: 1px solid #eee;
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
.page-header a {
  color: #304455;
  margin-left: 20px;
  text-decoration: none;
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
