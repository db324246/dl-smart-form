<template>
  <div class='home_container'>
    <div class="home-body">
      <div v-if="isMobile" class="mobile-home-box">
        <div class="beijing"></div>
        <img class="app-logo" :src="require('@/assets/logo.png')" alt="SmartForm" title="SmartForm">
        <div class="app-description">
          <h1>自定义表单控件</h1>
          <p>字段拖拽、任意布局、一键生成表单Json</p>
        </div>
      </div>
      <div v-else class="home-box">
        <div class="beijing"></div>
        <div class="position t-50">
          <img class="app-logo" :src="require('@/assets/logo.png')" alt="SmartForm" title="SmartForm">
        </div>
        <div class="position t-200">
          <h1>自定义表单控件</h1>
          <p>字段拖拽、任意布局、一键生成表单Json</p>
        </div>
      </div>
    </div>
    <footer class="home-footer">
      <p>
        <a class="social-icon" href="https://github.com/vuejs/vue" target="_blank" rel="noopener">
          <svg aria-labelledby="simpleicons-github-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-github-icon" lang="en">GitHub icon</title><path fill="#FFFFFF" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>

        </a>
        <a class="social-icon" href="https://twitter.com/vuejs" target="_blank" rel="noopener">
          <svg aria-labelledby="simpleicons-twitter-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-twitter-icon" lang="en">Twitter icon</title><path fill="#FFFFFF" d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path></svg>

        </a>
        <a class="social-icon" href="https://medium.com/the-vue-point" target="_blank" rel="noopener">
          <svg aria-labelledby="simpleicons-medium-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-medium-icon" lang="en">Medium icon</title><path fill="#FFFFFF" d="M2.846 6.36c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403H7.26l5.378 11.795 4.728-11.795H24v.403l-1.917 1.837c-.165.126-.247.333-.213.538v13.5c-.034.204.048.41.213.537l1.87 1.837v.403h-9.41v-.403l1.937-1.882c.19-.19.19-.246.19-.538V7.794l-5.39 13.688h-.727L4.278 7.794v9.174c-.052.386.076.774.347 1.053l2.52 3.06v.402H0v-.403l2.52-3.06c.27-.278.39-.67.326-1.052V6.36z"></path></svg>

        </a>
      </p>
      <p>遵循 <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT 开源协议</a><br>
      Copyright © 2021</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.home_container {
  background: #f5f5f5;
}
.home-body {
  background-color: #fff;
}
.home-box {
  position: relative;
  width: 1000px;
  height: 450px;
  margin: 0 auto;
  padding: 50px 0 100px;
  overflow: hidden;
  // background-color: #fff;
  .position {
    position: absolute;
    z-index: 1;
    left: 50px;
  }
  .t-50 {
    top: 50px;
  }
  .t-200 {
    top: 200px;
  }
  .app-logo {
    width: 600px;
  }
  h1 {
    font-size: 40px;
  }
  p {
    font-size: 20px;
  }
  .beijing {
    position: absolute;
    top: 40px;
    left: 110px;
    height: 500px;
    width: 1000px;
    background: url('~@/assets/create.jpg') no-repeat center;
    background-size: cover;
    opacity: 0.4;
    pointer-events: none;
  }
}
.mobile-home-box {
  position: relative;
  overflow: hidden;
  height: 380px;
  padding: 30px 10px 50px;
  .app-logo {
    position: relative;
    width: 80vw;
    z-index: 1;
  }
  .beijing {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100vw;
    background: url('~@/assets/create.jpg') no-repeat center;
    background-size: cover;
    opacity: 0.4;
    pointer-events: none;
  }
  .app-description {
    position: relative;
    z-index: 1;
    padding-left: 20px;
  }
}
.home-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 40px 0;
  color: #fff;
  text-align: center;
  background-color: #475050;
  .social-icon {
    margin: 0 5px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
  a {
    font-weight: 700;
    color: #fff;
  }
}
</style>
