const express = require("express");
const router = express.Router();
const authorization = require("./../auth");

/**
 * @swagger
 * /logout:
 *  tags:
 *    name: Logout
 *  post:
 *    summary: Cerrar session.
 *    tags: [Logout]
 *    description: Método para finalizar la session de los usuarios en la plataforma.
 *    responses:
 *      201:
 *        description: Session finalizada.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseLogin'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 */
router.post("/", authorization, (request, response) => {
  return response.clearCookie("token").status(200).json({
    loggin: false,
  });
});

module.exports = router;
