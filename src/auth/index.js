const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const config = require("../config");

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

    request.data = data;

    return next();
  } catch {
    return response.sendStatus(401);
  }
};

const refresToken = (request, response, next) => {
  const {
    cookies: { refresh },
  } = request;
  const {
    parsed: { JWT_REFRESH_PVT_KEY },
  } = config;
  const rsa = fs.readFileSync(path.join(JWT_REFRESH_PVT_KEY)).toString();

  if (!refresh) {
    return response.sendStatus(401);
  }

  try {
    const data = jwt.verify(refresh, rsa);

    request.data = data;

    return next();
  } catch {
    return response.sendStatus(401);
  }
};

module.exports = { authorization, refresToken };
