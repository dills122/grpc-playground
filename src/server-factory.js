const grpc = require("grpc");
const serverBuilder = require("./proto-server-builder");

const server_address = "0.0.0.0:50051";

module.exports = async () => {
    const server = serverBuilder();
    server.bind(server_address, grpc.ServerCredentials.createInsecure());
    server.start();
    console.log("Server Started");
}