/* eslint-disable */
const http = require('http') // 启动服务
const createHandler = require('github-webpack-handler') // github 钩子插件
const handler = createHandler({ path: '/', secret: 'root'}) // 配置钩子插件

// 执行命令行函数
function run_cmd(cmd, args, callback) {
  let spawn = require('child_process').spawn // 创建异步进程
  let child = spawn(cmd, args) // 传入 命令行代码 执行
  let resp = ''

  child.stdout.on('data', (buffer) => {
    resp += buffer.toString()
    console.log(resp)
  })

  child.stdout.on('end', () => {
    callback(resp)
  })
}

// 创建服务 监听8080端口
http.createServer((req, res) => {
  // 调用GitHub钩子的方法
  handler(req, res, (err) => {
    // 错误回调，状态为404
    res.statusCode = 404
    // 页面输出 404
    res.end('404')
  })
}).listen(8080)

// 如果执行错误
handler.on('error', (err) => {
  console.log('输出错误信息', err.message)
})
// GitHub的push事件监听
handler.on('push', (event) => {
  console.log('github的push事件 %s to %s', event.payload.repository.name, event.payload.ref)
  // 执行cmd
  run_cmd('sh', ['./deploy.sh', event.payload.repository.name], function(text){ console.log(text) });
})