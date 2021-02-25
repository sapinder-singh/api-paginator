const mongoose = require('mongoose');

require('dotenv').config();

const dbURL = `mongodb+srv://${process.env.AdminName}:${process.env.AdminPassword}@cluster0.exbea.mongodb.net/
	${process.env.DataBase}?retryWrites=true&w=majority`;

const connection = mongoose.createConnection(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

connection.on('connected', _=> console.log('mongodb connected'));

const apiSchema = new mongoose.Schema({
	endpoint: { type: String, required: true },
	shortid: { type: String, required: true },
	data: { type: Array, required: true } // type: JSON ?
})

const API = connection.model('APIs', apiSchema);

module.exports.API = API;