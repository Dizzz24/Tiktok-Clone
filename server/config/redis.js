const Redis = require('ioredis');
const { REDIS_PASSWORD } = process.env

const config = {
    host: 'redis-13008.c256.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 13008,
    password: REDIS_PASSWORD
};

const redis = new Redis(config);

module.exports = redis