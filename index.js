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
