const express = require("express")
const router = express.Router()
const sqlite3 = require('sqlite3').verbose();

router.use(express.json())

router.get("/", (request,response)=>{
    let profesori=[]
    const db = new sqlite3.Database('./classroom.db');
    db.all('SELECT * FROM profesori', (error, rows) => {
        if (error) {
            ;
        }else{
            profesori = rows
        }
        response.send(profesori);
        db.close()
    })
})

router.post("/login", (request, response) => {
    const { email, password } = request.body;
    
    const db = new sqlite3.Database('./classroom.db');
    db.get('SELECT * FROM profesori WHERE email = ? AND lozinka = ?', [email, password], (error, row) => {
        if (error) {
            response.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (row) {
                response.json({ success: true, user: row });
            } else {
                response.status(401).json({ success: false, message: 'Pogrešni korisnički podaci' });
            }
        }
        db.close();
    });
});

module.exports = router;