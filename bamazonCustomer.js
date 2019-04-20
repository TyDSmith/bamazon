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
              log(chalk.white("Item ID: ",res[i].item_id));
              log(chalk.red("Product Name: ", res[i].product_name));
              log(chalk.blue("Department: ", res[i].department_name));
              log(chalk.green("Price: ",res[i].price));
              log(chalk.yellow("# in Stock: ",res[i].stock_quantity));
              // log(chalk.keyword('orange')("Sales: ",res[i].product_sales));
              log("---------------");
          }
          displayPrompts();
          // connection.end();
        });

    function displayPrompts(){
      let inquirer = require("inquirer");

      inquirer.prompt([
        {
        type: "input",
        name: "id",
        message: "Please enter an item ID"
        },
        {
        type: "input",
        name: "quantity",
        message: "Please enter the quantity you would like to purchase"
        }
      ]).then(answers =>{
        id = answers.id;
        quantity = answers.quantity;
        checkQuantity(id, quantity);
      });

    }

}

function checkQuantity(id, quantity){
  
  connection.query(
    "SELECT * FROM bamazon.products WHERE item_id = '" + id + "';",
    function (err, res) {
      if (err) throw err;
      // if (quantity < 0) {
      //   quantity = quantity * -1;
      // }
      res[0].price = parseFloat(res[0].price);
      quantity = parseFloat(quantity);
      res[0].stock_quantity = parseInt(res[0].stock_quantity);
      res[0].product_sales = parseFloat(res[0].product_sales);
      if (parseInt(quantity) < parseInt(res[0].stock_quantity)) {
        updateQuantity = res[0].stock_quantity - quantity;
        productSales = Number(res[0].product_sales + (quantity * res[0].price));
       
        updateProduct(id, updateQuantity, productSales);
        console.log("You have sucessfully purchased " + quantity + " " + res[0].product_name + " @ " + res[0].price + "/unit.")
        console.log("Total: $", quantity * res[0].price);
      } else {
        console.log("Insufficient quantity!");
        connection.end();
      }
    }
  )};

function updateProduct(id, quantity, productSales) {
    connection.query(
        "UPDATE products SET ?, ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },{
                product_sales: productSales
            },{
                item_id: id
            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            connection.end();
        }
    );
 };