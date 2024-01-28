const express = require("express");
const router = express.Router();

router.get("/predmeti", async (req, res) => {
  if (!req.session || req.session.role !== "student") {
    return res.status(403).json([]);
  }

  try {
    const rows = await req.DB.all(
      `SELECT predmeti.id, predmeti.naziv FROM predmeti
      LEFT JOIN predmeti_studenti ON predmeti.id = predmeti_studenti.predmet_id
      WHERE predmeti_studenti.student_id = ?`,
      [req.session.data.id]
    );

    return res.json(rows);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
