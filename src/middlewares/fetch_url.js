const fetch = require('node-fetch');
require('dotenv').config();

const API = require('../config/database').API;
const RenderMessageToClient = require('../utilities/render_message');

async function FetchURL(req, res, next) {
	const requestedAPI = await API.findOne({endpoint: req.body.endpoint});

	if(requestedAPI) {
		return RenderMessageToClient(res, {success: {
			successCode: 200,
			paginatedUrl: `${process.env.Protocol}://${req.get('host')}/${requestedAPI.shortid}`
		}});
	}

	else {
		fetch(req.body.endpoint)
			.then(response => {
				if(response.ok) 
					return response.json();
					
				// else render error message on the client machine
				RenderMessageToClient(res, {error: { 
					errorCode: response.status,
					errorText: 'Bad response from the API endpoint' 
				}});

				return undefined;
			})

			.then(data => {
				if(data) {
					req.data = data;
					next();
				}
			})

			.catch(err => {
				const error = { errorCode: 500,
						errorText: err.message };

				RenderMessageToClient(res, {error: {
					errorCode: 500,
					errorText: err.message
				}});
			});
	}
}

module.exports = FetchURL;