const express = require("express");
require("dotenv").config("./env");
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "sql8.freesqldatabase.com",
  user: process.env.DB_USERNAME || "sql8628575",
  password: process.env.DB_PASSWORD || "7PUPSfN5p9",
  database: process.env.DATABASE || "sql8628575",
  port: process.env.DB_PORT || 3306,
});

const app = express();
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.get("/regions", async function (request, response) {
  // Connecting to the database.
  let sql = `SELECT
	  region.id AS region_id, 
	  region.name AS region, 
	  region.koef_trend_a0 AS koef_trend_a0,
    region.koef_trend_a1 AS koef_trend_a1,
    climate_zone.id AS climate_id,
    climate_zone.name_climate AS zone
FROM region 
INNER JOIN climate_zone 
ON region.climate_zone_id=climate_zone.id`;
  pool.query(sql, function (error, result, fields) {
    // If some error occurs, we throw an error.
    if (error) throw error;
    // Getting the 'res' from the database and sending it to our route. This is were the data is.
    region = JSON.stringify(result);
    response.send(region);
    // console.log(typeof region);
  });
});

app.get("/regions/:name", async function (request, response) {
  // Connecting to the database.
  const name = request.params.name;
  // console.log(name);
  let sql = `SELECT
	  region.id AS region_id, 
	  region.name AS region, 
	  region.koef_trend_a0 AS koef_trend_a0,
    region.koef_trend_a1 AS koef_trend_a1,
    climate_zone.id AS climate_id,
    climate_zone.name_climate AS zone
FROM region 
INNER JOIN climate_zone 
ON region.climate_zone_id=climate_zone.id 
WHERE name=?`;
  pool.query(sql, [name], function (error, result, fields) {
    // If some error occurs, we throw an error.
    if (error) throw error;
    // Getting the 'res' from the database and sending it to our route. This is were the data is.
    region = JSON.stringify(result);
    response.send(region);
  });
});

app.post("/addAgricropsyeild", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const region_id = req.body.region_id;
  const year = req.body.year;
  const productivity_y = req.body.productivity_y;
  const trend_value_y0 = req.body.trend_value_y0;
  const trend_delta_dy = req.body.trend_delta_dy;
  const R10 = req.body.R10;
  const t3_decade3_april = req.body.t3_decade3_april;
  const t4_decade1_may = req.body.t4_decade1_may;
  const t5_decade2_may = req.body.t5_decade2_may;
  const t6_decade3_may = req.body.t6_decade3_may;
  const t7_decade1_june = req.body.t7_decade1_june;
  data = [
    region_id,
    year,
    productivity_y,
    trend_value_y0,
    trend_delta_dy,
    R10,
    t3_decade3_april,
    t4_decade1_may,
    t5_decade2_may,
    t6_decade3_may,
    t7_decade1_june,
  ];
  let q =
    "INSERT INTO `agricropsyeild`( `region_id`, `year`, `productivity_y`, `trend_value_y0`, `trend_delta_dy`, `R10`, `t3_decade3_april`, `t4_decade1_may`, `t5_decade2_may`, `t6_decade3_may`, `t7_decade1_june`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
  pool.query(
    "INSERT INTO users (name, age) VALUES (?,?)",
    data,
    function (err, data) {
      if (err) return console.log(err);
      res.redirect("/");
    }
  );
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Working...`);
});
