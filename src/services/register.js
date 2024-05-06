const db = require("./../database");

const register = async (user) => {
  const { username, password, firstName, lastName, phone } = user;

  try {
    db.connect();
    await db.beginTransaction();
    await db.query({
      sql: `INSERT INTO users(username, password) VALUES(?, ?)`,
      values: [username, password],
    }).then(async (result) => {
      const { insertId } = result[0];

      await db.query({
        sql: `INSERT INTO profiles(firstName, lastName, phone, userId) VALUES(?, ?, ?, ?)`,
        values: [firstName, lastName, phone, insertId],
      });
    });
    await db.commit();
  } catch (error) {
    await db.rollback();

    throw error;
  }
};

module.exports = { register };
