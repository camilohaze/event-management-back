const db = require("../database");

const getAll = async () => {
  db.connect();

  return db
    .query({
      sql: `
        SELECT *
        FROM categories
      `,
    })
    .then(([results]) => results);
};

const getById = async (id) => {
  db.connect();

  return db
    .query({
      sql: `
        SELECT *,
        FROM categories
        WHERE id=?
      `,
      values: [id],
    })
    .then(([results]) => {
      if (!!results[0].id) {
        return results[0];
      }

      return;
    });
};

const store = async (category) => {
  const { name } = category;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO categories(name)
      VALUES(?)
    `,
    values: [name],
  });
};

const update = async (category) => {
  const { id, name } = category;

  db.connect();
  return db.query({
    sql: `
      UPDATE categories
      SET name=?
      WHERE id=?
    `,
    values: [name, id],
  });
};

const remove = async (id) => {
  db.connect();

  return db.query({
    sql: `
      DELETE FROM categories
      WHERE id=?
    `,
    values: [id],
  });
};

module.exports = { getAll, getById, store, update, remove };
