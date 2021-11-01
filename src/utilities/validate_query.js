module.exports = function ValidateQuery(query, data) {
  const setErrorObj = (status, message) => ({
    errorOccurred: true,
    status,
    message,
  });

  const pageNumber = parseInt(query.page);
  let dataLimit = parseInt(query.limit);

  if (!pageNumber || pageNumber < 1) {
    return setErrorObj(
      400,
      "Please provide 'page' parameter with a positive integer value"
    );
  }

  if (!dataLimit || dataLimit < 1) {
    // either `datalimit` or `numberOfPages` is required to paginate the data
    const numberOfPages = parseInt(query.number_of_pages);

    if (!numberOfPages || numberOfPages < 1) {
      return setErrorObj(
        400,
        "Please provide either 'limit' or 'number_of_pages' parameter with a positive integer value."
      );
    }

    dataLimit = data.length / numberOfPages;
  }

  const queryConflicts = () => {
    return (
      pageNumber > data.length ||
      dataLimit > data.length ||
      pageNumber * dataLimit > data.length
    );
  };

  if (queryConflicts()) {
    return setErrorObj(416, 'Logical error found in the query!');
  }

  return { pageNumber, dataLimit };
};
