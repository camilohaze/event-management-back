const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV;

const path = require('path')
const express = require('express');
const cookieParser = require('cookie-parser');
const swagger = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Event Management API',
      description: 'Documentación de la API para su uso.',
      contact: {
        name: 'Cristian Camilo Naranjo Valencia',
        url: 'https://www.linkedin.com/in/cristiannaranjo/'
      },
      server: [`http://localhost:${PORT}`]
    },
    components: {
      securitySchemes: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        bearerFormat: 'JWT'
      }
    }
  },
  basePath: '/',
  apis: [
    './src/routes/login.js',
    './src/routes/logout.js',
    './src/routes/register.js'
  ],
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV === 'development') {
  const livereload = require('livereload');
  const connect = require('connect-livereload');

  const reloadServer = livereload.createServer();

  reloadServer.watch(path.join(__dirname, "dist"));
  reloadServer.server.once("connection", () => {
    setTimeout(() => {
      reloadServer.refresh("/");
    }, 100);
  });
  app.use(connect());
}

const swaggerDocumentation = swagger(swaggerOptions);

const login = require('./src/routes/login');
const logout = require('./src/routes/logout');
const register = require('./src/routes/register');

const events = require('./src/routes/events');

app.get('/', (request, response) => {
  response.json({
    api: 'Event Management API Rest',
    version: '1.0.0'
  });
});

/**
 * Autenticación de usuarios y registro.
 */
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);

/**
 * Crear eventos, Actualizar eventos, Eliminar eventos.
 */
app.use('/events', events);

/**
 * Registro de asistentes.
 */
// app.use('/attendees', {});

/**
 * Consultar información de eventos, asistentes y lugares cercanos.
 */
// app.use('/details', {});

/**
 * Swagger para la documentación.
 */
app.use('/help', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

/**
 * Inicio del servicio.
 */
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});