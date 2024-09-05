const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const routes = require('./apiRoutes');
const scheduledJobs = require('./scheduledJobs');
const { sequelize } = require('./models');
const swaggerOptions = require('./swaggerOptions')

const app = express();

app.use(express.json());

app.use('/', routes);

expressJSDocSwagger(app)(swaggerOptions);

scheduledJobs.start();

process.on('SIGTERM', () => {
  scheduledJobs.stop();
});


sequelize.sync({ alter: true }).then(() => {
  startServer();
}).catch((error) => {
  console.error('Unable to sync database:', error);
});

function startServer() {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}