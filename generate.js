'use strict'

const rpcDaemon = require('@xolentum/xolentum-rpc-js').RPCDaemon
const fs = require('fs')

// Choose the steps
const step = 2500

// Output format for https://github.com/xolentum/xolentum/blob/master/src/checkpoints/checkpoints.cpp#L190
// ADD_CHECKPOINT(0, "8e9a672e45ccec5e20860cbfebc225310364d648dc87561a095d80a15cfc25d4");

async function getData () {
  try {
    const daemonClient = rpcDaemon.createDaemonClient({
      url: 'http://127.0.0.1:6969'
    })
    // When using a self signed certificate with HTTPS you need to set the function sslRejectUnauthorized to false.
    daemonClient.sslRejectUnauthorized(false)

    const writeStream = fs.createWriteStream('checkpoints.txt')

    // get actual blockchain height
    const info = await daemonClient.getInfo()
    const height = info.height
    // Loop in steps to get block_hash
    for (var i = 0; i < height; i += step) {
      const block = await daemonClient.getBlockHeaderByHeight({ height: i })
      writeStream.write(`ADD_CHECKPOINT(${i}, "${block.block_header.hash}");\n`, 'utf8')
      console.log(`ADD_CHECKPOINT(${i}, "${block.block_header.hash}");`)
    }
    writeStream.end()
  } catch (error) {
    console.error(error)
  }
}

getData()
