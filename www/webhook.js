/* eslint-disable */
const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler({ path: '/', secret: ''})

function run_cmd(cmd, args, callback) {
  const spawn = require('child_process').spawn
  const child = spawn(cmd, args)
  let resp = ""

  child.stdout.on('data', function(buffer) {
    resp += buffer.toString()
  })

  child.stdout.on('end', function() {
    callback(resp)
  })
}

http.createServer(function(req, res) {
  handler(req, res, function(err) {
    res.statusCode = 404
    res.end('createServer', err)
  })
}).listen(8080)

handler.on('error', function(err) {
  console.error('handler', err)
})

handler.on('push', function(event) {
  console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)
  run_cmd('sh', ['./deploy.sh', event.payload.repository.name], function(text){ 
    console.log(text) 
  });
})

