const express = require("express");
const router = express.Router();
const multer = require("multer");
const { parse } = require("csv-parse");
const { extname } = require("path");

const authorization = require("./../auth");
const eventService = require("./../services/events");
const imageService = require("./../services/images");

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
 *              type: array
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
    const events = await eventService.getAll();

    response.status(200).json(events);
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
 *              type: object
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

    const event = await eventService.getById(id);

    if (event) {
      response.status(200).json(event);
    } else {
      response.status(404);
    }
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
 *      required:
 *        - title
 *        - image
 *        - startDate
 *        - endDate
 *        - location
 *        - latitude
 *        - longitude
 *        - userId
 *      properties:
 *        title:
 *          type: string
 *          example: La Sonora 2024
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
 *          type: string
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
 *              type: object
 *              $ref: '#/components/schemas/ResponseEvent'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", authorization, async (request, response) => {
  try {
    const { body } = request;

    await eventService.store(body);

    response.status(201).json({
      inserted: true,
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
    const { body } = request;

    await eventService.update(body);

    response.status(201).json({
      updated: true,
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
    response.status(500);
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
 * /events/upload:
 *  tags:
 *    name: Events
 *  post:
 *    summary: Cargar la imagen de un evento.
 *    tags: [Events]
 *    description: Método para cargar la imagen de un evento en la plataforma.
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
  "/upload",
  authorization,
  upload.single("file"),
  async (request, response) => {
    try {
      const { file } = request;

      if (!file) return response.status(400);

      const { filename } = file;
      const url = `/uploads/${filename}`;

      const imageId = await imageService
        .store(url)
        .then((result) => result[0].insertId);

      response.status(201).json({
        uploaded: true,
        imageId,
        url,
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
 *            $ref: '#/components/schemas/Events'
 *        failed:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Events'
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

      if (!file) return response.status(400);

      const { buffer } = file;

      parse(
        buffer,
        {
          delimiter: ",",
          fromLine: 2,
          columns: [
            "title",
            "startDate",
            "endDate",
            "location",
            "latitude",
            "longitude",
          ],
        },
        async (error, events) => {
          if (error) return response.status(400).json(error);

          const { id } = request;
          const imported = await eventService.csv(events, id);

          response.status(201).json(imported);
        }
      );
    } catch {
      response.status(500);
    }
  }
);

module.exports = router;
