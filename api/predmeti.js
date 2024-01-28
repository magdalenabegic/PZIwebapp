// Primjer za API ruta /api/studenti/predmeti

const express = require("express");
const router = express.Router();

router.get("/predmeti", async (req, res) => {
  if (!req.session || req.session.role !== "student") {
    return res.status(403).json([]);
  }

  try {
    const rows = await new Promise((resolve, reject) => {
      req.DB.all(
        `
        SELECT 
          predmeti.id AS predmet_id, 
          predmeti.naziv AS predmet_naziv, 
          profesori.id AS profesor_id, 
          profesori.ime AS profesor_ime, 
          profesori.prezime AS profesor_prezime 
        FROM predmeti
        LEFT JOIN predmeti_studenti ON predmeti.id = predmeti_studenti.predmet_id
        LEFT JOIN profesori ON predmeti.profesor_id = profesori.id
        WHERE predmeti_studenti.student_id = ?
        `,
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
  } catch (error) {
    console.error("Error fetching subjects with professors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
