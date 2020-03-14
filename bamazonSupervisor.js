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
  loadSupervisorMenu();
});

// Get product data from the database
function loadSupervisorMenu() {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
  
      // Load the possible manager menu options, pass in the products data
      loadSupervisorOptions(res);
    });
  }
  
  // Load the manager options and pass in the products data from the database
  function loadSupervisorOptions(departments) {
    inquirer
      .prompt({
        type: "list",
        name: "choice",
        choices: ["View Product Sales by Department", "Create New Department", "Quit"],
        message: "\nWhat would you like to do?\n"
      })
      .then(function(val) {
        
        switch (val.choice) {
          case "View Product Sales by Department":
            console.log("\n")
            console.table(departments)
            loadSupervisorOptions(products)
  
            break;
        
          case "Create New Department":
            newDepartment()
          
            break;
  
          case "Quit":
            console.log("\nGoodbye!\n")
            process.exit(0)
  
            break;
        }
  
      });
  }

function newDepartment() {
  // still need to code
  
}