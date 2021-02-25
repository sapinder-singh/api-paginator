function RenderMessageToClient(responseObj, {error, success}) {
	if(error) {
		return responseObj.status(error.errorCode)
			.render('index', { error, success: false });
	}

	responseObj.status(success.successCode)
		.render('index', { success, error: false });
}

module.exports = RenderMessageToClient;