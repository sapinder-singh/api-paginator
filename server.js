const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const router = require('./src/config/routes');

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));

require('./src/config/database');

app.set('view engine', 'ejs');
app.set('views', path.resolve('./public/views'));

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port,
	() => console.log('server listening on port ' + port)
);