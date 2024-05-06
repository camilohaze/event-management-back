const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const config = require("./../config");
const loginService = require("./../services/login");

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestLogin:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        username:
 *          type: string
 *          example: cristian.naranjo@outlook.es
 *        password:
 *          type: string
 *          example: Asdf1234.
 *    ResponseLogin:
 *      type: object
 *      properties:
 *        login:
 *          type: boolean
 *          example: true
 * /login:
 *  tags:
 *    name: Login
 *  post:
 *    summary: Inicio de sessión.
 *    tags: [Login]
 *    description: Método para autenticar los usuarios en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestLogin'
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
router.post("/", async (request, response) => {
  try {
    const { body } = request;
    const {
      parsed: { JWT_PVT_KEY, JWT_REFRESH_PVT_KEY },
    } = config;
    const rsaToken = fs.readFileSync(path.join(JWT_PVT_KEY)).toString();
    const rsaRefresh = fs.readFileSync(path.join(JWT_REFRESH_PVT_KEY)).toString();

    const user = await loginService.login(body);

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
  } catch {
    response.status(500).json();
  }
});

module.exports = router;
