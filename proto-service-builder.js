const joi = require("@hapi/joi");
const grpc = require("grpc");
const _ = require("lodash");
const protoLoader = require('@grpc/proto-loader');
const {
    join
} = require("path");

const schema = joi.object().keys({
    protoPath: joi.string().min(1).pattern(/[.](proto\b)/g).required(),
    namespace: joi.string().min(1).required(),
    serviceName: joi.string().min(1).required()
});

const config = {
    protoDefinitionPath: 'protos',
    Services: {
        FirstService: {
            protoPath: '/path/to/proto',
            namespace: 'namespace',
            serviceName: 'ServiceName'
        }
    }
};

//Load all of the protos into packages
module.exports = () => {
    const protoServices = _.keys(config.Services);
    if (protoServices.length === 0) {
        throw new ReferenceError("config did not have any proto's defined");
    }

    return _.map(protoServices, (serviceName) => {
        let protoDefinition = config[serviceName];
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