const { redisDB } = require('./db/redis')

async function saveConfig(key, value) {
    await redisDB.set(key, JSON.stringify(value))
}

async function getConfig(key) {
    return JSON.parse(await redisDB.get(key))
}

module.exports = {
    saveConfig,
    getConfig
};
