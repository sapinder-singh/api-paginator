const Origin = require('../models/originModel');
const shortid = require('shortid');
const RenderMessageToClient = require('../utilities/render_message');

module.exports.getApp = (_req, res) => {
  res.render('index', { error: false, success: false });
};

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
          // send the paginated url
          paginatedUrl: `${req.protocol}://${req.get('host')}/${
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
