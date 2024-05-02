const db = require("./../database");

const login = (data) => {
  const { username, password } = data;

  db.connect();
  return db.query({
    sql: `
      SELECT id, username
      FROM users
      WHERE username=? AND password=?
      LIMIT 1
    `,
    values: [username, password],
  })
  .then(([result]) => result[0]);
};

module.exports = { login };
