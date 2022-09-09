<template>
  <div id="app">
    <router-link to="/report">
      <van-button type="primary" size="mini">上报</van-button>
    </router-link>
    <router-link to="/detail">
      <van-button type="primary" size="mini">详情</van-button>
    </router-link>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
