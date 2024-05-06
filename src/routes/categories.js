const express = require("express");
const router = express.Router();

const { authorization } = require("./../auth");
const categoriesService = require("./../services/categories");

/**
 * @swagger
 * components:
 *  schemas:
 *    Categories:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        name:
 *          type: string
 *          example: Conciertos
 * /categories:
 *  tags:
 *    name: Categories
 *  get:
 *    summary: Retorna una lista de categorias.
 *    tags: [Categories]
 *    description: Método para retornar una lista de categorias.
 *    responses:
 *      200:
 *        description: Ok.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Categories'
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
    const events = await categoriesService.getAll();

    if (events.length > 0) {
      return response.status(200).json(events);
    }

    return response.status(404).json([]);
  } catch (error) {
    response.status(500).json();
  }
});

/**
 * @swagger
 * /categories/{id}:
 *  tags:
 *    name: Categories
 *  get:
 *    summary: Retorna una categoría por su id.
 *    tags: [Categories]
 *    description: Retorna un categoría por su id.
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
 *              $ref: '#/components/schemas/Categories'
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

    const event = await categoriesService.getById(id);

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
 * components:
 *  schemas:
 *    RequestCategory:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Conciertos
 *    ResponseCategory:
 *      type: object
 *      properties:
 *        inserted:
 *          type: boolean
 *          example: true
 * /categories:
 *  tags:
 *    name: Categories
 *  post:
 *    summary: Registrar una categoría.
 *    tags: [Categories]
 *    description: Método para registrar una categoría nueva en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestCategory'
 *    responses:
 *      201:
 *        description: Categoría creada.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseCategory'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.post("/", authorization, async (request, response) => {
  try {
    const { body } = request;

    await categoriesService.store(body);

    response.status(201).json({
      inserted: true,
    });
  } catch {
    response.status(500).json();
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ResponseUpdateCategory:
 *      type: object
 *      properties:
 *        updated:
 *          type: boolean
 *          example: true
 * /categories:
 *  tags:
 *    name: Categories
 *  put:
 *    summary: Actualizar una categoría.
 *    tags: [Categories]
 *    description: Método para actualizar una categoría en la plataforma.
 *    consumes: application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/RequestCategory'
 *    responses:
 *      201:
 *        description: Categoría actualizada.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseUpdateCategory'
 *      401:
 *        description: Falta información de autorización o no es válida
 *      500:
 *        description: Error interno del servidor
 *
 */
router.put("/", authorization, async (request, response) => {
  try {
    const { body } = request;

    await categoriesService.update(body);

    response.status(201).json({
      updated: true,
    });
  } catch {
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
 * /categories/{id}:
 *  tags:
 *    name: Categories
 *  delete:
 *    summary: Elimina una categoría.
 *    tags: [Categories]
 *    description: Método para eliminar una categoría de la plataforma.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      201:
 *        description: Categoría eliminada.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ResponseDeleteCategory'
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

    await categoriesService.remove(id);

    response.status(200).json({
      deleted: true,
    });
  } catch {
    response.status(500).json();
  }
});

module.exports = router;
