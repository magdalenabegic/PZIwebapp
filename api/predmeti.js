const express = require("express")
const router = express.Router()
const sqlite3 = require('sqlite3').verbose();

router.use(express.json())

router.get("/", (request,response)=>{
    let predmeti=[]
    const db = new sqlite3.Database('./classroom.db');
    db.all('SELECT * FROM predmeti', (error, rows) => {
        if (error) {
            ;
        }else{
            predmeti = rows
        }
        response.send(predmeti);
        db.close()
    })
})

module.exports = router
