const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();

// serving static files
app.use(express.static("./public_files"));

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

const db = new sqlite3.Database("./classroom.db");
app.use((req, res, next) => {
  req.DB = db;
  next();
});

app.use(async (req, res, next) => {
  const sessionId = req.cookies["mySession"];
  if (!sessionId) {
    return next();
  }

  const sessionRow = await new Promise((resolve, reject) => {
    req.DB.get(
      "SELECT * FROM sessions WHERE session_id = ?",
      [sessionId],
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

  try {
    req.session = JSON.parse(sessionRow.data);
  } catch {}

  next();
});

const predmeti = require("./api/predmeti");
const studenti = require("./api/studenti");
const profesori = require("./api/profesori");
app.use("/api/predmeti", predmeti);
app.use("/api/studenti", studenti);
app.use("/api/profesori", profesori);

const renderView = (filename, data = {}) => {
  const viewPath = path.join("./views/", filename);
  let file = fs.readFileSync(viewPath, {
    encoding: "utf-8",
  });

  for (const [key, value] of Object.entries(data)) {
    file = file.replaceAll(
      "____" + key.toUpperCase() + "____",
      JSON.stringify(value)
    );
  }

  return file;
};

app.use(
  "/profesor",
  (req, res, next) => {
    if (!req.session || req.session.role !== "profesor") {
      return res.redirect("/");
    }

    next();
  },
  express.Router().get("/dashboard", (req, res) => {
    const viewHtml = renderView("profesor/dashboard.html", {
      session_data: req.session,
    });

    return res.type("html").send(viewHtml);
  })
);
app.use(
  "/student",
  (req, res, next) => {
    if (!req.session || req.session.role !== "student") {
      return res.redirect("/");
    }

    next();
  },
  express.Router().get("/dashboard", (req, res) => {
    const viewHtml = renderView("student/dashboard.html", {
      session_data: req.session,
    });

    return res.type("html").send(viewHtml);
  })
);

// starting web server service (and listening for requests on given port)
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
