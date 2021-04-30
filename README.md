# API Paginator

## How does it Work?
This API acts as a ***caching server*** that caches the data fetched from the ***origin server***. You're just needed to submit an API endpoint **that returns JSON data**, for which this API provides a unique endpoint with the *paginated version* of the same JSON data.

The following constraints apply to the data returned by this API-

- If no query was passed in the URL, all of the data shall be returned.
- The only valid queries are:
  1. `page` : The page/set number of the resulting data.
  2. `limit` : The number of results per page/set.  
	***OR***  
	`number_of_pages` : The total number of pages/sets in the resulting data.
- Only positive integer values are allowed for each of the queries. If not, the queries shall be rejected.
- In case `limit` and `number_of_pages` both are defined, `limit` shall be used for paginating the data.
- In case of any logical error in the queries passed, all of the data shall be returned to the client. An Error message shall be logged to the console for more information.