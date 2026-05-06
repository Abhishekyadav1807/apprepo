const connection = require('../config/redis');

const enqueueTask = async (payload) => {
  await connection.lpush('task_queue', JSON.stringify(payload));
};

module.exports = { enqueueTask };
