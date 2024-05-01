const ENV = process.env.NODE_ENV;
const path = require('path');
const fs = require('fs');
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("./../config");
const db = require("./../database/connection");

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestLogin:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          required: true
 *          example: cristian.naranjo@outlook.es
 *        password:
 *          type: string
 *          required: true
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
    const {
      body: { username, password },
    } = request;
    const {
      parsed: { JWT_PVT_KEY },
    } = config;
    const rsa = fs.readFileSync(path.join(JWT_PVT_KEY)).toString();

    await db.connect();
    await db.query({
      sql: `
        SELECT id, username
        FROM users
        WHERE username=? AND password=?
        LIMIT 1
      `,
      values: [username, password]
    }).then((result) => {
      try {
        const token = jwt.sign(result[0][0], rsa, { algorithm: 'RS256'});

        response
          .cookie("token", token, {
            httpOnly: true,
            secure: ENV,
          })
          .status(201)
          .json({
            loggin: true
          });
      } catch {
        response.status(500);
      }
    });
    db.end();
  } catch {
    response.status(500);
  }
});

module.exports = router;
