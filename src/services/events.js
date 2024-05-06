const db = require("./../database");
const imagesService = require("./../services/images");
const datesService = require("./../services/dates");

const getAll = async () => {
  db.connect();

  return db
    .query({
      sql: `
        SELECT
          events.*,
          categories.name AS category,
          images.url as image,
          CONCAT('[', GROUP_CONCAT(CONCAT('{id: ', dates.id, ', date: "',dates.date,'"}')), ']') as dates
        FROM events
        LEFT JOIN categories ON events.categoryId = categories.id
        LEFT JOIN images ON events.id = images.eventId
        LEFT JOIN dates ON events.id = dates.eventID
        GROUP BY events.id
      `,
    })
    .then(([results]) => {
      results.forEach((result) => {
        result.dates = eval(result.dates);
      });

      return results;
    });
};

const getByUserId = async (id) => {
  db.connect();

  return db
    .query({
      sql: `
        SELECT
          events.*,
          categories.name AS category,
          images.url as image,
          CONCAT('[', GROUP_CONCAT(CONCAT('{id: ', dates.id, ', date: "',dates.date,'"}')), ']') as dates
        FROM events
        LEFT JOIN categories ON events.categoryId = categories.id
        LEFT JOIN images ON events.id = images.eventId
        LEFT JOIN dates ON events.id = dates.eventID
        WHERE events.userId=?
        GROUP BY events.id
      `,
      values: [id],
    })
    .then(([results]) => {
      results.forEach((result) => {
        result.dates = eval(result.dates);
      });

      return results;
    });
};

const getById = async (id) => {
  db.connect();

  return db
    .query({
      sql: `
        SELECT 
          events.*,
          categories.name AS category,
          images.url as image,
          CONCAT('[', GROUP_CONCAT(CONCAT('{id: ', dates.id, ', date: "',dates.date,'"}')), ']') as dates
        FROM events
        LEFT JOIN categories ON events.categoryId = categories.id
        LEFT JOIN images ON events.id = images.eventId
        LEFT JOIN dates ON events.id = dates.eventID
        WHERE events.id=?
      `,
      values: [id],
    })
    .then(([results]) => {
      if (!!results[0].id) {
        results[0].dates = eval(results[0].dates);

        return results[0];
      }

      return;
    });
};

const store = async (event) => {
  const {
    title,
    description,
    startTime,
    openingTime,
    minimumAge,
    specialZone,
    location,
    latitude,
    longitude,
    userId,
    categoryId,
  } = event;

  db.connect();

  return db.query({
    sql: `
      INSERT INTO events(title, description, startTime, openingTime, minimumAge, specialZone, location, latitude, longitude, userId, categoryId)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    values: [
      title,
      description,
      startTime,
      openingTime,
      Number(Boolean(minimumAge)),
      Number(Boolean(specialZone)),
      location,
      latitude,
      longitude,
      userId,
      categoryId,
    ],
  });
};

const update = async (event) => {
  const {
    id,
    title,
    description,
    startTime,
    openingTime,
    minimumAge,
    specialZone,
    location,
    latitude,
    longitude,
    userId,
    categoryId,
  } = event;

  try {
    db.connect();
    return db
      .query({
        sql: `
        UPDATE events
        SET
          title=?, description=?, startTime=?,
          openingTime=?, minimumAge=?, specialZone=?,
          location=?, latitude=?, longitude=?,
          userId=?, categoryId=?
        WHERE id=?
      `,
        values: [
          title,
          description,
          startTime,
          openingTime,
          minimumAge,
          specialZone,
          location,
          latitude,
          longitude,
          userId,
          categoryId,
          id,
        ],
      });
  } catch (error) {
    throw error;
  }
};

const remove = async (id) => {
  db.connect();

  return db.query({
    sql: `
      DELETE FROM events
      WHERE id=?
    `,
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

    event.userId = userId;

    quantity++;

    let eventId;

    try {
      if (!event.id) {
        eventId = await store(event).then((result) => result[0].insertId);
      } else {
        eventId = event.id;

        await update(event);
        await imagesService.removeByEventId(eventId);
        await datesService.removeByEventId(eventId);
      }

      const image = {
        url: event.image,
        eventId,
      };

      await imagesService.store(image);

      for (let x = 0; x < event.dates.length; x++) {
        const date = {
          date: event.dates[x],
          eventId
        };

        await datesService.store(date);
      }

      success.push(event);
    } catch(error) {
      if (!!eventId) {
        remove(eventId);
      }
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

module.exports = { getAll, getByUserId, getById, store, update, remove, csv };
