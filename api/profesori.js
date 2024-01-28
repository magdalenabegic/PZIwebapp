const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  let profesori = [];
  request.DB.all("SELECT * FROM profesori", (error, rows) => {
    if (error) {
    } else {
      profesori = rows;
    }
    response.send(profesori);
  });
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const row = await new Promise((resolve, reject) => {
    request.DB.get(
      "SELECT * FROM profesori WHERE mail = ? AND lozinka = ?",
      [email, password],
      (error, row) => {
        if (error) {
          return reject(error);
        }

        return resolve(row);
      }
    );
  }).catch((e) => {
    console.error(e);

    return null;
  });

  if (!row) {
    return response.json({
      success: false,
      error: "invalid_credentials",
    });
  }

  const sessionId = Math.random().toString(36).substring(2);

  // Napravi novi session i spremi ga u bazu
  {
    const sessionData = {
      role: "profesor",
      data: row,
    };
    const sessionDataString = JSON.stringify(sessionData);

    request.DB.run("INSERT INTO sessions (session_id, data) VALUES (?, ?)", [
      sessionId,
      sessionDataString,
    ]);
  }

  // Pošalji cookie korisniku sa session id-om
  {
    response.cookie("mySession", sessionId, {
      httpOnly: true,
    });
  }

  return response.json({
    success: true,
  });
});

module.exports = router;
