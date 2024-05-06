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
  const { date, dateId, eventId, userId } = attendees;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO attendees(date, dateId, eventId, userId)
      VALUES(?, ?, ?, ?)
    `,
    values: [date, dateId, eventId, userId],
  });
};

const remove = (id) => {
  db.connect();

  return db.query({
    sql: `DELETE FROM attendees WHERE id=?`,
    values: [id],
  });
};

const removeDateId = (id) => {
  db.connect();

  return db.query({
    sql: `DELETE FROM attendees WHERE dateId=?`,
    values: [id],
  });
};

const removeEventId = (id) => {
  db.connect();

  return db.query({
    sql: `DELETE FROM attendees WHERE eventId=?`,
    values: [id],
  });
};

module.exports = {
  getByEventId,
  getByUserId,
  store,
  remove,
  removeDateId,
  removeEventId,
};
