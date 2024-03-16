import express from 'express';
import path from 'path';
import cors from 'cors';
import { submitOrigin, getData } from './controllers/apiController.js';
import FetchURL from './middlewares/fetch_url.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./public/views'));

app
  .get('/', (_req, res) => {
    res.render('index', { error: false, success: false });
  })
  .post('/', FetchURL, submitOrigin);

const corsMiddleware = (_req, _res, next) => {
  cors();
  next();
};

app.get('/api/origins/:shortid', corsMiddleware, getData);

export default app;
