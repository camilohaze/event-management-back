const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const swagger = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const app = express();
const config = require("./src/config");

const {
  parsed: { APP_PORT },
} = config;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Event Management API",
      description: "Documentación de la API para su uso.",
      contact: {
        name: "Cristian Camilo Naranjo Valencia",
        url: "https://www.linkedin.com/in/cristiannaranjo/",
      },
      server: [`http://localhost:${APP_PORT}`],
    },
    components: {
      securitySchemes: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        bearerFormat: "JWT",
      },
    },
  },
  basePath: "/",
  apis: [
    "./src/routes/login.js",
    "./src/routes/refresh.js",
    "./src/routes/logout.js",
    "./src/routes/register.js",
    "./src/routes/events.js",
    "./src/routes/attendees.js",
    "./src/routes/categories.js",
  ],
};

const whitelist = [
  undefined,
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost',
];
const corsSettings = {
  origin: (origin, callback) => {
    if (origin) {
      if (whitelist.includes(origin)) {
        callback(null, true);
      }
    } else {
      callback(null, true);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  optionsSuccessStatus: 204,
  preflightContinue: true,
  credentials: true,
};

app.use(cors(corsSettings));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("src/public"));

const swaggerDocumentation = swagger(swaggerOptions);

const login = require("./src/routes/login");
const refresh = require("./src/routes/refresh");
const logout = require("./src/routes/logout");
const register = require("./src/routes/register");

const events = require("./src/routes/events");
const attendees = require("./src/routes/attendees");

const categories = require("./src/routes/categories");

app.get("/", (request, response) => {
  response.json({
    api: "Event Management API Rest",
    version: "1.0.0",
  });
});

/**
 * Autenticación de usuarios y registro.
 */
app.use("/login", login);
app.use("/refresh", refresh);
app.use("/logout", logout);
app.use("/register", register);

/**
 * Consultar información de eventos, crearlos, actualizarlos, eliminarlos y hacer carga masiva con archivos formato CSV.
 */
app.use("/events", events);

/**
 * Consultar información de asistentes, crearlos y eliminarlos.
 */
app.use("/attendees", attendees);

/**
 * Consultar categorias, crearlas, actualizarlas y eliminarlas.
 */
app.use("/categories", categories);

/**
 * Swagger para la documentación.
 */
app.use("/help", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

/**
 * Inicio del servicio.
 */
app.listen(APP_PORT, () => {
  console.log(`App listening on http://localhost:${APP_PORT}`);
});
