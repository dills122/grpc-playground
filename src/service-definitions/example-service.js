module.exports = {
    SayHello: (call, callback) => {
        return callback(null, {message: 'Hello ' + call.request.name});
    }
}