
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  webpack: {
    alias: {
       // @映射src路径
      '@': resolve('src'),
      '@components': resolve('src/components'),
      '@views': resolve('src/views')
    }
  }
}