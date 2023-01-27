const requestHandler = (req, res) => {
    console.log(req.method);
    console.log(req.url);
}
exports.handler = requestHandler