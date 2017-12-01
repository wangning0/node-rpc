'use strict';

const Rpc = require('../index');
const rpc = new Rpc();
const server_port = 9988;

rpc.connect(server_port, 'localhost', (remote, conn) => {
    remote.call('math.add', 1, 2, (result) => {
        console.log(`[math.add]result: ${result}`);
    })
    remote.call('math.minus', 3, 2, (result) => {
        console.log(`[math.minus]result: ${result}`);
    })
    remote.call('log.name', 'wangning', (result) => {
        console.log(`[log.name]result: ${result}`);
    })
    remote.call('log.age', 20, (result) => {
        console.log(`[log.age]result: ${result}`);
    })

    conn.destroy();
    conn.end();
})