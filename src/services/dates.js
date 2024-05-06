const db = require("./../database");

const store = async (dates) => {
  const { date, eventId } = dates;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO dates(date, eventId)
      VALUES(?, ?)
    `,
    values: [date, eventId],
  });
};

const update = async (dates) => {
  const { id, date, eventId } = dates;

  db.connect();
  return db.query({
    sql: `
      UPDATE dates
      SET date=?, eventId=?
      WHERE id=?
    `,
    values: [date, eventId, id],
  });
};

const remove = async (id) => {
  db.connect();

  return db.query({
    sql: `
      DELETE FROM dates
      WHERE id=?
    `,
    values: [id],
  });
};

const removeByEventId = async (id) => {
  db.connect();

  return db.query({
    sql: `
      DELETE FROM dates
      WHERE eventId=?
    `,
    values: [id],
  });
};

module.exports = { store, update, remove, removeByEventId };