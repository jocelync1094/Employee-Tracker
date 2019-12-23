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
            removeEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "Exit":
            connection.end();
            break;
        }
    })
}

// function createManagerColumn (){
//     connection.query("SELECT manager_id from employee",function(err, res){
//         if(err) throw err;
//         var managerID = res.map(el => el.manager_id);
//         console.log(managerID);
//     connection.query("ALTER employee ADD manager VARCHAR (30)",function(err,res){
//         connection.query("INSERT INTO employee (manager) SELECT first_name,last_name FROM employee WHERE ?",[{id:}])
//     })
// })
// }

function viewAllEmployees () {
    var allQuery = "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id"
    connection.query(allQuery,function(err,res){
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

function getRoles() {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT roles.title FROM roles", function (err, res) {
        if (err) throw err;
        const allRoles = res.map(role => role.title)

        resolve(allRoles);
      });
    });
}


function getManagers() {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT first_name, last_name FROM employee WHERE id=manager_id", function (err, res) {
        if (err) console.log(err);
        resolve(res);
      });
    });
};

async function addEmployee(){
    try{
    var totalRoles = await getRoles();
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
            choices: totalRoles
        },
        {
            type:"list",
            message: "Who is the manager?",
            name:"manager",
            choices: ["Sean","Rebecca","None"]
        }
    ]).then(function(response){
        var roleName = response.role;
        var managerID;
        switch (response.manager){
            case "Sean":
            managerID=3;
            break;
            case "Rebecca":
            managerID=5;
            break;
            default:
            managerID="null";
            break;
        }
    
    connection.query("SELECT roles.id, roles.title FROM roles WHERE roles.title=?",[roleName],function(err,res){
        if (err) throw (err);
        roleName = res[0].id         
    
    connection.query("INSERT INTO employee SET ?",  
    {
        first_name : response.firstName,
        last_name : response.lastName,
        role_id: roleName,
        manager_id: managerID
    }, 
    function(error,response){ 
        if(error)
          throw(error)
    
        console.log("New Employee Added\n");
        start();
      })
    })      
    })
} catch (err){
    console.log(err)
}
}

function removeEmployee () {
    connection.query("SELECT first_name, last_name FROM employee",function(err,res){
        if (err) throw err;
        const employeeWholeName = res.map(employee => employee.first_name + " " + employee.last_name);
        inquirer.prompt([
            {
                type:"list",
                message:"Which employee would you like to remove?",
                name: "deletedEmployee",
                choices: employeeWholeName
            }
        ]).then(function(result){
            var deleteChoice = result.deletedEmployee.split(' ');
            connection.query("DELETE FROM employee WHERE ? AND ?",[{
                first_name: deleteChoice[0]},{
                last_name: deleteChoice[1]
            }],function(err,res){
                if (err) console.log(err);
                console.log("Employee Removed.");
                start();
            })
        })
    })
}

async function updateEmployeeRole () {
    try{
    var totalRoles = await getRoles();
    connection.query("SELECT first_name, last_name FROM employee",function(err,res){
        if (err) throw err;
        const employeeWholeName = res.map(employee => employee.first_name + " " + employee.last_name);
        inquirer.prompt([
            {
                type:"list",
                message:"Which employee would you like to update?",
                name: "employee",
                choices: employeeWholeName
            },
            {
                type:"list",
                message: "What is this employee's new role?",
                name: "newRole",
                choices: totalRoles
            }
        ]).then(function(response){
            var chosenEmployee = response.employee.split(' ');
            console.log(chosenEmployee);
            connection.query("UPDATE employee INNER JOIN roles ON employee.role_id = roles.id SET roles.title = ? WHERE ? AND ?",[response.newRole,{first_name: chosenEmployee[0]},{last_name: chosenEmployee[1]}],function(err,res){
                if(err) throw err;
                console.log("Employee Updated.")
                start();
            })
        })
    })
} catch(err){
    console.log(err);
}
}


