const fetch = require('node-fetch');
require('dotenv').config();

const API = require('../config/database').API;
const RenderMessageToClient = require('../utilities/render_message');


async function FetchURL(req, res, next) {
	// first check if the submitted api is already stored in the database
	const requestedAPI = await API.findOne({ endpoint: req.body.endpoint });

	if (requestedAPI) {
		return RenderMessageToClient(res, {
			success: {
				successCode: 200,
				// send paginated endpoint by attaching `requestedAPI.shortid`
				paginatedUrl: `${process.env.Protocol}://${req.get('host')}/${requestedAPI.shortid}`
			}
		});
	}

	fetch(req.body.endpoint)
		.then(response => {
			if (response.ok)
				return response.json();

			// else render error message on the client machine
			RenderMessageToClient(res, {
				error: {
					errorCode: response.status,
					errorText: 'Bad response from the API endpoint'
				}
			});

			return undefined;
		})

		.then(data => {
			if (data) {
				// this data will be stored in the database with a shortid to create a new endpoint
				req.data = data;
				next();
			}
		})

		.catch(err => {
			RenderMessageToClient(res, {
				error: {
					errorCode: 500,
					errorText: err.message
				}
			});
		});
}

module.exports = FetchURL;