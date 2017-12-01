'use strict';

const Rpc = require('../index');

const port = 9988;

const rpc = new Rpc();

const math = {
    add(a, b, callback) {
        callback(a + b);
    },
    minus(a, b, callback) {
        callback(a - b)
    }
}

const log = {
    name(name, callback) {
        callback(`name: ${name}`)
    },
    age(age, callback) {
        callback(`age: ${age}`)
    }
}

rpc.register('math', math);
rpc.register('log', log);

rpc.listen(port, () => {
    console.log(`server listen on port ${port}`);
});