const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.disconnect();
  await global.__MONGOD__.stop();
};