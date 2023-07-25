import i18n from './i18n'

export type Lang = 'zh_CN' | 'en_US'

let language = window.localStorage.getItem('language') || 'zh_CN'

if (!language) {
  language = 'zh_CN'
  window.localStorage.setItem('language', 'zh_CN')
}

export default i18n[language as Lang]
