module.exports = {
    isObject(value) {
        const type = typeof value
        return value != null && (type == 'object');
    },
    isString(value) {
        return typeof value == 'string';
    },
    isFunction(value) {
        const type = typeof value
        return value != null && (type == 'function');
    },
    extend(ctor, superCtor) {
        return Object.assign(superCtor, ctor);
    },
    parseServerString(string) {
        const stringArgs = string.split('][');
        if(stringArgs.length >= 2) {
            const _arr = [];
            stringArgs.forEach((item, index) => {
                if(index == 0) {
                    _arr.push(JSON.parse(`${item}]`));
                } else if(index == stringArgs.length - 1) {
                    _arr.push(JSON.parse(`[${item}`));
                } else {
                    _arr.push(JSON.parse(`[${item}]`));
                }
            })
            return {
                args: _arr,
                multi: true
            };
        } else {
            return {
                args: JSON.parse(string),
                multi: false
            }
        }
    },
    parseClientString(string) {
        const stringArgs = string.split('}{');
        if(stringArgs.length >= 2) {
            const _arr = [];
            stringArgs.forEach((item, index) => {
                if(index == 0) {
                    _arr.push(JSON.parse(`${item}}`));
                } else if(index == stringArgs.length - 1) {
                    _arr.push(JSON.parse(`{${item}`));
                } else {
                    _arr.push(JSON.parse(`{${item}}`));
                }
            })
            return {
                args: _arr,
                multi: true
            };
        } else {
            return {
                args: JSON.parse(string),
                multi: false
            }
        }
    }
}
