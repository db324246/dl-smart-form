<template>
  <div class="page-container">
    <header class="page-header">
      <router-link to="/">首页</router-link>
      <ul class="page-nav">
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
.page-container {
  min-height: 100vh;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  height: 50px;
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
  height: calc(100% - 50px);
  padding: 0 10px 20px;
}
</style>
