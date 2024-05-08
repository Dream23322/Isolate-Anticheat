class EvictingList {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.list = [];
    }

    add(item) {
        if (this.list.length >= this.maxSize) {
            this.list.shift();
        }
        this.list.push(item);
    }

    isFull() {
        return this.list.length >= this.maxSize;
    }
}