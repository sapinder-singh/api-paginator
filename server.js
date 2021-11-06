const mongoose = require('mongoose');
const app = require('./src/app');

require('dotenv').config();

process.on('uncaughtException', err => {
  console.warn('UNHANDLED EXCEPTION... Shutting down!');
  console.error(err);
  process.exit(1);
});

const dbURL =
  process.env.NODE_ENV === 'development'
    ? process.env.dev_db
    : process.env.prod_db;

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongodb connected'));

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log('server listening on port ' + port)
);

process.on('unhandledRejection', err => {
  console.warn('UNHANDLED REJECTION... Shutting Down!');
  console.error(err);
  server.close(() => process.exit(1));
});
