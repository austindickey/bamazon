DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Dead Redemption 2", "Video Games", 59.99, 150),
  ("2K20", "Video Games", 59.99, 140),
  ("24 Pack of Dr. Pepper", "Food and Drink", 7.50, 50),
  ("Oakley Sunglasses", "Apparel", 125.00, 9),
  ("Lucky Jeans", "Apparel", 78.25, 35),
  ("Survival Kit", "Necessities", 38.42, 42),
  ("Ted 2", "Films", 12.00, 25),
  ("Step Brothers", "Films", 9.50, 57),
  ("Monopoly", "Board Games", 30.50, 35),
  ("Risk", "Board Games", 19.95, 23);

 CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  total_profit DECIMAL(10,2) DEFAULT 0,
  primary key(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Video Games", 200),
  ("Food and Drink", 100),
  ("Apparel", 50),
  ("Necessities", 300),
  ("Films", 35),
  ("Board Games", 10);