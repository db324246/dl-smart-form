<template>
  <div ref="readme" class='readme_container'>
    <div v-html="value"></div>
  </div>
</template>

<script>
export default {
  name: 'read-me',
  props: {
    value: {
      type: String
    }
  },
  mounted() {
    const doc = this.$refs.readme.querySelectorAll('table')
    for (const item of doc) {
      item.setAttribute('border', 0)
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.readme_container {
  padding: 20px 20px 50px;
}
::v-deep .card {
  margin-bottom: 40Px;
  padding: 24Px;
  background-color: #fff;
  border-radius: 5Px;
  box-shadow: 0 0 10px 5Px #ebedf0;
  h3 {
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 18px;
  }
}
::v-deep .essay-link {
  color: #4994df;
  text-decoration: none;
  &:hover {
    color: #48a6fc;
  }
}
::v-deep .essay-heading {
  font-weight: 400;
  color: #1f2f3d;
  &::after {
    background-color: #fff;
  }
}
::v-deep .essay-image img {
  max-width: 800px;
}
::v-deep .essay-table {
  width: 100%;
  margin-bottom: 45px;
  th {
    padding: 15px;
    color: #909399;
    font-weight: 400;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid #dcdfe6;
    background-color: transparent !important;
  }
  td {
    padding: 15px;
    color: #606266;
    border-bottom: 1px solid #dcdfe6
  }
}
::v-deep .essay-paragraph {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}
::v-deep .essay-code {
  padding: 18px 24px;
  margin-bottom: 25px;
  background-color: #fafafa;
  border: 1px solid #eaeefb;
  border-radius: 4px;
  code {
    padding: 0;
    margin: 0;
    color: #58727e;
    font-size: 14px;
    line-height: 22px;
    font-family: 'Source Code Pro', 'Monaco', 'Inconsolata', monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
    -webkit-font-smoothing: auto;
  }
}
::v-deep .readme-img {
  display: block;
  margin: 40px auto;
  max-height: 500px;
  max-width: 800px;
  cursor: zoom-in;
}
</style>
