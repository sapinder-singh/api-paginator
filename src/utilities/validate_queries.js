function ValidateQueries(req, res, data) {
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