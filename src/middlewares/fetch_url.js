const fetch = require('node-fetch');
const Origin = require('../models/originModel');
const RenderMessageToClient = require('../utilities/render_message');

const FetchURL = async (req, res, next) => {
  // first check if the submitted api is already stored in the database
  const requestedAPI = await Origin.findOne({ endpoint: req.body.endpoint });

  if (requestedAPI) {
    return RenderMessageToClient(res, {
      success: {
        successCode: 200,
        // send paginated endpoint by attaching `requestedAPI.shortid`
        paginatedUrl: `${req.protocol}://${req.get('host')}/${
          requestedAPI.shortid
        }`,
      },
    });
  }

  fetch(req.body.endpoint)
    .then(response => {
      if (response.ok) return response.json();

      // else render error message on the client machine
      RenderMessageToClient(res, {
        error: {
          errorCode: response.status,
          errorText: 'Bad response from the API endpoint',
        },
      });

      return undefined;
    })
    .then(data => {
      if (data) {
        // this data will be stored in the database with a shortid to create a new endpoint
        req.body.data = data;

        next();
      }
    })

    .catch(err => {
      RenderMessageToClient(res, {
        error: {
          errorCode: 500,
          errorText: err.message,
        },
      });
    });
};

module.exports = FetchURL;
