<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        ref="menu"
        default-active="2"
        class="el-menu-vertical-demo">
        <template v-for="item in docConfig">
          <div :key="item.id" class="meun-title">{{item.title}}</div>
          <el-menu-item :key="route.name" v-for="route in item.children" :index="route.name" @click.native="handleRoute(route.name)">
            <span slot="title">{{route.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { docConfig } from '@/router/docRoutes'
export default {
  data() {
    return {
      docConfig
    }
  },
  mounted() {
    this.$refs.menu.activeIndex = this.$route.name
  },
  methods: {
    handleRoute(path) {
      this.$router.push({
        path: `/doc/${path}`
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 50px);
  padding: 0 10px 20px;
}
.el-aside {
  height: 100%;
  /* border-right: 1px solid #eee; */
}
.el-menu {
  border-right: none;
}
.el-menu-item:focus, .el-menu-item:hover {
  background-color: #fff;
}
.meun-title {
  margin-top: 15px;
  color: #333;
  line-height: 40px;
  height: 40px;
  padding-left: 20px;
  font-weight: 700;
}
</style>
