class MemoryCache {
  constructor() {
    this.store = new Map();
    this.pending = new Map();
  }

  /**
   * @param {string} key
   * @param {Function} callback
   * @param {number} ttl milliseconds
   */
  async getOrSet(key, callback, ttl = 1000 * 60 * 5) {
    const cached = this.store.get(key);

    // valid cache
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    // thundering herd protection
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    const promise = (async () => {
      try {
        const data = await callback();

        this.store.set(key, {
          data,
          expiry: Date.now() + ttl,
        });

        return data;
      } finally {
        this.pending.delete(key);
      }
    })();

    this.pending.set(key, promise);

    return promise;
  }

  set(key, data, ttl = 1000 * 60 * 5) {
    this.store.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key) {
    const cached = this.store.get(key);

    if (!cached) return null;

    if (cached.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return cached.data;
  }

  delete(key) {
    this.store.delete(key);
    this.pending.delete(key);
  }

  clear() {
    this.store.clear();
    this.pending.clear();
  }
}

module.exports = new MemoryCache();