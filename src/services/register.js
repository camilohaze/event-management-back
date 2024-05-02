const db = require("./../database");

const register = async (user) => {
  const { username, password, firstName, lastName, phone } = user;

  try {
    db.connect();
    db.beginTransaction();
    db.query({
      sql: `INSERT INTO users(username, password) VALUES(?, ?)`,
      values: [username, password],
    }).then((result) => {
      const { insertId } = result[0];

      db.query({
        sql: `INSERT INTO profiles(firstName, lastName, phone, userId) VALUES(?, ?, ?, ?)`,
        values: [firstName, lastName, phone, insertId],
      });
    });
    db.commit();
  } catch (error) {
    return  error;
  }
};

module.exports = { register };
