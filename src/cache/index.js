function Cache(expire = 3600000 /* default 1 hour */) {
  this.expire = expire
  this.startTime = Date.now()
}

Cache.prototype = {
  construct: Cache,
  get(key) {
    if (this.has(key)) {
      return this[key]
    }
  },
  set(key, val) {
    if (key && val) {
      this[key] = val
      this.startTime = Date.now()
      return val
    }
  },
  has(key) {
    return !!(key && this[key])
  },
  isExpire() {
    return this.expire + this.startTime < Date.now()
  }
}

export default Cache