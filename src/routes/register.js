const express = require("express");
const router = express.Router();
const authorization = require("../auth/authorization");
const db = require("./../database/connection");

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestRegister:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          required: true
 *          example: cristian.naranjo@outlook.es
 *        name:
 *          type: string
 *          required: true
 *          example: Asdf1234.
 *        firstName:
 *          type: string
 *          required: true
 *          example: Cristian Camilo
 *        lastName:
 *          type: string
 *          required: true
 *          example: Naranjo Valencia
 *        phone:
 *          type: string
 *          required: false
 *          example: 3197845152
 *    ResponseRegister:
 *      type: object
 *      properties:
 *        register:
 *          type: boolean
 *          example: true
 * /register:
 *  tags:
 *    name: Register
 *  post:
 *    summary: Registro de usuario.
 *    tags: [Register]
 *    description: Método para registrar usuarios nuevos en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestRegister'
 *    responses:
 *      201:
 *        description: Usuario creado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseRegister'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", authorization, async (request, response) => {
  try {
    const {
      body: { username, password, firstName, lastName, phone },
    } = request;

    await db.connect();
    await db.beginTransaction();
    await db
      .query({
        sql: `INSERT INTO users(username, password) VALUES(?, ?)`,
        values: [username, password],
      })
      .then(async (result) => {
        const { insertId } = result[0];

        await db.query({
          sql: `INSERT INTO profiles(firstName, lastName, phone, userId) VALUES(?, ?, ?, ?)`,
          values: [firstName, lastName, phone, insertId],
        });

        response.status(201).json({
          register: true,
        });
      });

    await db.commit();
    await db.end();
  } catch {
    await db.rollback();
    response.status(500);
  }
});

module.exports = router;
