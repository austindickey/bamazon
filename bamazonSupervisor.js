// No starter code for this file

// Initializes the npm packages used
var mysql = require("mysql")
var inquirer = require("inquirer")
require("console.table")

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
})

// Creates the connection with the server and loads the manager menu upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadSupervisorOptions()
})

function getDepartments() {
  var departmentNameArray = []

  connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err

    for (var i = 0; i < res.length; i++) {
      if (departmentNameArray.indexOf(res[i].department_name) > -1) {
        
      } else {
        departmentNameArray.push(res[i].department_name)
      }
    }

    calculateSales(departmentNameArray)
  })
}

function calculateSales(departmentNameArray) {
  for (let i = 0; i < departmentNameArray.length; i++) {
    connection.query("SELECT product_sales FROM products WHERE department_name = '" + departmentNameArray[i] + "'", function(err, res) {
      if (err) throw err
      for (let x = 0; x < res.length; x++) {
        connection.query("UPDATE departments SET product_sales = product_sales + " + res[x].product_sales + " WHERE department_name = '" + departmentNameArray[i] + "'", function(err, res) {
          if (err) throw err
        })
      }
    })
  }

  calculateProfit(departmentNameArray)
}

function calculateProfit(departmentNameArray) {
  for (let i = 0; i < departmentNameArray.length; i++) {
    connection.query("SELECT over_head_costs, product_sales FROM departments WHERE department_name = '" + departmentNameArray[i] + "'", function(err, res) {
      if (err) throw err
      
      for (let x = 0; x < res.length; x++) {
        var profit = res[x].product_sales - res[x].over_head_costs 
        connection.query("UPDATE departments SET total_profit = " + profit + " WHERE department_name = '" + departmentNameArray[i] + "'", function(err, res) {
          if (err) throw err
        })
      }

    })
  }

  loadDepartmentData()
}

function loadDepartmentData() {
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err
      console.log("\n")
      console.table(res)

      loadSupervisorOptions()
    })
}
  
function loadSupervisorOptions() {
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
          getDepartments()
          loadSupervisorOptions()

          break;
      
        case "Create New Department":
          newDepartment()
        
          break;

        case "Quit":
          console.log("\nGoodbye!\n")
          process.exit(0)

          break;
      }

    })
}

function newDepartment() {
  inquirer
      .prompt([
        {
          type: "input",
          name: "department_name",
          message: "What is the name of the department you would like to add?"
        },
        {
          type: "input",
          name: "over_head_costs",
          message: "What is the over head cost of this department?"
        }
      ])
      .then(function(val) {
        
        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (" + val.department_name + ", " + val.over_head_costs + ")", function(err, res){
          if (err) throw err

          // probably just a query call to push data to the table
        })
  
      })

}