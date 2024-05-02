const ENV = process.env.NODE_ENV;
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
 *        loggin:
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
      parsed: { JWT_PVT_KEY },
    } = config;
    const rsa = fs.readFileSync(path.join(JWT_PVT_KEY)).toString();
    const payload = await loginService.login(body);
    const token = jwt.sign(payload, rsa, {
      algorithm: "RS256",
      expiresIn: "60m",
    });

    response
      .cookie("token", token, {
        httpOnly: true,
        secure: ENV,
      })
      .status(201)
      .json({
        loggin: true,
      });
  } catch {
    response.status(500);
  }
});

module.exports = router;
