const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    let noviKorisnik = req.body;

    console.log(noviKorisnik);

    let stmt =
      "INSERT INTO studenti (ime, prezime, mail, lozinka) VALUES (?, ?, ?, ?) returning id";
    req.DB.run(
      stmt,
      [
        noviKorisnik.ime,
        noviKorisnik.prezime,
        noviKorisnik.mail,
        noviKorisnik.lozinka,
      ],
      function (error) {
        if (error) {
          console.error(
            "Greška prilikom upisa u bazu podataka:",
            error.message
          );

          return res
            .status(500)
            .json({ error: "Greška prilikom upisa u bazu podataka." });
        }

        const studentId = this.lastID;

        if (!noviKorisnik.subject || !Array.isArray(noviKorisnik.subject)) {
          console.error("Invalid or missing 'subject' property");
          return res.status(400).json({ error: "Invalid or missing 'subject' property" });
        }
        
        for (const predmet of noviKorisnik.subject) {
          req.DB.run(
            "INSERT INTO predmeti_studenti (predmet_id, student_id) VALUES (?, ?)",
            [predmet, studentId]
          );
        }        

        res
          .status(200)
          .json({ message: "Podatci su uspješno upisani u bazu." });
      }
    );
  } catch (error) {
    console.error("Greška prilikom obrade zahtjeva:", error.message);
    res.status(500).json({ error: "Greška prilikom obrade zahtjeva." });
  }
});

router.get("/", (request, response) => {
  if (!request.session || request.session.role !== "profesor") {
    return [];
  }

  let studenti = [];
  request.DB.all("SELECT * FROM studenti", (error, rows) => {
    if (error) {
    } else {
      studenti = rows;
    }
    response.send(studenti);
  });
});

router.get("/predmeti", async (req, res) => {
  if (!req.session || req.session.role !== "student") {
    return res.status(403).json([]);
  }

  const rows = await new Promise((resolve, reject) => {
    req.DB.all(
      `SELECT * FROM predmeti LEFT JOIN predmeti_studenti ON predmeti.id = predmeti_studenti.predmet_id WHERE predmeti_studenti.student_id = ?`,
      [req.session.data.id],
      (error, rows) => {
        if (error) {
          return reject(error);
        }

        return resolve(rows);
      }
    );
  }).catch((e) => {
    console.error(e);
    return null;
  });

  return res.json(rows);
});

router.delete("/:id", (req, res) => {
  try {
    let studentId = req.params.id;
    let stmt = "DELETE FROM studenti WHERE id = ?";
    req.DB.run(stmt, [studentId], function (error) {
      if (error) {
        console.error(
          "Greška prilikom brisanja iz baze podataka:",
          error.message
        );
        res
          .status(500)
          .json({ error: "Greška prilikom brisanja iz baze podataka." });
      } else {
        res.status(200).json({ message: "Student uspješno obrisan iz baze." });
      }
    });
  } catch (error) {
    console.error(
      "Greška prilikom obrade zahtjeva za brisanje studenta:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Greška prilikom obrade zahtjeva za brisanje studenta." });
  }
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const row = await new Promise((resolve, reject) => {
    request.DB.get(
      "SELECT * FROM studenti WHERE mail = ? AND lozinka = ?",
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
      role: "student",
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
