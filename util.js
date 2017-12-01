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
    }
}