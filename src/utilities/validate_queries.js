function ValidateQueries(req, res, data) {

	// this function will be used in case the queries ain't validated
	const sendAllData = (statusCode) => {
		res.status(statusCode).json(data);
	}

	const pageNumber = parseInt(Math.abs(req.query.page));
	let dataLimit = parseInt(Math.abs(req.query.limit));

	if(!pageNumber) {
		sendAllData(400);
		return null;
	}
	
	if(!dataLimit) {
		// either `datalimit` or `numberOfPages` is required to paginate the data
		const numberOfPages = parseInt(Math.abs(req.query.number_of_pages));

		if(!numberOfPages) {
			sendAllData(400);
			return null;
		}

		dataLimit = parseInt(data.length  / numberOfPages);
	}
	
	const generalViolations = () => (
		(pageNumber > data.length) || (dataLimit > data.length) 
		|| (pageNumber * dataLimit) > data.length
	);

	if(generalViolations()) {
		sendAllData(416);
		return null;
	}

	return {pageNumber, dataLimit};
}

module.exports = ValidateQueries;