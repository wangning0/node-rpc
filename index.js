const net = require('net');
const { isObject, extend, isString, isFunction } = require('./util');
function Rpc() {
    if(!(this instanceof Rpc != Rpc)) {
        return new Rpc();
    }
    this.registers = {};
}

Rpc.prototype.listen = function(port, callback) {
    const server = net.createServer((client) => {
        
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
        extend(module, this.register[moduleName]);
    }

    this.register[moduleName] = module;
}

Rpc.prototype.connect = function(port, host, callback) {
    if(!callback) {
        callback = host;
        host = 'localhost';
    }
    const connection = net.createConnection(port, host);

    connection.setKeepAlive(true);

    this.connection = connection;
    
    callback(this, connection);
}

Rpc.prototype.call = function() {
    const args = [...arguments];
    const moduleName = args[0];
    const callback = args[args.length - 1];
    const callArgs = args.slice(1, args.length - 1);
    const regx = /([^\.\[\]])+/g
    if(!isString(moduleName) || isFunction(callback)) {
        // 出错处理 call函数第一个参数为调用对象名 最后一个参数是返回值
        // TODO 出错 通知给client
        console.log('call函数第一个参数为调用对象名 最后一个参数是返回值');
        return;
    }
    const match = moduleName.match(regx);
    let length = match.length;
    if(match && length) {
        let target;
        let index = 0;
        while(index != length) {
            target = target ? target[match[index]] : this.registers[match[index]]
            if(target) {
                index++;
            } else {
                // TODO 不存在该函数调用
                console.log('rpc不存在该方法');
                return;
            }
        }
        // 调用该方法
        const result  = target.apply(null, [...callArgs], (err, res) => {
            // async
            callback(err, res);
        });
        // sync
        callback(result);
    }

}
Rpc.connect = Rpc.prototype.connect;
Rpc.listen = Rpc.listen;
module.exports = Rpc;