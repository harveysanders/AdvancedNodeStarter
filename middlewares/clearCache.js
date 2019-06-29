const { client } = require('../services/redis');

module.exports = async (req, res, next) => {
  try {
    await next();
    client.del(JSON.stringify(req.user.id));
  } catch(e) {
    res.status(500).send(e)
  }
} 
