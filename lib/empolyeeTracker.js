const inquirer = require('inquirer');
const { dbConnection } = require('../config/connection');
const cTable = require("console.table");
const chalk = require("chalk");

class EmpolyeeTracker {
    constructor() {

    };

    run() {
        //  WHEN I start the application
        // THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        return inquirer.prompt(
            {
                type: 'list',
                name: 'menuSelection',
                message: chalk.green.bold.underline('What would you like to do?'),
                choices: ['View all departments', 'View all roles', 'View all employees', chalk.yellow('Add a department'), chalk.yellow('Add a role'), chalk.yellow('Add an employee'), chalk.magenta('Update an employee role')]
            }).then((answer) => {
                switch (answer.menuSelection) {
                    case 'View all departments': 
                        this.viewDepartments();
                        break;
                    case 'View all roles':
                        this.viewRoles();
                        break;
                    case 'View all employees':
                        this.viewEmployees();
                        break;
                    case chalk.yellow('Add a department'):
                        this.addDepartment();
                        break;
                    case chalk.yellow('Add a role'):
                        this.addRole();
                        break;
                    case chalk.yellow('Add an employee'):
                        this.addEmployee();
                        break
                    case chalk.magenta('Update an employee role'):
                        this.updateEmployeeRole();
                        break
                };
            }

            )
    }

    viewDepartments() {
        dbConnection.promise().query('SELECT department_name AS "Department Name", id AS "Department ID" FROM department;')
        .then( ([rows, fields]) => {
            console.log("\n");
            console.log(chalk.green.bold.underline("VIEW ALL DEPARTMENTS"));
            console.log(cTable.getTable(rows));
        }).catch(console.log)
        .then( () => this.run());
    }

    viewRoles() {
        dbConnection.promise().query('SELECT role.title AS "Job Title", role.id AS "Role ID", department.department_name AS "Department Name", role.salary AS Salary FROM role LEFT JOIN department ON role.department_id = department.id;')
        .then( ([rows, fields]) => {
            console.log("\n");
            console.log(chalk.green.bold.underline("VIEW ALL ROLES"));
            console.log(cTable.getTable(rows));
        }).catch(console.table)
        .then( () => this.run());
    }

    viewEmployees() {
        dbConnection.promise().query('SELECT E.employee_id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", role.title AS "Job Title", department.department_name AS Department, role.salary AS Salary, CONCAT( M.first_name, " " , M.last_name) AS "Manager" FROM employee E LEFT JOIN role ON E.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee M ON E.manager_id = M.employee_id;')
        .then( ([rows, fields]) => {
            console.log("\n");
            console.log(chalk.green.bold.underline("VIEW ALL EMPLOYEES"));
            console.log(cTable.getTable(rows));
        }).catch(console.table)
        .then( () => this.run());
    }

    addDepartment() {
        console.log("\n");
        console.log(chalk.green.bold.underline("ADD A DEPARTMENT"));
        return inquirer.prompt(
            {
                type: 'input',
                name: 'addDepartment',
                message: 'Please enter the name of the department to add, or type exit to return',
                validate: (text) => {
                    if(!text.length) {
                        return 'Please enter the name of the department to add, or type exit to return';
                    }
                    return true;
                }
            }).then((answer) => {
                if((answer.addDepartment).toLowerCase() === "exit"){
                    console.log(chalk.red.bold("\nBack to the main menu\n"));
                    return this.run();
                }
                dbConnection.promise().query(`INSERT INTO department (department_name) VALUES ("${answer.addDepartment}");`)
                .catch((err) => {
                    console.log(err);
                    console.log(chalk.red.bold("Something went wrong"));
                    dbConnection.end();
                })
                console.log(chalk.yellow("Added department: " + chalk.yellow.bold.underline(`${answer.addDepartment}`) + " to database."));
            }).then(() => {
                return this.run();
            });
    }

    addRole() {

    }

    addEmployee() {

    }

    updateEmployeeRole() {

    }
}

module.exports = EmpolyeeTracker;