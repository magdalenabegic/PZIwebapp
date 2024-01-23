const express = require("express");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.use(express.json());

router.post("/", (req, res) => {
    try {
        let noviKorisnik = req.body;
        let stmt = "INSERT INTO studenti (ime, prezime, mail, lozinka) VALUES (?, ?, ?, ?)";
        const db = new sqlite3.Database('./classroom.db');
        db.run(stmt, [noviKorisnik.ime, noviKorisnik.prezime, noviKorisnik.mail, noviKorisnik.lozinka], function (error) {
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
    let studenti=[]
    const db = new sqlite3.Database('./classroom.db');
    db.all('SELECT * FROM studenti', (error, rows) => {
        if (error) {
            ;
        }else{
            studenti = rows
        }
        response.send(studenti);
        db.close()
    })
})

router.delete("/:id", (req, res) => {
    try {
        let studentId = req.params.id;
        let stmt = "DELETE FROM studenti WHERE id = ?";
        const db = new sqlite3.Database('./classroom.db');
        db.run(stmt, [studentId], function (error) {
            if (error) {
                console.error('Greška prilikom brisanja iz baze podataka:', error.message);
                res.status(500).json({ error: 'Greška prilikom brisanja iz baze podataka.' });
            } else {
                res.status(200).json({ message: 'Student uspješno obrisan iz baze.' });
            }
            db.close();
        });
    } catch (error) {
        console.error('Greška prilikom obrade zahtjeva za brisanje studenta:', error.message);
        res.status(500).json({ error: 'Greška prilikom obrade zahtjeva za brisanje studenta.' });
    }
});

module.exports = router;
