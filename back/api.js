function manageRequest(request, response) {
    response.statusCode = 200;
    response.end(`Thx bro ${request.url}`);
}

exports.manageRequest = manageRequest;
