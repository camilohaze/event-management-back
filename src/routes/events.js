const express = require("express");
const router = express.Router();
const multer = require("multer");
const { parse } = require("csv-parse");
const { extname } = require("path");

const { authorization } = require("./../auth");
const eventService = require("./../services/events");
const imageService = require("./../services/images");
const dateService = require("./../services/dates");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtName = extname(file.originalname);
    const randomName = Array(16)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join("")
      .toUpperCase();

    cb(null, `events_${timestamp}-${randomName}${fileExtName}`);
  },
});
const upload = multer({ storage: storage });
const cvs = multer();

/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseEvents:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        title:
 *          type: string
 *          example: La Solar 2024
 *        description:
 *          type: string
 *          example: Una breve descripción
 *        startTime:
 *          type: string
 *          example: 21:00:00
 *        openingTime:
 *          type: string
 *          example: 20:00:00
 *        minimumAge:
 *          type: boolean
 *          example: true
 *        specialZone:
 *          type: boolean
 *          example: true
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
 *        categoryId:
 *          type: integer
 *          example: 1
 *        category:
 *          type: string
 *          example: Conciertos
 *        image:
 *          type: string
 *          example: https://picsum.photos/400/200
 *        dates:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Dates'
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
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ResponseEvents'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.get("/", async (request, response) => {
  try {
    const events = await eventService.getAll();

    if (events.length > 0) {
      return response.status(200).json(events);
    }

    return response.status(404).json([]);
  } catch {
    response.status(500).json();
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
 *              type: object
 *              $ref: '#/components/schemas/ResponseEvents'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.get("/:id", async (request, response) => {
  try {
    const {
      params: { id },
    } = request;

    const event = await eventService.getById(id);

    if (event) {
      return response.status(200).json(event);
    }

    return response.status(404).json();
  } catch (error) {
    return response.status(500).json();
  }
});

/**
 * @swagger
 * /events/user:
 *  tags:
 *    name: Events
 *  post:
 *    summary: Retorna una lista de eventos por el id del usuario en sesión.
 *    tags: [Events]
 *    description: Método para retornar una lista de eventos.
 *    responses:
 *      200:
 *        description: Ok.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ResponseEvents'
 *      404:
 *        description: No encontrado.
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/user", authorization, async (request, response) => {
  try {
    const {
      data: { id },
    } = request;

    const events = await eventService.getByUserId(id);

    if (events.length > 0) {
      return response.status(200).json(events);
    }

    return response.status(404).json();
  } catch (error) {
    return response.status(500).json();
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    Dates:
 *      type: object
 *      required:
 *        - date
 *        - eventId
 *      properties:
 *        date:
 *          type: string
 *          example: 2024-05-01
 *        eventId:
 *          type: integer
 *          example: 1
 *    RequestStoreEvent:
 *      type: object
 *      required:
 *        - title
 *        - description
 *        - startTime
 *        - openingTime
 *        - location
 *        - latitude
 *        - longitude
 *        - userId
 *        - categoryId
 *        - dates
 *      properties:
 *        title:
 *          type: string
 *          example: La Sonora 2024
 *        description:
 *          type: string
 *          example: Una breve drescripción
 *        startTime:
 *          type: string
 *          example: 21:00:00
 *        openingTime:
 *          type: string
 *          example: 20:00:00
 *        minimumAge:
 *          type: boolean
 *          example: true
 *        specialZone:
 *          type: boolean
 *          example: true
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
 *        categoryId:
 *          type: integer
 *          example: 1
 *        dates:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Dates'
 *    ResponseStoreEvent:
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
 *          $ref: '#/components/schemas/RequestStoreEvent'
 *    responses:
 *      201:
 *        description: Evento creado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseStoreEvent'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", authorization, async (request, response) => {
  try {
    const {
      body,
      data: { id },
    } = request;

    body.userId = id;

    const eventId = await eventService
      .store(body)
      .then((result) => result[0].insertId);

    for (let i = 0; i < body.dates.length; i++) {
      const date = {
        date: body.dates[i].date,
        eventId,
      };

      await dateService.store(date);
    }

    response.status(201).json({
      inserted: true,
      eventId,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json();
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestUpdateEvent:
 *      type: object
 *      required:
 *        - id
 *        - title
 *        - description
 *        - startTime
 *        - openingTime
 *        - location
 *        - latitude
 *        - longitude
 *        - userId
 *        - categoryId
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        title:
 *          type: string
 *          example: La Sonora 2024
 *        description:
 *          type: string
 *          example: Una breve drescripción
 *        startTime:
 *          type: string
 *          example: 21:00:00
 *        openingTime:
 *          type: string
 *          example: 20:00:00
 *        minimumAge:
 *          type: boolean
 *          example: true
 *        specialZone:
 *          type: boolean
 *          example: true
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
 *        categoryId:
 *          type: integer
 *          example: 1
 *        dates:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/RequestDates'
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
 *    description: Método para actualizar un evento en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestUpdateEvent'
 *      - in: formData
 *        name: file
 *        schema:
 *          type: file
 *        type: file
 *    responses:
 *      201:
 *        description: Evento actualizado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseUpdateEvent'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.put("/", authorization, async (request, response) => {
  try {
    const { body, body: { id } } = request;

    await eventService.update(body);
    await dateService.removeByEventId(id);

    for (let i = 0; i < body.dates.length; i++) {
      const date = {
        date: body.dates[i].date,
        eventId: id,
      };

      await dateService.store(date);
    }

    response.status(201).json({
      updated: true,
    });
  } catch(error) {
    console.log(error);
    response.status(500).json();
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
 *              type: object
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

    await eventService.remove(id);

    response.status(200).json({
      deleted: true,
    });
  } catch {
    response.status(500).json();
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseUpload:
 *      type: object
 *      properties:
 *        uploaded:
 *          type: boolean
 *          example: true
 *        imageId:
 *          type: integer
 *          example: 1
 *        url:
 *          type: string
 *          example: /uploads/events_1714622296244-30AA2A625AD0C4DF.png
 * /events/upload/{eventId}:
 *  tags:
 *    name: Events
 *  post:
 *    summary: Cargar la imagen de un evento.
 *    tags: [Events]
 *    description: Método para cargar la imagen de un evento en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *      - in: formData
 *        name: file
 *        schema:
 *          type: file
 *        type: file
 *        required: true
 *    responses:
 *      201:
 *        description: Imagen cargada.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseUpload'
 *      400:
 *        description: Falta el archivo para cargar
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post(
  "/upload/:eventId",
  authorization,
  upload.single("file"),
  async (request, response) => {
    try {
      const {
        file,
        params: { eventId },
      } = request;

      if (!file) return response.status(400);

      let fullUrl = request.protocol + "://" + request.get("host");
      const { filename } = file;
      const url = `${fullUrl}/uploads/${filename}`;

      const image = {
        url,
        eventId,
      };

      await imageService.store(image);

      response.status(201).json({
        uploaded: true,
      });
    } catch {
      response.status(500);
    }
  }
);

/**
 * @swagger
 * components:
 *  schemas:
 *    ItemsImported:
 *      type: object
 *      properties:
 *        quantity:
 *          type: integer
 *          example: 10
 *        success:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/ResponseEvents'
 *        failed:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/ResponseEvents'
 *    ResponseImport:
 *      type: object
 *      properties:
 *        error:
 *          type: boolean
 *          example: true
 *        imported:
 *          type: oject
 *          $ref: '#/components/schemas/ItemsImported'
 * /events/import:
 *  tags:
 *    name: Events
 *  post:
 *    summary: Importar eventos masivos.
 *    tags: [Events]
 *    description: Método para eventos masivos en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: formData
 *        name: file
 *        schema:
 *          type: file
 *        type: file
 *        required: true
 *    responses:
 *      201:
 *        description: Eventos importados.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseImport'
 *      400:
 *        description: Falta el archivo para cargar
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post(
  "/import",
  authorization,
  cvs.single("file"),
  async (request, response) => {
    try {
      const { file } = request;

      if (!file) return response.status(400).json();

      const { buffer } = file;

      parse(
        buffer,
        {
          delimiter: ",",
          groupColumnsByName: true,
          fromLine: 1,
          columns: true,
        },
        async (error, events) => {
          if (error) return response.status(400).json(error);

          const {
            data: { id },
          } = request;
          const imported = await eventService.csv(events, id);

          response.status(201).json(imported);
        }
      );
    } catch {
      response.status(500).json();
    }
  }
);

module.exports = router;
