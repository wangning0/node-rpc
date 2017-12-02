'use strict';

const rpc = require('../index');
const server_port = 9988;

rpc.connect(server_port, 'localhost', (remote, conn) => {
    remote.call('math.add', 1, 2, (result) => {
        console.log(`rpc: [math.add] result: ${result}`);
    })
    remote.call('math.minus', 3, 2, (result) => {
        console.log(`rpc: [math.minus] result: ${result}`);
    })
    remote.call('log.name', 'wangning', (result) => {
        console.log(`rpc: [log.name] result: ${result}`);
    })
    remote.call('log.age', 20, (result) => {
        console.log(`rpc: [log.age] result: ${result}`);
    })
})