export class EvictingList {
    constructor(maxSize) {
      this.maxSize = maxSize;
      this.map = new Map();
    }
  
    getOrCreateList(key) {
      if (!this.map.has(key)) {
        this.map.set(key, []);
      }
      return this.map.get(key);
    }
  
    add(key, item) {
      const list = this.getOrCreateList(key);
      if (list.length >= this.maxSize) {
        list.shift(); // Remove the oldest item
      }
      list.push(item);
    }
  
    getList(key) {
      return this.map.get(key) || [];
    }
  
    clear(key) {
      if (this.map.has(key)) {
        this.map.set(key, []);
      }
    }
  
    clearAll() {
      this.map.clear();
    }
  
    getSize(key) {
      return this.getList(key).length;
    }
  
    getMaxSize() {
      return this.maxSize;
    }

    isFull(player) {
      return this.getSize(player) >= this.getMaxSize();
    }
  }