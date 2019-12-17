var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "The0115!",
  database: "employees_db"
});

connection.connect(function(err) {
  if (err) throw err;

  start();

});

const menu = [
    {
        type:"list",
        message:"What would you like to do?",
        name: "userAction",
        choices:[
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Exit"
        ]
    }
]


function start() {
    inquirer.prompt(menu)
    .then(function(response){
            
        switch (response.userAction) {
        case "View All Employees":
            viewAllEmployees();
            break;
        case "View All Employees by Department":
            viewEmployeeByDepart();
            break;
        case"Add Employee":
            addEmployee();
            break;
        case "Remove Employee":
            break;
        case "Update Employee Role":
            break;
        case "Exit":
            connection.end();
            break;
        }
    })
}

function viewAllEmployees () {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id",function(err,res){
        if(err) throw err;
        console.table(res);
        start()
    });
}

function viewEmployeeByDepart (){
    inquirer.prompt([
        {
            type:"input",
            message: "Which Department Employees would you like to view?",
            name: "departmentView"
        }
    ]).then(function(response){
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id WHERE department.name=?",[response.departmentView],function(err,res){
            if(err) throw err;

            console.table(res);
            start();
    })   
    });
}

function addEmployee(){

    inquirer.prompt([
        {
            type: "input",
            message: "What is the new employee's first name?",
            name: "firstName"
        },
        {
            type:"input",
            message: "What is the new employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is his/her role?",
            name:"role",
            choices: ["Sales rep","District Manager","Researcher","Research Manager"]
        },
        {
            type:"list",
            message: "Who is the manager?",
            name:"manager",
            choices: ["Sean","Rebecca"]
        }
    ]).then(function(response){

    
    connection.query("INSERT INTO employee SET ?",  
    {
        first_name : response.firstName,
        last_name : response.lastName,
        role_id: response.role
    }, 
    function(err,res){ 
        if(err)
          throw(err)
    
        console.log("New Employee Added\n");
        start();
      })
    
    })
}