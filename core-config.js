exports.dev = {
  host: 'localhost',
  port: 3324,

  // 开发模式下 API 请求的后端地址
  apiHost: 'https://account.console.baishan.com',
}

exports.prod = {
  apiHost: '//usercenter-api.console.baishan.com',
  publicUrl: `//usercenter.console.baishan.com/`, // 资源请求的公共路径
}
