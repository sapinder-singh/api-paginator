const express = require('express');
const path = require('path');
const cors = require('cors');
const appController = require('./controllers/appController');
const apiController = require('./controllers/apiController');
const FetchURL = require('./middlewares/fetch_url');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./public/views'));

app
  .get('/', appController.getApp)
  .post('/', FetchURL, appController.submitOrigin);

const corsMiddleware = (_req, _res, next) => {
  cors();
  next();
};

app.get('/:shortid', corsMiddleware, apiController.getData);

module.exports = app;
