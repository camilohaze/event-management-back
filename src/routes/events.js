const express = require("express");
const router = express.Router();
const authorization = require("../auth/authorization");
const db = require("./../database/connection");

/**
 * @swagger
 * components:
 *  schemas:
 *    Events:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        title:
 *          type: string
 *          example: La Solar 2024
 *        image:
 *          type: string
 *          example: https://picsum.photos/400/200
 *        startDate:
 *          type: string
 *          example: 01/05/2024
 *        endDate:
 *          type: string
 *          example: 05/05/2024
 *        location:
 *          type: string
 *          example: Parque Norte
 *        latitude:
 *          type: string
 *          example: 6.2723557
 *        longitude:
 *          type: string
 *          example: -75.5679465818133
 *        userId:
 *          type: integer
 *          example: 1
 * /events:
 *  tags:
 *    name: Events
 *  get:
 *    summary: Retorna una lista de eventos.
 *    tags: [Events]
 *    description: Método para retornar una lista de eventos.
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
    await db.query({
      sql: `SELECT * FROM events`,
    }).then(([results]) => {
      response.status(200).json(results);
      db.destroy();
    });
  } catch {
    response.status(500);
  }
});

/**
 * @swagger
 * /events/{id}:
 *  tags:
 *    name: Events
 *  get:
 *    summary: Retorna un evento por su id.
 *    tags: [Events]
 *    description: Retorna un evento por su id.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Ok.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Events'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.get("/:id", authorization, async (request, response) => {
  try {
    const {
      params: { id },
    } = request;

    db.connect();
    await db.query({
      sql: `SELECT * FROM events WHERE id=?`,
      values: [id],
    }).then(([results]) => {
      response.status(200).json(results[0]);
    });
  } catch {
    response.status(500);
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestEvent:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          required: true
 *          example: La Sonora 2024
 *        image:
 *          type: string
 *          example: https://picsum.photos/400/200
 *        startDate:
 *          type: string
 *          required: true
 *          example: 01/05/2024
 *        endDate:
 *          type: string
 *          required: true
 *          example: 05/05/2024
 *        location:
 *          type: string
 *          required: true
 *          example: Parque Norte
 *        latitude:
 *          type: string
 *          required: true
 *          example: 6.2723557
 *        longitude:
 *          type: string
 *          required: true
 *          example: -75.5679465818133
 *        userId:
 *          type: string
 *          required: true
 *          example: 1
 *    ResponseEvent:
 *      type: object
 *      properties:
 *        inserted:
 *          type: boolean
 *          example: true
 * /events:
 *  tags:
 *    name: Events
 *  post:
 *    summary: Registrar un evento.
 *    tags: [Events]
 *    description: Método para registrar un evento nuevo en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestEvent'
 *    responses:
 *      201:
 *        description: Evento creado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseEvent'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", authorization, async (request, response) => {
  try {
    const {
      body: { title, startDate, endDate, location, latitude, longitude, userId },
    } = request;

    db.connect();
    await db.query({
      sql: `
        INSERT INTO events(title, startDate, endDate, location, latitude, longitude, userId)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
      values: [title, startDate, endDate, location, latitude, longitude, userId],
    }).then(() => {
      response.status(201).json({
        inserted: true
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
 *    ResponseUpdateEvent:
 *      type: object
 *      properties:
 *        updated:
 *          type: boolean
 *          example: true
 * /events:
 *  tags:
 *    name: Events
 *  put:
 *    summary: Actualizar un evento.
 *    tags: [Events]
 *    description: Método para actualizar un evento nuevo en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestEvent'
 *    responses:
 *      201:
 *        description: Evento creado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseUpdateEvent'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.put("/", authorization, async (request, response) => {
  try {
    const {
      body: { id, title, startDate, endDate, location, latitude, longitude },
    } = request;

    db.connect();
    await db.query({
      sql: `
        UPDATE events
        SET title=?, startDate=?, endDate=?, location=?, latitude=?, longitude=?
        WHERE id=?`,
      values: [title, startDate, endDate, location, latitude, longitude, id],
    }).then(() => {
      response.status(201).json({
        updated: true
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
 *    ResponseDeleteEvent:
 *      type: object
 *      properties:
 *        deleted:
 *          type: boolean
 *          example: true
 * /events/{id}:
 *  tags:
 *    name: Events
 *  delete:
 *    summary: Elimina un evento.
 *    tags: [Events]
 *    description: Método para eliminar un evento de la plataforma.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      201:
 *        description: Evento eliminado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResponseDeleteEvent'
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
    await db.query({
      sql: `DELETE FROM events WHERE id=?`,
      values: [id],
    }).then(() => {
      response.status(200).json({
        deleted: true
      });
    });
  } catch {
    response.status(500);
  }
});

module.exports = router;
