const express = require("express");
const app = express();
var mysql = require("mysql");
const bodyaParser = require("body-parser");
app.use(bodyaParser.json());
app.use(bodyaParser.urlencoded({ extended: false }));
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodetest",
});
app.get("/api/v1/longest-duration-movies", async (req, res, next) => {
  connection.query(
    "SELECT * FROM movie ORDER BY runtimeMinutes DESC LIMIT 10",
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
});

app.get("/api/v1/top-rated-movies", async (req, res, next) => {
  connection.query(
    "SELECT movie.tconst,movie.primaryTitle,movie.genres,rating.averageRating FROM movie INNER JOIN rating ON movie.tconst=rating.tconst WHERE averageRating>6.0 ORDER BY averageRating ",
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
});

app.post("/api/v1/update-runtime-minutes", async (req, res, next) => {
  const sql =
    "UPDATE movie SET runtimeMinutes = CASE  WHEN genres = 'Documentary' THEN runtimeMinutes + 15 WHEN genres = 'Animation' THEN runtimeMinutes + 30 ELSE runtimeMinutes + 45 END;";

  connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    return res.status(200).json({
      success: true,
      data: result,
    });
  });
});

app.post("/api/v1/new-movie", async (req, res, next) => {
  console.log(req.body);
  const sql = `INSERT INTO movie (tconst, titleType, primaryTitle, runtimeMinutes, genres) VALUES (?,?,?,?,?)`;
  connection.query(
    sql,
    [
      req.body.tconst,
      req.body.titleType,
      req.body.primaryTitle,
      req.body.runtimeMinutes,
      req.body.genres,
    ],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
});

app.get("/api/v1/genre-movies-with-subtotals", async (req, res, next) => {
  const sql =
    "select genres, primaryTitle ,numVotes, SUM(numVotes) AS total from movie JOIN rating ON movie.tconst=rating.tconst GROUP BY genres ";
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    return res.status(200).json({
      success: true,
      data: result,
    });
  });
});

app.listen(3003, () => {
  console.log("listing...");
});
