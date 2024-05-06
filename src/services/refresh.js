const db = require("./../database");

const login = (data) => {
  const { id, username } = data;

  db.connect();
  return db.query({
    sql: `
      SELECT id, username, role
      FROM users
      WHERE id= ? AND username=?
      LIMIT 1
    `,
    values: [id, username],
  })
  .then(([result]) => result[0]);
};

module.exports = { login };
