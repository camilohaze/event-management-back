const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { refresToken } = require("./../auth");
const config = require("./../config");
const refreshService = require("./../services/refresh");

/**
 * @swagger
 * /refresh:
 *  tags:
 *    name: Refresh
 *  post:
 *    summary: Recupera la sesión.
 *    tags: [Refresh]
 *    description: Método para autenticar los usuarios en la plataforma.
 *    consumes: application/json
 *    responses:
 *      201:
 *        description: Usuario autenticado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseLogin'
 *      404:
 *        description: El usuario no existe.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", refresToken, async (request, response) => {
  try {
    const { data } = request;
    const {
      parsed: { JWT_PVT_KEY, JWT_REFRESH_PVT_KEY },
    } = config;
    const rsaToken = fs.readFileSync(path.join(JWT_PVT_KEY)).toString();
    const rsaRefresh = fs.readFileSync(path.join(JWT_REFRESH_PVT_KEY)).toString();

    const user = await refreshService.login(data);

    if (user) {
      const token = jwt.sign(user, rsaToken, {
        algorithm: "RS256",
        expiresIn: "120m",
      });
      const expiresInToken = 60000 * 60;

      const refresh = jwt.sign(user, rsaRefresh, {
        algorithm: "RS256",
        expiresIn: "160m",
      });
      const expiresInRefresh = 60000 * 90;

      return response
        .cookie("token", token, {
          maxAge: expiresInToken,
          httpOnly: true,
        })
        .cookie("refresh", refresh, {
          maxAge: expiresInRefresh,
          httpOnly: true,
        })
        .status(201)
        .json({
          login: true,
          role: user.role
        });
    }

    response.status(404).send({
      login: false,
      role: '',
    });
  } catch(error) {
    response.status(500).json();
  }
});

module.exports = router;