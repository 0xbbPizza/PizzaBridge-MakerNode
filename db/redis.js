const redis = require("ioredis");

const redisConfig = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
}
const redisClient = new redis(redisConfig);

const redisDB = {
    async set(key, value) {
        return await redisClient.set(key, value)
    },
    async get(key) {
        return await redisClient.get(key)
    },
    async del(key) {
        return await redisClient.del(key)
    },
    async sadd(key, value) {
        return await redisClient.sadd(key, value)
    },
    async srem(key) {
        return await redisClient.srem(key)
    },
    async sismember(key, value) {
        return await redisClient.sismember(key, value)
    },
    async smembers(key) {
        return await redisClient.smembers(key)
    },
    async hset(hashKey, valueKey, value) {
        return await redisClient.hset(hashKey, valueKey, value)
    },
    async hget(hashKey, valueKey) {
        return await redisClient.hget(hashKey, valueKey)
    },
    async hmset(hashKey, value) {
        return await redisClient.hmset(hashKey, value)
    },
    async hmget(hashKey, valueKey) {
        return await redisClient.hmget(hashKey, valueKey)
    },
    async hgetAll(hashKey) {
        return await redisClient.hgetall(hashKey)
    },
    async rpush(listKey, valueKey) {
        return await redisClient.rpush(listKey, valueKey)
    },
    async lindex(listKey, index) {
        return await redisClient.hgetall(listKey, index)
    },

}

module.exports = {
    redisDB
};
