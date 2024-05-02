const db = require("./../database");

const getById = (id) => {
  db.connect();

  return db
    .query({
      sql: `SELECT * FROM images WHERE id=?`,
      values: [id],
    })
    .then(([results]) => results[0]);
};

const store = (url) => {
  db.connect();

  return db
    .query({
      sql: `
        INSERT INTO images(url)
        VALUES(?)
      `,
      values: [url],
    });
};

const remove = (id) => {
  db.connect();

  return db.query({
    sql: `DELETE FROM events WHERE id=?`,
    values: [id],
  });
};

module.exports = { getById, store, remove };
