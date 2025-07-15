const API_KEY = process.env.API_KEY;
module.exports = (req, res, next) => {
const clientKey = req.header('x-api-key');

  if (!clientKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  if (clientKey !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  next();
};
