const getPkgDefs = require("./proto-service-builder");
// const serviceDefinitions = require("./proto-service-definitions");
const grpc = require("grpc");
const _ = require("lodash");

module.exports = (server = new grpc.Server(), serviceDefinitions = {}) => {
    if(_.isEmpty(serviceDefinitions)) {
        throw new ReferenceError("Service definitions need to be defined");
    }
    let pkgDefs = getPkgDefs();
    _.forEach(pkgDefs, (pkgDefObj) => {
        let {
            pkgDef,
            serviceName,
            namespace
        } = pkgDefObj;
        let serviceDefinition = serviceDefinitions[serviceName];
        server.addService(pkgDef[namespace][serviceName], serviceDefinition);
    });
    return server;
};