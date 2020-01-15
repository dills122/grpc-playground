const joi = require("@hapi/joi");
const grpc = require("grpc");
const _ = require("lodash");
const protoLoader = require('@grpc/proto-loader');
const {
    join
} = require("path");

const schema = joi.object().keys({
    protoPath: joi.string().min(1).pattern(/[.](proto\b)/).required(),
    namespace: joi.string().min(1).required(),
    serviceName: joi.string().min(1).required(),
    serviceDefinitions: joi.object().required()
});

// //Not needed anymore just leaving for reference
// const config = {
//     protoDefinitionPath: 'protos',
//     Services: {
//         FirstService: {
//             protoPath: '/path/to/proto',
//             namespace: 'namespace',
//             serviceName: 'ServiceName'
//         }
//     }
// };

//Load all of the protos into packages
module.exports = (config = {}) => {
    const protoServices = _.keys(config.Services);
    if (protoServices.length === 0 || _.isEmpty(config)) {
        throw new ReferenceError("config did not have any proto's defined");
    }

    return _.map(protoServices, (serviceName) => {
        let protoDefinition = config.Services[serviceName];
        joi.attempt(protoDefinition, schema);
        if (_.isEmpty(protoDefinition)) {
            throw new ReferenceError(`${serviceName} was supplied with an empty service defintion`);
        }
        const protoPath = join(__dirname, config.protoDefinitionPath, protoDefinition.protoPath);
        const packageDefinition = protoLoader.loadSync(protoPath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        return {
            pkgDef: grpc.loadPackageDefinition(packageDefinition)[protoDefinition.namespace],
            ...protoDefinition
        };
    });
};