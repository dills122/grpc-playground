# gRPC Tooling & Utils

[![CodeFactor](https://www.codefactor.io/repository/github/dills122/grpc-playground/badge)](https://www.codefactor.io/repository/github/dills122/grpc-playground)

gRPC tooling to help simplify some of the tasks required by the framework.

Current Features:

- `ClientFactory` - Builds a client for a given service and proto
- `SeverFactory` - Builds a server for all the needed services and protos

This allows for some cleaner and more organized code since all of your service definitions are within a config.

## Example Service config

```json
{
    protoDefinitionPath: 'protos',
    Services: {
        FirstService: {
            protoPath: '/path/to/proto.proto',
            namespace: 'namespace',
            serviceName: 'ServiceName'
        }
    }
}
```

## Using Server Factory

```javascript
const { createServer } = require("grpc-tooling");
const config = require("path/to/service/config");

createServer
  .serverFactory(config)
  .then(() => {
    //Run any tasks needed once the server is started
  })
  .catch((err) => {
    //Handle server error
  });
```

## Using Client Factory

```javascript
const { clientFactory } = require("grpc-tooling");
const config = require("path/to/service/config");

const { ClientService } = config.Services;
clientFactory(
  ClientService.protoPath,
  ClientService.serviceName,
  ClientService.namespace
)
  .then((client) => {})
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
```
