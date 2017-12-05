function Cache(expire = 3600000 /* default 1 hour */) {
  this.expire = expire
  this.startTime = Date.now()
}

Cache.prototype.get = function (key) {
  if (this.has(key)) {
    return this[key]
  }
}

Cache.prototype.set = function (key, val) {
  if (key && val) {
    this[key] = val
    this.startTime = Date.now()
    return val
  }
}

Cache.prototype.has = function (key) {
  return !!(key && this[key])
}

Cache.prototype.isExpire = function () {
  return this.expire + this.startTime < Date.now()
}

export default Cache