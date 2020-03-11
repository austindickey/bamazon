// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "austin",

  // Your password
  password: "root",
  database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
function loadProducts() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response
    console.log("\n")
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    promptCustomerForItem();
  });
}

// Prompt the customer for a product ID
function promptCustomerForItem() {
    // Prompts user for what they would like to purchase
    inquirer
        .prompt([
            {
              type: "input",
              name: "invSelect",
              message: "What is the ID number of the product would you like to purchase?"
            },
            {
              type: "input",
              name: "quanSelect",
              message: "How many items of this product would you like to purchase?"
            }
        ])
        .then(function(productAnswers){
          var productId = productAnswers.invSelect
          var productQuantity = productAnswers.quanSelect

          connection.query("SELECT * FROM products WHERE item_id = " + productId, function(err, res) {
              if (err) throw err
              
              if (res[0].stock_quantity < productQuantity){
                console.log("\nSorry, but we only have " + res[0].stock_quantity + " units of this product on hand.\n\nPlease try again.\n")
                promptCustomerForItem()
              } else {
                var cost = productQuantity * res[0].price
                makePurchase(productId, productQuantity, cost)
              }
          })
        })
        .catch(function(err){
            if (err) throw err
        })
}

// Purchase the desired quantity of the desired item
function makePurchase(productId, productQuantity, cost) {
  connection.query("UPDATE products SET stock_quantity = stock_quantity" + -productQuantity + " WHERE item_id = " + productId, function(err, res) {
    if (err) throw err
  })

  console.log("\n=============================")
  console.log("Your order total is: $" + cost)
  console.log("=============================\n")
  
  inquirer
        .prompt([
            {
              type: "input",
              name: "exit",
              message: "Would you like to exit the program? (type: q)\nOtherwise press Enter to make another purchase."
            }
        ])
        .then(function(exitAnswer){
            checkIfShouldExit(exitAnswer.exit)
        })
        .catch(function(err){
            if (err) throw err
        })

}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("\nGoodbye!\n");
    process.exit(0);
  } else {
    loadProducts()
  }
}