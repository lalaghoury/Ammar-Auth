const useRoutes = (app) => {
  // Welcome Route
  app.get('/', (req, res) => {
    res.send('Assalom-Alaikum! Ammar Backend API');
  });

  // User Routes
  const userRoute = require('../routes/user');
  app.use('/api/users', userRoute);

  // Request Routes
  const requestRoute = require('../routes/request');
  app.use('/api/requests', requestRoute);

  // Chat Routes
  const chatRoute = require('../routes/chat');
  app.use('/api/chats', chatRoute);

  // Auth Routes
  const authRoute = require('../routes/auth');
  app.use('/api/auth', authRoute);

  // Image Routes
  const imageRouter = require('../routes/image');
  app.use('/api/images', imageRouter);
};

module.exports = useRoutes;
