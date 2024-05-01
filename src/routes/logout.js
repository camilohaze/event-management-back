const express = require("express");
const router = express.Router();
const authorization = require("../auth/authorization");

/**
 * @swagger
 *  tags:
 *    name: Logout
 * /logout:
 *  post:
 *    summary: Cerrar session.
 *    tags: [Logout]
 *    description: Método para finalizar la session de los usuarios en la plataforma.
 *    responses:
 *      201:
 *        description: Session finalizada.
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
