const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee'
})

connection.connect(err => {
    if (err) throw err;

    console.log('Employee Tracker Iniatated');

    menu();
})

// FUNCTIONS
function menu() {
    inquirer.prompt([{
        name: 'menu',
        type: 'list',
        message: "Please select a command: ",
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    }])
        .then(response => {
            switch (response.menu) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                    break;
                case 'Quit':
                    connection.end();
                    break;
            }
        })
};

//view all departments
viewAllDepartments = () => {
    console.log("Viewing all departments");
    db.query(
        'SELECT * FROM department',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    )
};

//view all roles
viewAllRoles = () => {
    console.log("Viewing all roles");
    db.query(
        'SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles INNER JOIN department ON roles.department_id = department.departmentId',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    )
};

//view all employees
viewAllEmployees = () => {
    console.log("Viewing all employees");
    db.query(
        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, ' ',m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = departmentId LEFT JOIN employees m ON employees.manager_id = m.id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            promptUser();
        }
    )
};

//add a department
addADepartment = (ans) => {
    db.query(
        'INSERT INTO department SET ?',
        ans,
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' department added!\n');
            promptUser();
        }
    )
};

//add a role
addARole = (ans) => { 
    let salary = parseInt(ans.salary);
    departmentList = [];
    db.query(
        'SELECT * FROM department',
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                departmentList.push(res[i].name);
            }
            departmentId = departmentList.indexOf(ans.department_name) + 1;
            db.query(
                'INSERT INTO roles SET ?',
                {
                    title: ans.title,
                    salary: salary,
                    department_id: departmentId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' role added!\n');
                    promptUser();
                }
            )
        }
    )
};

//add an employee
addAnEmployee = (ans) => { 
    let roleName = ans.role_name;
    let managerNameArr = ans.manager_name.split(' ');
    let managerName = managerNameArr[1];
    managerList = [];
    managerIdList = [];
    roleList = [];
    roleIdList = [];
    db.query(
        'SELECT employees.last_name, employees.id, roles.title, roles.id AS roles_id FROM employees JOIN roles',
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                managerList.push(res[i].last_name);
                managerIdList.push(res[i].id);
                roleList.push(res[i].title);
                roleIdList.push(res[i].roles_id);
            }
            let managerIdLoc = managerList.indexOf(managerName);
            let managerId = managerIdList[managerIdLoc];
            let roleIdLoc = roleList.indexOf(roleName);
            let roleId = roleIdList[roleIdLoc]; 
            console.log(roleId);
            db.query(
                'INSERT INTO employees SET ?',
                {
                    first_name: ans.first_name,
                    last_name: ans.last_name,
                    role_id: roleId,
                    manager_id: managerId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' employee added!\n');
                    promptUser();
                }
            )
        }
    )
};

//update an employee
updateAnEmployeeRole = (ans) => { 
    let lastName = (ans.last_name);
    rolesList = [];
    db.query('SELECT * FROM roles',
        function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                rolesList.push(res[i].title);
            }
            newRole = rolesList.indexOf(ans.role_id) + 1;
            db.query(
                'UPDATE employees SET ? WHERE ?',
                [
                    {role_id: newRole},
                    {last_name: lastName}
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee's role updated!\n");
                    promptUser();
                }
            )
        }
    )
};


// 'PREVIEW' FUNCTIONS
function viewDepartments() {
    connection.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;

        console.table(result);

        menu();
    })
};

function viewRoles() {
    connection.query('SELECT * FROM role', (error, result) => {
        if (error) throw error;

        console.table(result);

        menu();
    })
};

function viewEmployees() {
    connection.query('SELECT * FROM employee', (error, result) => {
        if (error) throw error;

        console.table(result);

        menu();
    })
};

// 'ADD' FUNCTIONS
function addDepartment() {
    inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Input the department name: '
    }])
        .then(response => {
            connection.query('INSERT INTO department (name) VALUES (?)', [response.name], (error, result) => {
                if (error) throw error;
            })

            viewDepartments();
        })
};

function addRole() {
    inquirer.prompt([{
        name: 'name',
        type: 'input',
        message: 'Input the role title: '
    },

    {
        name: 'salary',
        type: 'number',
        message: 'Input salary: ',
        validate: salary => {
            if (salary) {
                return true;
            } else {
                console.log('Please enter a numerical value');
                return false;
            }
        }
    },

    ])
        .then(res => {
            connection.query('INSERT INTO role SET ?', {
                title: res.role,
                salary: res.salary,
                department_id: res.department
            },

                (err, res) => {
                    if (err) throw err;
                    console.log('Role has been added')

                    menu();
                })
        })
};

function addEmployee() {
    inquirer.prompt([{
        name: 'firstName',
        type: 'input',
        message: 'Input first name of employee: '
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'Input last name of employee: '
    },

    {
        name: 'role',
        type: 'number',
        message: 'Enter role ID:'
    },
  
    ])
        .then(response => {

            connection.query('INSERT INTO employee SET ?', {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: response.role,
                manager_id: response.manager
            },

                (err, res) => {
                    if (err) throw err;
                    console.log('Employee created.')

                    menu();
                })
        })
    };

    function updateEmployee() {
        inquirer.prompt([{
                    name: 'employee',
                    type: 'number',
                    message: 'Enter employee ID'
                },
                {
                    name: 'role',
                    type: 'number',
                    message: 'Enter role ID:'
                }
            ])
            .then(response => {
                connection.query('UPDATE employee SET role_id = ? WHERE id = ? ', [response.role, response.employee], (error, result) => {
                    if (error) throw error;
    
                    viewEmployees();
                })
            })


quit = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'return',
            message: 'Go Back To Main Menu?',
            default: false
        }
    ])
         .then(ans => {
            if (ans.return) {
                promptUser();
            } else {
                console.log("Goodbye");
                db.end();
            }
        });  
};         

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addADepartment,
    addARole,
    addAnEmployee,
    updateAnEmployeeRole,
    quit
}}
