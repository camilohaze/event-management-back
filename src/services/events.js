const db = require("./../database");
const formatDate = require("./../utilities/format-date");
const eventService = require("./../services/images");

const getAll = async () => {
  db.connect();

  return db
    .query({
      sql: `SELECT * FROM events`,
    })
    .then(([results]) => results);
};

const getById = async (id) => {
  db.connect();

  return db
    .query({
      sql: `SELECT * FROM events WHERE id=?`,
      values: [id],
    })
    .then(([results]) => results[0]);
};

const store = async (event) => {
  const {
    title,
    startDate,
    endDate,
    location,
    latitude,
    longitude,
    userId,
    imageId,
  } = event;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO events(title, startDate, endDate, location, latitude, longitude, userId, imageId)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `,
    values: [
      title,
      formatDate(startDate),
      formatDate(endDate),
      location,
      latitude,
      longitude,
      userId,
      imageId,
    ],
  });
};

const update = async (event) => {
  const {
    id,
    title,
    startDate,
    endDate,
    location,
    latitude,
    longitude,
    imageId,
  } = event;

  db.connect();
  return db.query({
    sql: `
      UPDATE events
      SET title=?, startDate=?, endDate=?, location=?, latitude=?, longitude=?, imageId=?
      WHERE id=?
    `,
    values: [
      title,
      formatDate(startDate),
      formatDate(endDate),
      location,
      latitude,
      longitude,
      imageId,
      id,
    ],
  });
};

const remove = async (id) => {
  db.connect();

  return db.query({
    sql: `DELETE FROM events WHERE id=?`,
    values: [id],
  });
};

let quantity = 0;
let success = [];
let failed = [];

const csv = async (events, userId) => {
  quantity = 0;
  success = [];
  failed = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const imageId = await eventService
      .store("/uploads/400x200.png")
      .then((result) => result[0].insertId);

    event.userId = userId;
    event.imageId = imageId;

    quantity++;

    try {
      await store(event);

      success.push(event);
    } catch {
      failed.push(event);
    }
  }

  return {
    error: failed.length ? true : false,
    imported: {
      quantity,
      success,
      failed,
    },
  };
};

module.exports = { getAll, getById, store, update, remove, csv };
