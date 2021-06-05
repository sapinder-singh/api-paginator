const router = require('express').Router();
const shortid = require('shortid');
const cors = require('cors');

const API = require('./database').API;
const FetchURL = require('../middlewares/fetch_url');
const RenderMessageToClient = require('../utilities/render_message');
const ValidateQuery = require('../utilities/validate_query');

router.get('/', (req, res) => {
  res.render('index', { error: false, success: false });
});

router.post('/', FetchURL, (req, res) => {
  if (!req.data) return;

  const newAPI = new API({
    endpoint: req.body.endpoint,
    shortid: shortid.generate(),
    data: req.data,
  });

  newAPI.save().then((api, err) => {
    if (err) {
      RenderMessageToClient(res, {
        error: {
          errorCode: 400,
          errorText: 'Error Saving the API',
        },
      });

      return;
    }

    RenderMessageToClient(res, {
      success: {
        successCode: 200,
        // send the paginated url
        paginatedUrl: `${req.protocol}://${req.get('host')}/${api.shortid}`,
      },
    });
  });
});

/* Paginated APIs Endpoint */
router.get('/:shortid', cors(), async (req, res) => {
  const requestedAPI = await API.findOne({ shortid: req.params.shortid });

  if (!requestedAPI) {
    return res.status(400).send('404 Not Found');
  }

  const data = requestedAPI.data;
  const validation = ValidateQuery(req.query, data);

  if (validation.errorOccurred) {
    return sendResponse(res, validation.status, validation.message, data);
  }

  const paginatedData = paginateData(
    data,
    validation.pageNumber,
    validation.dataLimit
  );
  sendResponse(res, 200, 'OK', paginatedData);
});

function sendResponse(resObj, status, message, data) {
  resObj.status(status).json({
    status,
    message,
    dataLength: data.length,
    data,
  });
}

function paginateData(data, pageNumber, dataLimit) {
  const startIndex = dataLimit * (pageNumber - 1);
  let lastIndex = startIndex + dataLimit; // no need to deduct 1 because .slice() is exclusive for lastIndex

  if (lastIndex > data.length) {
    lastIndex = data.length;
  }

  return data.slice(startIndex, lastIndex);
}

module.exports = router;
