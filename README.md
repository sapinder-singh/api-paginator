# API Paginator

## How does it Work?
This API acts as a ***caching server*** that caches the data fetched from the ***origin server***. You're just needed to submit an API endpoint **that returns JSON data**, for which this API provides a unique endpoint with the *paginated version* of the same JSON data.

The following constraints apply to the data returned by this API-

- If no query was passed in the URL, all of the data will be returned.
- The only valid parameters are:
  1. `page` : The page/set number of the resulting data.
  2. `limit` : The number of results per page/set.  
	***OR***  
	`number_of_pages` : The total number of pages/sets in the resulting data.
- Only positive integer values are allowed for each of the parameters. If not, the query shall be rejected.
- In case `limit` and `number_of_pages` both are defined, `limit` will be used for paginating the data.
- If the parameters' values conflict with each other, all of the data shall be returned to the client.

The JSON response will look like-   

```
{
  "status": 200,
  "message": "OK",
  "dataLength": 50, // length of the data returned
  "data": []
}
```