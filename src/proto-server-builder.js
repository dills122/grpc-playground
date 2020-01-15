const getPkgDefs = require("./proto-service-builder");
// const serviceDefinitions = require("./proto-service-definitions");
const grpc = require("grpc");
const _ = require("lodash");

module.exports = (config = {}, server = new grpc.Server()) => {
    if(_.isEmpty(config)) {
        throw new ReferenceError("Service definitions need to be defined");
    }
    let pkgDefs = getPkgDefs(config);
    _.forEach(pkgDefs, (pkgDefObj) => {
        let {
            pkgDef,
            serviceName,
            namespace,
            serviceDefinitions
        } = pkgDefObj;
        server.addService(pkgDef[serviceName].service, serviceDefinitions);
    });
    return server;
};