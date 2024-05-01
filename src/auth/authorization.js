const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const config = require("./../config");

const authorization = (request, response, next) => {
  const {
    cookies: { token },
  } = request;
  const {
    parsed: { JWT_PVT_KEY },
  } = config;
  const rsa = fs.readFileSync(path.join(JWT_PVT_KEY)).toString();

  if (!token) {
    return response.sendStatus(401);
  }

  try {
    const data = jwt.verify(token, rsa);

    request.id = data.id;
    request.username = data.username;

    return next();
  } catch {
    return response.sendStatus(401);
  }
};

module.exports = authorization;