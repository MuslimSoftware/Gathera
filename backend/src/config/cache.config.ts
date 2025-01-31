import { consoleLogSuccess, consoleLogWarning } from '@/utils/ConsoleLog';
import { TWELVE_HOURS_MS } from '@utils/validators/Validators';

export const CACHE_MAX_CAPACITY = 10000; // Max number of elements in the cache
export const CACHE_DEFAULT_TTL = TWELVE_HOURS_MS;

class CacheNode<T> {
    key: string; // The key of the node
    data: T; // The data stored in the node
    next: CacheNode<T> | null; // The next node in the cache
    prev: CacheNode<T> | null; // The previous node in the cache
    expiresAt: Date; // The time at which the node expires

    constructor(key: string, data: T, expiresAt: Date) {
        this.key = key;
        this.data = data;
        this.next = null;
        this.prev = null;

        this.expiresAt = expiresAt;
    }
}

export class LRUCache<T> {
    private capacity: number; // Max number of items in the cache
    private head: CacheNode<T> | null; // Most recently used
    private tail: CacheNode<T> | null; // Least recently used
    private cache: Map<string, CacheNode<T>>; // Map of key to node

    /**
     * Creates a new LRU cache with the given capacity
     * @param capacity The maximum number of items in the cache
     */
    constructor(capacity: number) {
        this.capacity = capacity;
        this.head = null;
        this.tail = null;
        this.cache = new Map<string, CacheNode<T>>();
    }

    /**
     * Gets the data stored in a cache node and moves it to the head of the cache
     * if it exists. Otherwise, returns null.
     * @param key The key of the node to get
     * @returns The data stored in the node, or null if the node does not exist
     */
    public get(key: string): T | null {
        const node = this.cache.get(key);
        if (node && node.expiresAt > new Date(Date.now())) {
            const node = this.cache.get(key)!;

            // Remove node from current position and add it to the head
            this.removeNode(node);
            this.addNode(node);

            return node.data;
        }

        if (node) {
            // Node has expired --> remove it from the cache
            this.cache.delete(key);
            this.removeNode(node);
        }

        return null;
    }

    /**
     * Puts new data in the cache. If the cache is full, removes the least
     * recently used item before adding the new item. If the key already exists
     * in the cache, updates the data and moves the node to the head of the cache.
     * @param key The key of the node to add
     * @param data The data to store in the node
     * @param expiresAt The time at which the node expires
     */
    public put(key: string, data: T, expiresAt: Date): void {
        if (this.cache.has(key)) {
            const node = this.cache.get(key)!;

            // Key already exists --> update data and move node to the head
            node.data = data;
            node.expiresAt = expiresAt;
            this.removeNode(node);
            this.addNode(node);
        } else {
            const node = new CacheNode(key, data, expiresAt);

            // If the cache is full, remove the least recently used item
            if (this.cache.size >= this.capacity && this.tail !== null) {
                this.cache.delete(this.tail.key); // Remove from map
                this.removeNode(this.tail); // Remove from list
            }

            // Key doesn't exist --> add the new node to the head
            this.addNode(node);
            this.cache.set(key, node);
        }
    }

    /**
     * Adds a node to the head of the cache.
     * @param node The node to add
     */
    private addNode(node: CacheNode<T>): void {
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
    }

    /**
     * Removes a node from the the cache.
     * @param node The node to remove
     */
    private removeNode(node: CacheNode<T>): void {
        if (node.prev !== null) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next !== null) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
    }
}

const CACHE = new LRUCache<any>(CACHE_MAX_CAPACITY);

export const getFromCache = (key: string) => {
    const data = CACHE.get(key);
    if (data) consoleLogSuccess(`Using cached response for ${key}`);
    return data;
};

export const putInCache = (key: string, data: any, expiresAt: Date = new Date(Date.now() + CACHE_DEFAULT_TTL)) => {
    consoleLogWarning(`Caching response for ${key}`);
    CACHE.put(key, data, expiresAt);
};
