-- Drops the day_planner_db if it already exists --
DROP DATABASE IF EXISTS employees_db;

-- Create the database day_planner_db and specified it for use.
CREATE DATABASE employees_db;

USE employees_db;

-- Create the table plans.
CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id int NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,


  PRIMARY KEY (id)
);

CREATE TABLE allEmployeeDirectory SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id;

-- Insert a set of records.
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jocelyn", "Chang", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andrew", "Lee", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sean", "Lin", 2, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sabrina", "Lin", 3, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rebecca", "Lee", 4, NULL);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Research & Development");

INSERT INTO roles (title,salary,department_id)
VALUES ("Sales rep",100000,1);

INSERT INTO roles (title,salary,department_id)
VALUES ("District Manager",500000,1);

INSERT INTO roles (title,salary,department_id)
VALUES ("Operation Specialist",80000,2);

INSERT INTO roles (title,salary,department_id)
VALUES ("Operation Manager",110000,2);