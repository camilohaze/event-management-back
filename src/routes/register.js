const express = require("express");
const router = express.Router();
const registerService = require("./../services/register");

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestRegister:
 *      type: object
 *      required:
 *        - username
 *        - password
 *        - firstName
 *        - lastName
 *      properties:
 *        username:
 *          type: string
 *          example: cristian.naranjo@outlook.es
 *        password:
 *          type: string
 *          example: Asdf1234.
 *        firstName:
 *          type: string
 *          example: Cristian Camilo
 *        lastName:
 *          type: string
 *          example: Naranjo Valencia
 *        phone:
 *          type: string
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
router.post("/", async (request, response) => {
  try {
    const { body } = request;

    await registerService.register(body);

    response.status(201).json({
      register: true,
    });
  } catch (error) {
    const { code, message } = error;

    switch (code) {
      case "ER_BAD_NULL_ERROR":
        return response.status(400).json({
          code,
          message,
        });

      case "ER_DUP_ENTRY":
        return response.status(422).json({
          code,
          message,
        });

      default:
        // code here!
        break;
    }

    response.status(500).json();
  }
});

module.exports = router;
