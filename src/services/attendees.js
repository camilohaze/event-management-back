const db = require("./../database");

const getByEventId = async (eventId) => {
  db.connect();

  return db
    .query({
      sql: `SELECT * FROM attendees WHERE eventId=?`,
      values: [eventId],
    })
    .then(([results]) => results);
};

const getByUserId = async (userId) => {
  db.connect();

  return db
    .query({
      sql: `SELECT * FROM attendees WHERE userId=?`,
      values: [userId],
    })
    .then(([results]) => results);
};

const store = async (attendees) => {
  const { date, eventId, userId } = attendees;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO attendees(date, eventId, userId)
      VALUES(?, ?, ?)
    `,
    values: [date, eventId, userId],
  });
};

const update = async (attendees) => {
  const { id, date } = attendees;

  db.connect();

  return db.query({
    sql: `
      UPDATE attendees
      SET date=?
      WHERE id=?
    `,
    values: [date, id],
  });
};

const remove = (id) => {
  db.connect();

  return db.query({
    sql: `DELETE FROM attendees WHERE id=?`,
    values: [id],
  });
};

module.exports = { getByEventId, getByUserId, store, update, remove };
