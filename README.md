# Como inciar el API REst

## Estructura del proyecto

- auth: Esta carpeta contiene el archivo encargado de la estrategia de seguridad de la API mediante un token JWT el cual se almacena en una cookie segura.
**NOTA: Se hace uso del token y refreh token**

- conf: Esta carpeta contiene la logica para la lectura de las variables de entorno, lectura que se hace con la liberia **dotenv**

- database: Como su nombre bien lo indica es la parte encargada de generar la instancia de conexión a la base de datos.

- environments: Aqui se tiene su respectivo archivo con variables de entorno para cada ambiente esperado: dev, test y producción.

- keys: Son las llaves con las cuales se firma el **token** y **refresh token**.

- public: Contiene las imagenes cargadas como portadas para cada evento creado.

- routes: Contiene las logica empleada por cada ruta o path.

- servicios: Contiene la logica o consumo de datos.

## Comandos disponibles

### `npm run start`
### `npm run start:dev`
### `npm run start:test`

**NOTA: Cada comando asinga su respectivo ambiente.**

## Ejecución del proyecto

### `npm install`
### `npm run start:dev`

**NOTA: Se debe configurar con anticipación MYSQL**

## Estructura de un archivo de variables de entorno

```env
#PORT
APP_PORT=3000

#JWT
JWT_PVT_KEY=./src/keys/jwt.private.key
JWT_REFRESH_PVT_KEY=./src/keys/jwt-refresh.private.key

#DATABASE
HOST=localhost
PORT=3306
USERNAME=root
PASSWORD=1234
DATABASE=event-management
```

## Archivo para la estructura de datos DDL

### `datatabase.sql`

## Archivo para la carga de datos DML

### `data.sql`

## Carga masiva de eventos nuevos o actualización

### `new-events.csv`
### `update-events.csv`

**NOTA: Para una actualización exitosa de eventos de forma masiva se debe incluir la columna `id` en el archivo .csv y la columna `dates` se repite ya que un evento puede tener una o varias fechas.**

Como ultimo la plataforma cuenta con dos tipos de usuarios "Administrador" y "Usuario".