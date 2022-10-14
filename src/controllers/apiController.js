const shortid = require('shortid');
const Origin = require('../models/originModel');
const ValidateQuery = require('../utilities/validate_query');
const RenderMessageToClient = require('../utilities/render_message');

module.exports.getData = async (req, res) => {
  const requestedOrigin = await Origin.findOne({
    shortid: req.params.shortid,
  });

  if (!requestedOrigin) {
    return res.status(400).send('404 Not Found');
  }

  const data = requestedOrigin.data;
  // validate required query parameters i.e. page and limit
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
};

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

module.exports.submitOrigin = (req, res) => {
  if (!req.body.data) return;

  const newOrigin = new Origin({
    endpoint: req.body.endpoint,
    shortid: shortid.generate(),
    data: req.body.data,
  });

  newOrigin
    .save()
    .then(origin => {
      RenderMessageToClient(res, {
        success: {
          successCode: 200,
          paginatedUrl: `${req.protocol}://${req.get('host')}/api/origins/${
            origin.shortid
          }`,
        },
      });
    })
    .catch(() => {
      RenderMessageToClient(res, {
        error: {
          errorCode: 400,
          errorText: 'Error Saving the API',
        },
      });
    });
};
