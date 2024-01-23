const express = require("express")
const app=express()
const port=8080;

// serving static files
app.use(express.static('./public_files'))

const predmeti = require('./api/predmeti.js')
const studenti = require('./api/studenti.js')
const profesori = require('./api/profesori.js')
app.use("/api/predmeti", predmeti);
app.use('/api/studenti', studenti);
app.use('/api/profesori', profesori);

// starting web server service (and listening for requests on given port)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


