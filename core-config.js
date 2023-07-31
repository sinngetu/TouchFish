exports.dev = {
  host: 'localhost',
  port: 3324,

  // 开发模式下 API 请求的后端地址
  apiHost: 'http://localhost:6464',
}

exports.prod = {
  apiHost: '//localhost:6464',
  publicUrl: `//localhost/`, // 资源请求的公共路径
}
