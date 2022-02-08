import { validatenull } from '@/utils/validate'
// 自定义时间格式过滤
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (time instanceof Date) {
    date = time
  } else if (typeof time === 'number' && ('' + time).length >= 10) {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  } else if (typeof time === 'string' && /[-\/]/.test(time)) {
    date = new Date(time.replace(/-/g, '/'))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 最近时间过滤
export function formatTime(time, option) {
  if (!time) return '未知'
  let _time
  let d
  if (typeof time === 'string' && /[-\/]/.test(time)) {
    _time = time
    d = new Date(_time)
  } else if (typeof time === 'number' && ('' + time).length >= 10) {
    if (('' + time).length === 10) _time = parseInt(time) * 1000
    d = new Date(_time)
  } else if (time instanceof Date) {
    d = time
  }
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 获取周一 ，周日的日期
export function getWeekDaTa(time) {
  if (!(time instanceof Date)) {
    return new Error('Variables must be of a Date')
  }

  const nowTime = time.getTime()
  const day = time.getDay() || 7
  const oneDayTime = 24 * 60 * 60 * 1000
  const MondayTime = nowTime - (day - 1) * oneDayTime // 显示周一
  const SundayTime = nowTime + (7 - day) * oneDayTime // 显示周日
  return [new Date(MondayTime), new Date(SundayTime)]
}

// 获取周一到周日的日期
export function getWeekDays(time) {
  if (!(time instanceof Date)) {
    return new Error('Variables must be of a Date')
  }

  const nowTime = time.getTime()
  const day = time.getDay() || 7
  const oneDayTime = 24 * 60 * 60 * 1000
  const MondayTime = nowTime - (day - 1) * oneDayTime // 显示周一
  const TuesdayTime = nowTime - (day - 2) * oneDayTime // 显示周二
  const WednesdayTime = nowTime - (day - 3) * oneDayTime // 显示周三
  const ThursdayTime = nowTime - (day - 4) * oneDayTime // 显示周四
  const FridayTime = nowTime - (day - 5) * oneDayTime // 显示周五
  const SaturdayTime = nowTime - (day - 6) * oneDayTime // 显示周六
  const SundayTime = nowTime + (7 - day) * oneDayTime // 显示周日
  return [
    parseTime(new Date(MondayTime), '{y}-{m}-{d}'),
    parseTime(new Date(TuesdayTime), '{y}-{m}-{d}'),
    parseTime(new Date(WednesdayTime), '{y}-{m}-{d}'),
    parseTime(new Date(ThursdayTime), '{y}-{m}-{d}'),
    parseTime(new Date(FridayTime), '{y}-{m}-{d}'),
    parseTime(new Date(SaturdayTime), '{y}-{m}-{d}'),
    parseTime(new Date(SundayTime), '{y}-{m}-{d}')
  ]
}

// 获取本月开始与结束的日期
export function getMonthData(time) {
  if (!(time instanceof Date)) {
    return new Error('Variables must be of a Date')
  }

  const nowMonth = time.getMonth(); // 当前月
  const nowYear = time.getFullYear(); // 当前年
  const monthStartDate = new Date(nowYear, nowMonth, 1); // 本月的开始时间
  const monthEndDate = new Date(nowYear, nowMonth + 1, 0); // 本月的结束时间

  return [monthStartDate, monthEndDate]
}

// 返回地址栏中的参数对象
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

// html 文本转化成 text
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

// 节流函数
export function throttle(fn, time) {
  let timer
  const interval = time || 200
  return function() {
    if (timer) return

    fn.call(this, ...arguments)
    timer = setTimeout(function() {
      clearTimeout(timer)
      timer = null
    }, interval)
  }
}

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func.call(this, ...arguments)
    }, wait)
  }
}

// 深度克隆
export function deepClone(source) {
  if (!source || typeof source !== 'object') {
    return source
    // throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * json数组对象 根据唯一值去重
 * @param {Array} array 需要去重的数组
 * @param {String} key  根据key字段去重
 */
export function uniqueArray(array, key) {
  if (!key) throw Error('key is required')
  const result = []
  for (let i = 1; i < array.length; i++) {
    const item = array[i]
    let repeat = false
    for (let j = 0; j < result.length; j++) {
      if (item[key] === result[j][key]) {
        repeat = true
        break
      }
    }
    if (!repeat) {
      result.push(item);
    }
  }
  return result
}

/**
 * 将list装换成tree
 * @param {Object} tolist list集合
 * @param {String} myId  数据主键id
 * @param {String} pId     数据关联的父级id
 * @param {String} sortId  排序id，可为空
 */
export function listToTree(tolist, myId, pId, sortId) {
  var list = tolist
  if (arguments.length >= 4 && sortId) {
    list = tolist.sort((a, b) => {
      const as = a[sortId] ? parseInt(a[sortId]) : 0
      const bs = b[sortId] ? parseInt(b[sortId]) : 0
      return as - bs
    })
  }
  function exists(list, parentId) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][myId] === parentId) return true
      }
      return false
  }
  var nodes = []
  // get the top level nodes
  for (var i = 0; i < list.length; i++) {
      var row = list[i]
      if (!exists(list, row[pId])) {
        nodes.push(row)
      }
  }
  var toDo = []
  for (let i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i])
  }
  while (toDo.length) {
      var node = toDo.shift() // the parent node
      // get the children nodes
      for (let i = 0; i < list.length; i++) {
        const row = list[i]
        if (row[pId] === node[myId]) {
            // var child = {id:row.id,text:row.name};
            if (node.children) {
              node.children.push(row)
            } else {
              node.children = [row]
            }
            toDo.push(row)
        }
      }
  }
  return nodes
}

/**
 * 生成一个用不重复的ID， 时间戳+随机数
 */
export function GenNonDuplicateID(randomLength = 6) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}

/**
 * 生成一个uuid
 */
export function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

/**
 * 将一个子项为object类型的数组 转为 对象类型的
 */
export function genObjListToObject(list, rules, separator = ',') {
  var o = {}
  Object.keys(rules).forEach(key => {
    o[rules[key]] = list.map(item => {
      return item[key]
    })
    o[rules[key]] = o[rules[key]].join(separator)
  })
  return o
}

/**
 * 将一个object属性值为字符串的对象{ids: '1,2', names: 'john,tom'} 转为 数组 如[{id: 1, name: 'john'},{id: 2, name: 'tom'}]
 * params obj [object] 如： {ids: '1,2', names: 'john,tom'}
 * params rules [object] 如： {ids: 'id', names: 'name'}
 * params separator [string] 如： ,
 * return [array] 如：[{id: 1, name: 'john'},{id: 2, name: 'tom'}]
 */
export function genObjStringToList(obj, rules, separator = ',') {
  var arr = []
  var arrLength = 0
  var o = {}
  Object.keys(rules).forEach(key => {
    if (!arrLength) {
      arrLength = obj[key].split(separator).length
      for (var i = 0; i < arrLength; i++) {
        arr.push({})
      }
    }
    o[key] = obj[key].split(separator)
  })
  Object.keys(o).forEach(key => {
    o[key].forEach((item, index) => {
      arr[index][rules[key]] = item
    })
  })
  return arr
}

// 空值的页面的显示
export function nullRenderStyle(data) {
  if (data === undefined) {
    return '-';
  } else {
    return data;
  }
}

/**
 * 将对象属性空字符串或空数组转为null
 */
export function emptyToNull(data) {
  for (var key in data) {
    data[key] = validatenull(data[key]) ? null : data[key]
  }
  return data
}

/**
 * 获取2个时间的相对时间
 */
export function getRelativeTime(beforeTime, afterTime) {
  function GetDateStr(AddDayCount) {
    var dd = new Date()
    dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1 // 获取当前月份的日期
    var d = dd.getDate()
    return y + '-' + m + '-' + d + ' 00:00:00'
  }
  var beforeTimeStamp = new Date(beforeTime.replace(/-/g, '/')).getTime()
  var afterTimeStamp = afterTime ? new Date(afterTime.replace(/-/g, '/')).getTime() : new Date().getTime();
  var returnStr = ''
  // 转换为标准时间
  var beforeStandard = new Date(beforeTime.replace(/-/g, '/'))
  // 转换为标准时间
  var afterStandard = afterTime ? new Date(afterTime.replace(/-/g, '/')) : new Date();
  var yearAfter = afterStandard.getFullYear()
  var dayAfter = afterStandard.getDate()
  var hoursAfer = afterStandard.getHours()
//   var minutesAfter = afterStandard.getMinutes()
  // 获取昨天0点的时间戳
  var YesterdayTimeStamp = new Date(GetDateStr(-1).replace(/-/g, '/')).getTime()
  // console.log(YesterdayTimeStamp)
  var year = beforeStandard.getFullYear()
  var month = beforeStandard.getMonth() + 1
  var day = beforeStandard.getDate()
  var hours = beforeStandard.getHours()
  var minutes = beforeStandard.getMinutes()
  if (month < 10) {
    month = '0' + month;
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (yearAfter - year === 0) { // 如果跨年的话就显示年份
    if (YesterdayTimeStamp - beforeTimeStamp > 0) { // 时间为昨天以前
      // returnStr = month + '月' + day + '日'
      returnStr = month + '-' + day
    } else {
      if (dayAfter - day === 0) {
        if (afterTimeStamp - beforeTimeStamp >= 60 * 60 * 1000) {
          returnStr = hoursAfer - hours + '小时前'
        } else {
          if (afterTimeStamp - beforeTimeStamp < 60 * 1000) {
            returnStr = '刚刚'
          } else {
            returnStr = Math.round((afterTimeStamp - beforeTimeStamp) / (60 * 1000)) + '分钟前'
          }
        }
        // if (hoursAfer - hours > 0) {
        //   returnStr = hoursAfer - hours + '小时前'
        // } else {
        //   if (minutesAfter - minutes === 0) {
        //     returnStr = '刚刚'
        //   } else {
        //     returnStr = minutesAfter - minutes + '分钟前'
        //   }
        // }
      } else {
        returnStr = '昨天 ' + hours + ':' + minutes;
      }
    }
  } else {
    returnStr = year + '-' + month + '-' + day;
  }
  return returnStr;
}

/**
 * 获取本周、本季度、本月、上月的开端日期、结束日期
 * params type [init] 如：1:本周  2: 本月  3:本季度  4: 上月
 * 返回值数组 [startTime, endTime]  格式yyyy-mm-dd hh:mm:ss
 */
export function getTimeScope(type) {
  var now = new Date() // 当前日期
    var nowDayOfWeek = now.getDay(); // 今天本周的第几天
    var nowDay = now.getDate(); // 当前日
    var nowMonth = now.getMonth(); // 当前月
    var nowYear = now.getYear(); // 当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var lastMonthDate = new Date(); // 上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    // var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();
    // 格局化日期：yyyy-MM-dd
    // var hours = beforeStandard.getHours()
	// var minutes = beforeStandard.getMinutes()
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var myhour = date.getHours();
        var myminutes = date.getMinutes();
        var mySeconds = date.getSeconds();
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        if (myhour < 10) {
          myhour = '0' + myhour;
        }
        if (myminutes < 10) {
          myminutes = '0' + myminutes;
        }
        if (mySeconds < 10) {
          mySeconds = '0' + mySeconds;
        }
        return (myyear + '-' + mymonth + '-' + myweekday + ' ' + myhour + ':' + myminutes + ':' + mySeconds);
    }
    // 获得某月的天数
    function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }
    // 获得本季度的开端月份
    function getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (nowMonth > 2 && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (nowMonth > 5 && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }
    // 获得本周的开端日期
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek, 0, 0, 0);
        return formatDate(weekStartDate);
    }
    // 获得本周的停止日期
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek), 23, 59, 59);
        return formatDate(weekEndDate);
    }
    // 获得本月的开端日期
    function getMonthStartDate() {
        var monthStartDate = new Date(nowYear, nowMonth, 1, 0, 0, 0);
        return formatDate(monthStartDate);
    }
    // 获得本月的停止日期
    function getMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth), 23, 59, 59);
        return formatDate(monthEndDate);
    }
    // 获得上月开端时候
    function getLastMonthStartDate() {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1, 0, 0, 0);
        return formatDate(lastMonthStartDate);
    }
    // 获得上月停止时候
    function getLastMonthEndDate() {
        var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth), 23, 59, 59);
        return formatDate(lastMonthEndDate);
    }
    // 获得本季度的开端日期
    function getQuarterStartDate() {
        var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1, 0, 0, 0);
        return formatDate(quarterStartDate);
    }
    // 或的本季度的停止日期
    function getQuarterEndDate() {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth), 23, 59, 59);
        return formatDate(quarterStartDate);
    }
    var timeList = []
    // 1:本周  2: 本月  3:本季度  4: 上月
    if (type === 1) {
      timeList.push(getWeekStartDate())
      timeList.push(getWeekEndDate())
      return timeList
    } else if (type === 2) { //
      timeList.push(getMonthStartDate())
      timeList.push(getMonthEndDate())
      return timeList
    } else if (type === 3) { //
      timeList.push(getQuarterStartDate())
      timeList.push(getQuarterEndDate())
      return timeList
    } else if (type === 4) { //
      timeList.push(getLastMonthStartDate())
      timeList.push(getLastMonthEndDate())
      return timeList
    } else {
      timeList.push(getWeekStartDate())
      timeList.push(getWeekEndDate())
      return timeList
    }
}

// 转意符换成普通字符
export function escape2Html(str) {
	var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' }
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,
    function(t) { return arrEntities[t] }
  )
}

// 普通字符转换成转意符
export function html2Escape(sHtml) {
  var arrEntities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }
  return sHtml.replace(/[<>&"]/g,
    function(c) { return arrEntities[c] }
  )
}

// 地址栏参数转换成对象
export function param2Obj(url) {
  var params = {};
  var urls = url.split('?');
  if (!urls[1]) return {}
  var arr = urls[1].split('&');
  for (var i = 0, l = arr.length; i < l; i++) {
    var a = arr[i].split('=');
    params[a[0]] = a[1];
  }
  return params;
}

// 异步并发控制
export function requestsLimit(
  list = [],
  limit = 3,
  asyncHandle = () => Promise.resolve()
) {
  return new Promise((r, j) => {
    const _request = list.slice()
    const queue = [] // 任务队列
    const result = [] // 结果队列
    let index = 0
    let abort = false // 中止开关
    if (!_request.length || !limit) return r(result)

    function requestHandler() {
      const item = _request.shift()
      if (!item) return r(result)
      const handler = asyncHandle(item, index++)
      abort = !(handler instanceof Promise)
      if (abort) return
      queue.push(
        handler.then(res => {
            result.push(res)
          })
          .catch(err => {
            result.push(err)
          })
          .finally(() => {
            queue.shift()
            if (_request.length && !abort) {
              requestHandler()
            } else if (!queue.length) {
              abort ? j(result) : r(result)
            }
          })
      )
    }
    for (let i = 0; i < limit; i++) {
      requestHandler()
    }
  })
}

// json.stringify
export function stringify(data, def = '') {
  if (typeof data === 'string') return data
  if (data === null || undefined) return def
  let res = def
  try {
    res = JSON.stringify(data)
  } catch (error) {
    console.log('Stringify error:' + error)
  }
  return res
}

// json.parse
export function parse(str, def = []) {
  if (!str) return def
  if (typeof str !== 'string') return str
  let res = def
  try {
    res = JSON.parse(str)
  } catch (error) {
    console.log('parse error:' + error)
  }
  return res
}

// 移除对象的属性的空值 如 null, undefined
export function removeNullProperty(target) {
  if (target instanceof FormData) {
    return target
  }
  if (Array.isArray(target)) return deepClone(target)
  const res = {}
  for (const key in target) {
    const value = Reflect.get(target, key)

    if (value !== null && value !== undefined) {
      Reflect.set(res, key, deepClone(value))
    }
  }
  return res
}

// 返回变量的数据类型
export function typeOf(data) {
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()
}

/**
 * 在对象已有的属性上覆盖数据
 * 参数 target, source1, source2...
 * @returns Object
 */
export function objectMergeByOwnProperty() {
  let result = arguments[0]
  const sourceArr = Array.prototype.slice.call(arguments, 1)

  const merge = function(target, source) {
    const res = {}

    Object.keys(target).forEach(property => {
      const targetProperty = target[property]

      if (source.hasOwnProperty(property)) {
        const sourceProperty = source[property]
        if (Object.prototype.toString.call(targetProperty) === '[object Object]') {
          res[property] = objectMergeByOwnProperty(targetProperty, sourceProperty)
        } else {
          res[property] = sourceProperty
        }
      } else {
        res[property] = targetProperty
      }
    })
    return res
  }

  const len = sourceArr.length
  for (let i = 0; i < len; i++) {
    result = merge(result, sourceArr[i])
  }

  return result
}

// 判断客户端类型
export function browserEnvSniff() {
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
    return 'mobile';
  } else if (os.isTablet) {
    return 'plate';
  } else if (os.isPc) {
    return 'pc'
  } else {
    return -1
  }
}

// 通过 a 链接导出下载
export function downloadByLink(url, name) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.target = '_blank'
  link.href = url
  link.download = name // 下载的文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
