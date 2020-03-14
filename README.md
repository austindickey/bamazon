# bamazon
This is a node inventory app that runs in the console.

---

### **NPM Dependencies**

* Console.table
* Inquirer
* MySQL

---

### **Initial Setup**
Navigate to the folder in your terminal, and install all the necessary dependencies with:

```
npm i
```

Next, run the file named `schema.sql` in your MySQL Workbench Program.

Finally, change the username and password for all 3 bamazon js files to your information.

---

### **How To Utilize Bamazon**

**Customer**

Run the following code in your terminal:

```
node bamazonCustomer
```

Then follow the prompts.

_Capabilities:_

* Purchase a Product

---

**Manager**

Run the following code in your terminal:

```
node bamazonManager
```

Then follow the prompts.

_Capabilities:_

* View Products for Sale
* View Low Inventory
* Add to Inventory
* Add New Product

---

**Supervisor**

Run the following code in your terminal:

```
node bamazonSupervisor
```

Then follow the prompts.

_Capabilities:_

* View Product Sales by Department
* Create New Department