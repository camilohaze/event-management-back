const express = require("express");
const router = express.Router();
const authorization = require("./../auth");
const db = require("./../database");

/**
 * @swagger
 * /details:
 *  tags:
 *    name: Details
 *  get:
 *    summary: Retorna una lista de lugares cercanos.
 *    tags: [Details]
 *    description: Método para retornar una lista de lugares cercanos.
 *    responses:
 *      200:
 *        description: Ok.
 *        content:
 *          application/json:
 *            schema:
 *              items:
 *                $ref: '#/components/schemas/Events'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.get("/", authorization, async (request, response) => {
  try {
    db.connect();
    await db
      .query({
        sql: `SELECT * FROM events`,
      })
      .then(([results]) => {
        response.status(200).json(results);
      });
  } catch {
    response.status(500);
  }
});

module.exports = router;
