var mysql = require("mysql");
require("dotenv").config();

var query = process.argv[2];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.WEBSITE_USER,

  // Your password
  password: process.env.WEBSITE_PASSWORD,
  database: "bamazon"
})