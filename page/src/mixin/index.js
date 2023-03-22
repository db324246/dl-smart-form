export default {
  data() {
    return {
      isMobile: false
    }
  },
  created() {
    this.isMobile = this.browserEnvSniff()
    const handler = this.handleSize.bind(this)
    window.addEventListener('resize', handler)
    this.$on('hook:destroyed', () => {
      window.removeEventListener('resize', handler)
    })
  },
  methods: {
    handleSize() {
      this.isMobile = this.browserEnvSniff()
    },
    browserEnvSniff() {
      const os = (function() {
        const ua = navigator.userAgent
        const isWindowsPhone = /(?:Windows Phone)/.test(ua)
        const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
        const isAndroid = /(?:Android)/.test(ua)
        const isFireFox = /(?:Firefox)/.test(ua)
        const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
        const isPhone = /(?:iPhone)/.test(ua) && !isTablet
        const isPc = !isPhone && !isAndroid && !isSymbian && !isTablet
        return {
          isTablet: isTablet,
          isPhone: isPhone,
          isAndroid: isAndroid,
          isPc: isPc
        }
      }())

      if (os.isAndroid || os.isPhone) {
        return true;
      } else if (os.isTablet) {
        return true;
      } else if (os.isPc) {
        return false
      } else {
        return false
      }
    }
  }
}
