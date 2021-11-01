const Origin = require('../models/originModel');
const ValidateQuery = require('../utilities/validate_query');

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
