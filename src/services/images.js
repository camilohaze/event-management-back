const fs = require("fs");
const db = require("../database");

const store = async (image) => {
  const { url, eventId } = image;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO images(url, eventId)
      VALUES(?, ?)
    `,
    values: [url, eventId],
  });
};

const update = async (category) => {
  const { id, url } = category;

  db.connect();
  return db.query({
    sql: `
      UPDATE images
      SET url=?
      WHERE id=?
    `,
    values: [url, id],
  });
};

const remove = async (id) => {
  db.connect();

  return db.query({
    sql: `
      DELETE FROM images
      WHERE id=?
    `,
    values: [id],
  });
};

const removeByEventId = async (id) => {
  db.connect();

  return db.query({
    sql: `
      DELETE FROM images
      WHERE eventId=?
    `,
    values: [id],
  });
};

const removeFile = (path) => {
  fs.unlinkSync(path);
};

module.exports = { store, update, remove, removeByEventId, removeFile };
