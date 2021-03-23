const router = require('express').Router();
const shortid = require('shortid');
const cors = require('cors');

const API = require('./database').API;
const FetchURL = require('../middlewares/fetch_url');
const RenderMessageToClient = require('../utilities/render_message');
const ValidateQueries = require('../utilities/validate_queries');

require('dotenv').config();

router.get('/', (req, res) => {
	res.render('index', { error: false, success: false })
})

router.post('/', FetchURL, (req, res) => {

	const newAPI = new API({
		endpoint: req.body.endpoint,
		shortid: shortid.generate(),
		data: req.data
	});

	newAPI.save()
		.then((api, err) => {

			if (err) {
				RenderMessageToClient(res, {
					error: {
						errorCode: 400,
						errorText: 'Error Saving the API'
					}
				});

				return;
			}

			RenderMessageToClient(res, {
				success: {
					successCode: 200,
					// send the paginated url
					paginatedUrl: `${process.env.Protocol}://${req.get('host')}/${api.shortid}`
				}
			});
		});
})


/* Paginated APIs Endpoint */
router.get('/:shortid', cors(), async (req, res) => {
	const requestedAPI = await API.findOne({ shortid: req.params.shortid });

	if (!requestedAPI) {
		return res.status(400).send('404 Not Found');
	}

	const data = requestedAPI.data;
	let pageNumber, dataLimit;

	const validation = ValidateQueries(req, res, data);
	if (!validation) return;

	else {
		pageNumber = validation.pageNumber;
		dataLimit = validation.dataLimit;
	}


	const startIndex = dataLimit * (pageNumber - 1);
	let lastIndex = startIndex + dataLimit; // no need to deduct 1 because .slice() is exclusive for lastIndex

	if (lastIndex > data.length) {
		lastIndex = data.length;
	}

	const paginatedData = data.slice(startIndex, lastIndex);
	res.status(200).json(paginatedData);
})

module.exports = router;