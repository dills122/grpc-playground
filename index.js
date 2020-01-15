module.exports = {
    clientFactory : require("./src/client-factory"),
    serverFactory : require("./src/server-factory"),
    dependencies: {
        protoServerBuilder: require("./src/proto-server-builder"),
        protoServiceBuilder: require("./src/proto-service-builder")
    }
};