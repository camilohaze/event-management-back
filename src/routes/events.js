const express = require("express");
const router = express.Router();
const authorization = require("../auth/authorization");
const db = require("./../database/connection");

router.get("/", authorization, (request, response) => {
  try {
    db.connect();
    db.query(
      `
      SELECT *
      FROM events
    `,
      (error, events) => {
        if (error) throw error;

        response
          .status(200)
          .json(events.shift());
      }
    );
    db.end();
  } catch {
    // code here!
  }
});

module.exports = router;
