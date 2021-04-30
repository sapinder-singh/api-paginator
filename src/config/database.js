const mongoose = require('mongoose');

const dbURL = process.env.NODE_ENV === 'development' ?
	process.env.dev_db : process.env.prod_db;

const connection = mongoose.createConnection(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

connection.on('connected', _ => console.log('mongodb connected'));

const apiSchema = new mongoose.Schema({
	endpoint: { type: String, required: true },
	shortid: { type: String, required: true },
	data: { type: Array, required: true }
})

const API = connection.model('APIs', apiSchema);

module.exports.API = API;