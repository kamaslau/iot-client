/**
 * 时间区间
 */
const periods = {
  _minute: 60,
  _hour: 3600,
  _day: 86400,
  _week: 604800,
  _month28Days: 2419200,
  _month29Days: 2505600,
  _month: 2592000,
  _month31Days: 2678400,
  _year: 31536000
}

/**
 * 获取当前时间戳
 *
 * 以当前本地语言显示
 *
 * @returns { string }
 */
const getTimeString = (locale: string = process.env.LOCALE ?? 'en-US'): string => {
  return new Date().toLocaleString(locale)
}

export {
  getTimeString,
  periods,
}
