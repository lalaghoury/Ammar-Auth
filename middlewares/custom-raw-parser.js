function rawJsonParser(req, res, next) {
    if (req.is('application/json')) {
      req.rawBody = '';
      req.on('data', (chunk) => {
        req.rawBody += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = JSON.parse(req.rawBody);
          next();
        } catch (err) {
          console.error('Error parsing raw JSON:', err);
          res.status(400).send('Invalid JSON payload');
        }
      });
    } else {
      next(); // Pass control to other middleware if not JSON
    }
  }
  
  module.exports = rawJsonParser;
  