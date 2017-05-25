# How to update your data using PATCH HTTP method

The http `PUT` method is not intended to update just a few property. Make some changes would require to `GET` the entire remote resource and to `PUT` it back after local modifications.

With the http `PATCH` method several atomic changes can be applied in one step, without a prior `GET` request. Following the `JavaScript Object Notation PATCH` definition, the possible operations on a remote resource properties could be: add, remove, replace, move, copy and test.

The successful `PATCH` response would return a representation of the updated resource with a `200 OK` status code. If the update has been accepted for processing without requiring to wait for it to finish, the status code must be `202 Accepted`.

On error, the response would be a `409 Conflict` status code.

--------------------------------------------------------------------------------

## Getting Started

The test server is a Node/Express.js app running on localhost:4000\. If you want to modify the app port, change the configuration file `config/default.yaml`.

Data are saved using the database [ForerunnerDB](https://github.com/Irrelon/ForerunnerDB). DB default data are on `config/default.yaml` file.

The tests on `test/e2e` folder show the different `PATCH` API usage.

--------------------------------------------------------------------------------

### Prerequisites

What things you need to install the software

```
Node.js 6.0+
```

--------------------------------------------------------------------------------

### Installing

The easiest way to get started is to clone the repository:

```
# Get the latest snapshot
git clone https://github.com/claclacla/myproject.git myproject

# Change directory
cd myproject

# Install NPM dependencies
npm i
```

--------------------------------------------------------------------------------

### Usage

```
# Change directory
cd myproject

# Start the API server using node
npm start

# Test it using...

npm run unit-test
# ...to test repository code

npm run e2e-test
# ...to test the PATCH API
```

--------------------------------------------------------------------------------

## Authors

- **Simone Adelchino** - [_claclacla_](https://twitter.com/_claclacla_)

--------------------------------------------------------------------------------

## License

This project is licensed under the MIT License

--------------------------------------------------------------------------------

## Acknowledgments

- [PATCH Method for HTTP](https://tools.ietf.org/html/rfc5789)
- [JavaScript Object Notation (JSON) Patch](https://tools.ietf.org/html/rfc6902)
- [JSON Merge Patch](https://tools.ietf.org/html/rfc7396)
