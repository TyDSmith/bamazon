var mysql = require("mysql");
require("dotenv").config();

const chalk = require('chalk');
const log = console.log;

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


connection.connect(function(err) {
    if (err) throw err;
    log("connected as id " + connection.threadId + "\n");
      displayAllProducts();
  });
  
    // logs the actual query being run
    //console.log(query.sql);

    function displayAllProducts() {
        log("Selecting all products...\n");
        connection.query("SELECT * FROM products", function(err, res) {
              if (err) throw err;
              // Log all results of the SELECT statement
            
              for (i=0; i<res.length;i++){
                  log(chalk.red(res[i].product_name));
                  log(chalk.blue(res[i].department_name));
                  log(chalk.green(res[i].price));
                  log(chalk.yellow(res[i].stock_quantity));
                  log("---------------");
              }
          
              connection.end();
            });

  
//   function readProducts() {
//     console.log("Selecting all products...\n");
//     connection.query("SELECT * FROM products where product_name = " + "'" + query + "'", function(err, res) {
//       if (err) throw err;
//       // Log all results of the SELECT statement
//       console.log(res);
  
//       connection.end();
//     });
  }