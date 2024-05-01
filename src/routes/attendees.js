const express = require("express");
const router = express.Router();
const authorization = require("../auth/authorization");
const db = require("./../database/connection");

/**
 * @swagger
 * components:
 *  schemas:
 *    Attendees:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        date:
 *          type: string
 *          example: 01/05/2024
 *        eventId:
 *          type: integer
 *          example: 1
 *        userId:
 *          type: integer
 *          example: 1
 * /attendees/event/{eventId}:
 *  tags:
 *    name: Attendees
 *  get:
 *    summary: Retorna una lista de asistentes por el id de un evento.
 *    tags: [Attendees]
 *    description: Retorna una lista de asistentes por el id de un evento.
 *    parameters:
 *      - in: path
 *        name: eventId
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Ok.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Attendees'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.get("/event/:eventId", authorization, async (request, response) => {
  try {
    const {
      params: { eventId },
    } = request;

    db.connect();
    await db
      .query({
        sql: `SELECT * FROM attendees WHERE id=?`,
        values: [eventId],
      })
      .then(([results]) => {
        response.status(200).json(results);
      });
  } catch {
    response.status(500);
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestAttendees:
 *      type: object
 *      properties:
 *        date:
 *          type: string
 *          required: true
 *          example: 01/05/2024
 *        eventId:
 *          type: integer
 *          required: true
 *          example: 1
 *        userId:
 *          type: string
 *          required: true
 *          example: 1
 *    ResponseAttendees:
 *      type: object
 *      properties:
 *        inserted:
 *          type: boolean
 *          example: true
 * /attendees:
 *  tags:
 *    name: Attendees
 *  post:
 *    summary: Registrar un asistente.
 *    tags: [Attendees]
 *    description: Método para registrar un asistente a un evento de la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestAttendees'
 *    responses:
 *      201:
 *        description: Asistente registrado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseAttendees'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", authorization, async (request, response) => {
  try {
    const {
      body: { date, eventId, userId },
    } = request;

    db.connect();
    await db
      .query({
        sql: `
        INSERT INTO attendees(date, eventId, userId)
        VALUES(?, ?, ?)`,
        values: [date, eventId, userId],
      })
      .then(() => {
        response.status(201).json({
          inserted: true,
        });
      });
  } catch {
    response.status(500);
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseUpdateAttendees:
 *      type: object
 *      properties:
 *        updated:
 *          type: boolean
 *          example: true
 * /attendees:
 *  tags:
 *    name: Attendees
 *  put:
 *    summary: Actualizar un asistente.
 *    tags: [Attendees]
 *    description: Método para actualizar asistente a un evento de la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestAttendees'
 *    responses:
 *      201:
 *        description: Asistente actualizado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseUpdateAttendees'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.put("/", authorization, async (request, response) => {
  try {
    const {
      body: { id, date },
    } = request;

    db.connect();
    await db
      .query({
        sql: `
          UPDATE attendees
          SET date=?
          WHERE id=?
        `,
        values: [date, id],
      })
      .then(() => {
        response.status(201).json({
          updated: true,
        });
      });
  } catch {
    response.status(500);
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseDeleteAttendees:
 *      type: object
 *      properties:
 *        deleted:
 *          type: boolean
 *          example: true
 * /attendees/{id}:
 *  tags:
 *    name: Attendees
 *  delete:
 *    summary: Elimina un asistente.
 *    tags: [Attendees]
 *    description: Método para eliminar asistente a un evento de la plataforma.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      201:
 *        description: Asistente eliminado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseDeleteAttendees'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.delete("/:id", authorization, async (request, response) => {
  try {
    const {
      params: { id },
    } = request;

    db.connect();
    await db
      .query({
        sql: `DELETE FROM attendees WHERE id=?`,
        values: [id],
      })
      .then(() => {
        response.status(200).json({
          deleted: true,
        });
      });
  } catch {
    response.status(500);
  }
});

module.exports = router;
