// I also removed some functions in this file from the starter version,
// specifically for adding a new product.

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

// Creates the connection with the server and loads the manager menu upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadManagerMenu();
});

// Get product data from the database
function loadManagerMenu() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Load the possible manager menu options, pass in the products data
    loadManagerOptions(res);
  });
}

// Load the manager options and pass in the products data from the database
function loadManagerOptions(products) {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
      message: "\nWhat would you like to do?\n"
    })
    .then(function(val) {
      //Your Code Here:

      switch (val.choice) {
        case "View Products for Sale":
          console.log("\n")
          console.table(products)
          loadManagerOptions(products)

          break;
      
        case "View Low Inventory":
          loadLowInventory()
        
          break;

        case "Add to Inventory":
          addToInventory(products)

          break;

        case "Add New Product":
          getDepartments()

          break;

        case "Quit":
          console.log("\nGoodbye!\n")
          process.exit(0)

          break;
      }

    });
}

// Query the DB for low inventory products
function loadLowInventory() {
  // Selects all of the products that have a quantity of 5 or less
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
    // Draw the table in the terminal using the response, load the manager menu
    console.log("\n")
    console.table(res);
    loadManagerMenu();
  });
}

// Prompt the manager for a product to replenish
function addToInventory(inventory) {
  console.log("\n")
  console.table(inventory);
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like add to?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(function(val) {
      //Your Code Here:
      updateQuantity(val.choice)
    });
}

// Ask for the quantity that should be added to the chosen product
function updateQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
    
      //Your Code Here:
      connection.query("UPDATE products SET stock_quantity = stock_quantity + " + val.quantity + " WHERE item_id = " + product, function(err, res) {
        if (err) throw err;

        console.log("\n You've added " + val.quantity + " units to your product with the id of " + product + "\n")
        loadManagerMenu();
      });

    });
}

// Prompts manager for new product info, then adds new product
function getProductInfo(departments) {
  return inquirer.prompt([
    {
      type: "input",
      name: "product_name",
      message: "What is the name of the product you would like to add?"
    },
    {
      type: "list",
      name: "department_name",
      choices: departments,
      message: "Which department does this product fall into?"
    },
    {
      type: "input",
      name: "price",
      message: "How much does it cost?",
      validate: function(val) {
        return val > 0;
      }
    },
    {
      type: "input",
      name: "quantity",
      message: "How many do we have?",
      validate: function(val) {
        return !isNaN(val);
      }
    }
  ]).then(function(val){
    var productName = val.product_name
    var department = val.department_name
    var price = val.price
    var quantity = val.quantity
    insertNewProduct(productName, department, price, quantity)
  }).catch(function(err){
    if(err) throw err
  })
}

// Adds new product to the db
function insertNewProduct(productName, department, price, quantity) {
  connection.query(

    //Your Code Here:
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + productName + "', '" + department + "', " + price + ", " + quantity + ")",
    function(err, res) {
      if (err) throw err;
      console.log("\n=============================")
      console.log(productName + " ADDED TO BAMAZON!")
      console.log("=============================\n")
      // When done, re run loadManagerMenu, effectively restarting our app
      loadManagerMenu();
    }
  );
}

// Gets all of the departments and runs a callback function when done
function getDepartments() {
  //Your Code Here:
  var departmentNameArray = []

  connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err

    for (var i = 0; i < res.length; i++) {
      if (departmentNameArray.indexOf(res[i].department_name) > -1) {
        
      } else {
        departmentNameArray.push(res[i].department_name)
      }
    }

    getProductInfo(departmentNameArray)
  })

}