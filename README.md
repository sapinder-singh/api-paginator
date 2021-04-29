# Paginate The API

## How does it Work?
You'll get a unique endpoint that shall return the paginated version of data, which is retrieved from the API endpoint that you submit. **Note that this works only for those APIs that return JSON data.**  

The following constraints apply to the data returned by the paginated API-

- If no query was passed in the URL, all of the data shall be returned.
- The only valid queries are:
  1. `page` : The page/set number of the resulting data.
  2. `limit` : The number of results per page/set.  
	***OR***  
	`number_of_pages` : The total number of pages/sets in the resulting data.
- Only positive integer values are allowed for each of the queries. If not, the queries shall be rejected.
- In case `limit` and `number_of_pages` both are defined, `limit` shall be used for paginating the data.
- In case of any logical error in the queries passed, all of the data shall be returned to the client.  
An Error message shall be logged to the console for detailed information.