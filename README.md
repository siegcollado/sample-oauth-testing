# Verifying auth token

## Requirements

- NodeJS (> 14)

## Installing:

`yarn install`

## Running:

`yarn test`

See [docs folder](docs/) for details.

## Libraries used:

For the test runner, I used [jest](https://jestjs.io), reason being is this is my most commonly used
testing framework especially when writing jest tests.

I also included the following libraries as well to help me in testing:

1. [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) as a library to parse the token
   token from the response.

2. [node-fetch](https://github.com/node-fetch/node-fetch) - a wrapper around node's http module to
   provide the same `fetch` api from browser environments.


## Tests

[The test](test/oauth-sample.test.ts) is divided into 2 blocks, the happy path, which contains assertions for scenarios that
contains valid client_ids and client_secrets, and the negative scenarios, which contains tests that
assert the status code of the response when an invalid value is passed to it.


### Happy Path

1. Tests here include assertions that the response shape is valid, using jest's built in matchers.

2. These tests also verify that the tocen is a valid jwt token, and it also tests for the tokens.

3. To make the entire describe block reusable for multiple test cases, I used jest's
   [describe.each](https://jestjs.io/docs/api#describeeachtablename-fn-timeout) [functionality](img/describe-each.png), other data-driven test frameworks
   can probably utilize a CSV file for this test data though.

### Negative Scenarios

Pretty straightforward, just verified the status codes of the responses when given invalid data.


### Utilities

- I moved some common code that calls the API endpoint in [a helpers file](test/helpers/test-helpers.ts).

- For the endpoint to test, I moved it in an [environment](.env) file.

### Assumptions done

- for the iss property - i [asserted that the issuer property of the jwt is the hostname](img/iss-verify.png) of the
  endpoint used for testing, but based on the jwt spec, this isn't always the case.

### Improvements

1. If the framework allows, we could move the test data (client_id, client_secret and allowed scopes
   mapping) outside the test file itself, probably in a CSV file.
2. Typescript-related improvement: we could do away with type assertion (using "as") and maybe use a
   validator that returns the type of the validated object.


