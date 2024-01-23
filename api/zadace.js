const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.use(express.json());

router.post("/", (req, res) => {
    try {
        let novaZadaca = req.body;
        let stmt = "INSERT INTO zadace (naziv, rok) VALUES (?, ?)";
        const db = new sqlite3.Database('./classroom.db');
        db.run(stmt, [novaZadaca.naziv, novaZadaca.rok], function (error) {
            if (error) {
                console.error('Greška prilikom upisa u bazu podataka:', error.message);
                res.status(500).json({ error: 'Greška prilikom upisa u bazu podataka.' });
            } else {
                res.status(200).json({ message: 'Podatci su uspješno upisani u bazu.' });
            }
            db.close();
        });
    } catch (error) {
        console.error('Greška prilikom obrade zahtjeva:', error.message);
        res.status(500).json({ error: 'Greška prilikom obrade zahtjeva.' });
    }
});

router.get("/", (request,response)=>{
    let zadace=[]
    const db = new sqlite3.Database('./classroom.db');
    db.all('SELECT * FROM zadace', (error, rows) => {
        if (error) {
            ;
        }else{
            zadace = rows
        }
        response.send(zadace);
        db.close()
    })
})

router.delete("/:id", (req, res) => {
    try {
        let zadacaId = req.params.id;
        let stmt = "DELETE FROM zadace WHERE id = ?";
        const db = new sqlite3.Database('./classroom.db');
        db.run(stmt, [zadacaId], function (error) {
            if (error) {
                console.error('Greška prilikom brisanja iz baze podataka:', error.message);
                res.status(500).json({ error: 'Greška prilikom brisanja iz baze podataka.' });
            } else {
                res.status(200).json({ message: 'Zadaća uspješno obrisana iz baze.' });
            }
            db.close();
        });
    } catch (error) {
        console.error('Greška prilikom obrade zahtjeva za brisanje zadaće:', error.message);
        res.status(500).json({ error: 'Greška prilikom obrade zahtjeva za brisanje zadaće.' });
    }
});

module.exports = router;
