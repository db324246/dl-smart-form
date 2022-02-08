// 用户名称校验
export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  const reg = /^[a-zA-Z0-9\.\-_@]{1,64}$/
  return reg.test(str)
}

// 密码安全性校验
export function isvalidUserPassword(str) {
  const reg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,20}$/
  return reg.test(str)
}

// 姓名校验
export function isvalidNickName(str) {
  const reg = new RegExp('^([\\u4e00-\\u9fa50-9]{1,20}|[a-zA-Z\\.\\s0-9]{1,20})$')
  return reg.test(str)
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email 邮箱
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * validate phone 手机号
 * @param phone
 * @returns {boolean}
 */
export function validatePhone(phone) {
  const re = /^1[3456789]\d{9}$/
  return re.test(phone)
}

/**
 * validate TelePhone 固定电话 如: 0341-86091234
 * @param TelePhone
 * @returns {boolean}
 */
export function validateTelePhone(phone) {
  const re = /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/
  return re.test(phone)
}

/**
 * validate cardId 身份证号--包含港澳台
 * @param cardId
 * @returns {boolean}
 */
export function validateCardId(cardId) {
  const re1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[Xx])$/
  // 香港身份证
  const re2 = /^[A-Z][0-9]{6}[0−9A]$/
  // 澳门身份证
  const re3 = /^[157][0-9]{6}[0−9]$/
  // 台湾身份证
  const re4 = /^[A-Z][0-9]{9}$/
  return re1.test(cardId) || re2.test(cardId) || re3.test(cardId) || re4.test(cardId)
}

/**
 * validate cardId 军官证、士兵证、文职干部证号码  规则 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
 * @param cardId
 * @returns {boolean}
 */
export function validateOfficersCardId(cardId) {
  const re = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/
  return re.test(cardId)
}

/**
 * validate cardId 港澳身份证   规则： H/M + 10位或6位数字
 * @param cardId
 * @returns {boolean}
 */
export function validateHKCardId(cardId) {
  const re = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
  return re.test(cardId)
}

/**
 * validate cardId 台湾身份证   规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
 * @param cardId
 * @returns {boolean}
 */
export function validateTWCardId(cardId) {
  const re = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
  return re.test(cardId)
}

/**
 * validate cardId 境外永久居住证   规则： 字母加数字2-18位
 * @param cardId
 * @returns {boolean}
 */
export function validateWGCardId(cardId) {
  const re = /^[a-zA-Z0-9]{2,18}$/
  return re.test(cardId)
}

/**
 * validate cardId 护照号   规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
 * @param cardId
 * @returns {boolean}
 */
export function validatePassPortCardId(cardId) {
  const re = /^([a-zA-z]|[0-9]){5,17}$/
  return re.test(cardId)
}

/**
 * validate cardId 户口簿号   规则： 9位数字
 * @param cardId
 * @returns {boolean}
 */
export function validateAccountCardId(cardId) {
  const re = /^\d{9}$/
  return re.test(cardId)
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

/**
 * validate file
 * @param file
 * @returns {boolean}
 */
export function validateFile(file) {
  // 文件大小小于20M
  const isLt20M = file.size / 1024 / 1024 < 20
  return isLt20M
}

/**
 * validate video
 * @param video
 * @returns {boolean}
 */
export function validateVideo(file) {
  // 文件大小小于20M
  const isLt30M = file.size / 1024 / 1024 < 30
  return isLt30M
}

/**
 * validate imgfile
 * @param imgfile
 * @returns {boolean}
 */
export function validateImgfile(imgfile) {
  // 文件大小小于20M
  const isLt20M = imgfile.size / 1024 / 1024 < 20
  const imgTypes = 'image/jpeg;image/gif;image/png;image/svg-xml;image/tiff;application/x-MS-bmp'
  const isImg = (imgTypes.indexOf(imgfile.type) !== -1) && (imgfile.type !== '')
  return isLt20M && isImg
}

/**
 * 判断是否为正整数
 */
export function validatePositiveInteger(num) {
  const reg = /^[1-9][0-9]*$/
  return reg.test(num)
}
