/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
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
