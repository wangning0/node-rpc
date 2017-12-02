const net = require('net');
const { isObject, extend, isString, isFunction, parseServerString, parseClientString } = require('./util');

function Rpc() {
    if(!(this instanceof Rpc != Rpc)) {
        return new Rpc();
    }
    this.registers = {};
    this.clientEvent = {}
}

Rpc.prototype.listen = function(port, callback) {
    const server = net.createServer((socket) => {
        this.socket = socket;
        socket.on('data', handleConnectionData(this))
    })
    this.server = server;
    server.listen(port, callback);
}

Rpc.prototype.register = function(moduleName, module) {
    if(!isObject(module)) {
        console.log('module only support object');
        return;
    }

    if(this.registers[moduleName]) {
        extend(module, this.registers[moduleName]);
    }

    this.registers[moduleName] = module;
}

Rpc.prototype.connect = function(port, host, callback) {
    if(!callback) {
        callback = host;
        host = 'localhost';
    }
    const connection = net.createConnection(port, host);

    connection.setKeepAlive(true);

    this.connection = connection;

    connection.on('data', handleResultData(this));

    callback(this, connection);
}

Rpc.prototype.call = function() {
    // client 端
    const args = [...arguments];
    const callArgs = args.slice(0, args.length - 1);
    this.clientEvent[args[0]] = args.pop();
    this.connection.write(JSON.stringify(callArgs), 'utf8', (err) => {
        if(err){
            console.log('call function error');
        }
    })
}

Rpc.connect = function() {
    const rpc = new Rpc();
    return rpc.connect.apply(rpc, arguments);
}

function handleResultData(rpc) {
    return function(data) {
        const { args, multi } = parseClientString(data.toString())
        if(!multi) {
            handleResult(rpc, args)
        } else {
            args.forEach((item, index) => {
                handleResult(rpc, item)
            })
        }
    }
}

function handleResult(rpc, result) {
    rpc.clientEvent[result.moduleName](result.result);
}
function handleConnectionData(rpc) {
    return function(data) {
        // Node底层会存在批量写的过程,所以需要对传过来的data进行预处理
        const { args, multi } = parseServerString(data.toString())
        if(!multi) {
            handleCall(rpc, args)
        } else {
            args.forEach((item, index) => {
                handleCall(rpc, item)
            })
        }
    }
}

function handleCall(rpc, args) {
    const moduleName = args[0];
    const callArgs = args.slice(1, args.length);
    const regx = /([^\.\[\]])+/g
    if(!isString(moduleName)) {
        // 出错处理 call函数第一个参数为调用对象名 最后一个参数是返回值
        console.log('call函数第一个参数为调用对象名 最后一个参数是返回值');
        return;
    }
    const match = moduleName.match(regx);
    let length = match.length;
    if(match && length) {
        let target;
        let index = 0;
        while(index != length) {
            target = target ? target[match[index]] : rpc.registers[match[index]]

            if(target) {
                index++;
            } else {
                // TODO 不存在该函数调用
                console.log('rpc不存在该方法');
                return;
            }
        }
        // 调用该方法
        target.call(null, ...callArgs, (res) => {
            const data = {};
            data.moduleName = moduleName;
            data.result = res;
            rpc.socket.write(JSON.stringify(data), 'utf8', (err) => {
                if(err) {
                    console.log('回调执行失败');
                }
            });
        });
    }
}

Rpc.listen = Rpc.listen;
module.exports = Rpc;