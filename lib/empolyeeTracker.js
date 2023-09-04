const inquirer = require('inquirer');
const { dbConnection } = require('../config/connection');
const cTable = require("console.table");
const chalk = require("chalk");
const { departmentChoices, managerChoices, roleChoices } = require('./Queries');



class EmpolyeeTracker {
    constructor() {

    };

    run() {
        //  WHEN I start the application
        // THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        //this prompt is the main menu for the program.
        return inquirer.prompt(
            {
                type: 'list',
                name: 'menuSelection',
                message: chalk.green.bold.underline('What would you like to do?'),
                choices: ['View all departments', 'View all roles', 'View all employees', chalk.yellow('Add a department'), chalk.yellow('Add a role'), chalk.yellow('Add an employee'), chalk.magenta('Update an employee role'), chalk.magenta('Update an employee manager'), chalk.bgRed('EXIT')]
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
                    case chalk.magenta('Update an employee manager'):
                        this.updateEmployeeManager();
                        break

                    case chalk.bgRed('EXIT'):
                        console.log(chalk.red.bold("Goodbye :)"));
                        dbConnection.end();
                        break
                };
            }

            )
    }

    //this command allows you to see all departments, and their IDs
    viewDepartments() {
        dbConnection.query('SELECT department_name AS "Department Name", id AS "Department ID" FROM department;')
        .then( ([rows, fields]) => {
            console.log("\n");
            console.log("            " + chalk.green.bold.underline("VIEW ALL DEPARTMENTS"));
            console.log(cTable.getTable(rows));
        }).catch(console.log)
        .then( () => this.run());
    }

    viewRoles() {
        dbConnection.query('SELECT role.title AS "Job Title", role.id AS "Role ID", department.department_name AS "Department Name", role.salary AS Salary FROM role LEFT JOIN department ON role.department_id = department.id;')
        .then( ([rows, fields]) => {
            console.log("\n");
            console.log("                   " + chalk.green.bold.underline("VIEW ALL ROLES"));
            console.log(cTable.getTable(rows));
        }).catch(console.table)
        .then( () => this.run());
    }

    //this function prints out all employees and shows a formatted table with employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    viewEmployees() {
        dbConnection.query('SELECT E.employee_id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", role.title AS "Job Title", department.department_name AS Department, role.salary AS Salary, CONCAT( M.first_name, " " , M.last_name) AS "Manager" FROM employee E LEFT JOIN role ON E.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee M ON E.manager_id = M.employee_id;')
        .then( ([rows, fields]) => {
            console.log("\n");
            console.log("                          " + chalk.green.bold.underline("VIEW ALL EMPLOYEES"));
            console.log(cTable.getTable(rows));
        }).catch(console.table)
        .then( () => this.run());
    }

    //this function allows users to type in a new department, which is added to 
    addDepartment() {
        console.log("\n");
        console.log("                                    " + chalk.yellow.bold.underline("ADD A DEPARTMENT"));
        return inquirer.prompt(
            {
                type: 'input',
                name: 'addDepartment',
                message: 'Please enter the name of the department to add, or type exit to return',
                //basic validation to check if only letters are entered.
                validate: (text) => {
                    if(!/^[a-zA-Z ]*$/.test(text)){
                        return chalk.red.bold('The name of the department must be only letters and spaces.');
                    }
                    //validation to check if empty string is given
                    if(!text.length) {
                        return chalk.red.bold('Please enter the name of the department to add, or type exit to return');
                    }
                    //validation to check the string is under the limit set by the SQL schema
                    if(text.length > 30){
                        return chalk.red.bold('The name of the department cannot not be over 30 characters');
                    }
                    return true;
                }
            }).then((answer) => {
                //if they chose exit, exit the function and go back to the main menu.
                if((answer.addDepartment).toLowerCase() === "exit"){
                    console.log(chalk.red.bold("\nBack to the main menu\n"));
                    return this.run();
                }
                //inserts the new department name into the department table in the database
                dbConnection.query(`INSERT INTO department (department_name) VALUES ("${answer.addDepartment}");`)
                .catch((err) => {
                    console.log(err);
                    console.log(chalk.red.bold("Something went wrong"));
                    dbConnection.end();
                })
                //console log to tell the user it was successful
                console.log(chalk.yellow("      Added department: " + chalk.yellow.bold.underline(`${answer.addDepartment}`) + " to database."));
            }).then(() => {
                //returns to main menu
                return this.run();
            });
    }


    async addRole() {
        console.log("\n");
        console.log("                   " + chalk.yellow.bold.underline("ADD A ROLE"));
        return inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Please enter the title of the role to add',
                validate: (text) => {
                    if(!text.length) {
                        return 'Please enter the title of the role to add';
                    }
                    if(text.length > 30){
                        return 'The title of the role cannot not be over 30 characters';
                    }
                    if(!/^[a-zA-Z ]*$/.test(text)){
                        return chalk.red.bold('The title of the role must be only letters and spaces.');
                    }
                    return true;
                }
            },
            { 
                type: 'input',
                name: 'roleSalary',
                message: 'Please enter the salary of the role',
                validate: (text) => {
                    if(!text.length) {
                        return 'Please enter the salary of the role';
                    }
                    if(text.length > 7) {
                        return chalk.red.bold('The salary of the role cannot not be over 7 digits');
                    }
                    if(!/^\d+$/.test(text)){
                        return chalk.red.bold('The salary must be numbers only.');
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: "roleDeparment",
                message: "Please choose the department the role belongs to",
                choices: await departmentChoices()
            }])
            .then((answers) => {
                dbConnection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.roleTitle}', "${answers.roleSalary}", ${answers.roleDeparment});`)
                .catch((err) => {
                    console.log(err);
                    console.log(chalk.red.bold("Something went wrong"));
                    dbConnection.end();
                })
                console.log(chalk.yellow("      Added Role: " + chalk.yellow.bold.underline(`${answers.roleTitle}`) + " to database."));
            })
            .then(() => {
            return this.run();
            })
        }


    
    async addEmployee() {
        console.log("\n");
        console.log("                   " + chalk.yellow.bold.underline("ADD AN EMPLOYEE"));
        return inquirer.prompt([
            {
                type: 'input',
                name: 'empFName',
                message: 'Please enter the first name of the employee to add',
                validate: (text) => {
                    if(!text.length) {
                        return 'Please enter the first name of the employee to add';
                    }
                    if(text.length > 30){
                        return 'The the first name cannot not be over 30 characters';
                    }
                    if(!/^[a-zA-Z ]*$/.test(text)){
                        return chalk.red.bold('The the first name must be only letters and spaces.');
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'empLName',
                message: 'Please enter the last name of the employee to add',
                validate: (text) => {
                    if(!text.length) {
                        return 'Please enter the last name of the employee to add';
                    }
                    if(text.length > 30){
                        return 'The the last name cannot not be over 30 characters';
                    }
                    if(!/^[a-zA-Z ]*$/.test(text)){
                        return chalk.red.bold('The the last name must be only letters and spaces.');
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: "empRole",
                message: "Please choose the role this employee belongs to",
                choices: await roleChoices()
            },
            {
                type: 'list',
                name: "empManager",
                message: "Please choose the manager this employee belongs to",
                choices: await managerChoices()
            }
        ]).then((answers) => {
            dbConnection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES  ('${answers.empFName}', "${answers.empLName}", ${answers.empRole}, ${answers.empManager})`)
            .catch((err) => {
                console.log(err);
                console.log(chalk.red.bold("Something went wrong"));
                dbConnection.end();
            })
            console.log(chalk.yellow("      Added Employee: " + chalk.yellow.bold.underline(`${answers.empFName} `) + chalk.yellow.bold.underline(`${answers.empLName}`) + " to database."));
        })
        .then(() => {
            return this.run();
        })
    }

    //this function will update an employees role.
    async updateEmployeeRole() {
        console.log("\n");
        console.log("                   " + chalk.magenta.bold.underline("UPDATE AN EMPLOYEE ROLE"));
        return inquirer.prompt([
            {
                type: 'list',
                name: "roleUpdateEmp",
                message: "Please choose the employee whose role you want to update",
                choices: await managerChoices()
            },
            {
                type: 'list',
                name: "roleUpdate",
                message: "Please choose the role for this employee",
                choices: await roleChoices()
            }
        ]).then((answers) => {
            dbConnection.query(`UPDATE employee SET role_id = ${answers.roleUpdate} WHERE employee_id = ${answers.roleUpdateEmp}`)
            .catch((err) => {
                console.log(err);
                console.log(chalk.red.bold("Something went wrong"));
                dbConnection.end();
            })
            console.log(chalk.magenta(`     Employee role updated`))
        })
        .then(() => {
            return this.run();
        })
    }

    //this function allows you to change a employees manager, or set it to null if the same employee is chosen twice.
    async updateEmployeeManager() {
        console.log("\n");
        console.log("                   " + chalk.magenta.bold.underline("UPDATE AN EMPLOYEE MANAGER"));
        return inquirer.prompt([
            {
                type: 'list',
                name: "manUpdateEmp",
                message: "Please choose the employee whose Manager you want to Change",
                choices: await managerChoices()
            },
            {
                type: 'list',
                name: "manUpdateMan",
                message: "Please choose the Manager, or select the same employee to set no Manager",
                choices: await managerChoices()
            }
        ]).then((answers) => {
            //checks to see if 
            if(answers.manUpdateEmp === answers.manUpdateMan){
                dbConnection.query(`UPDATE employee SET manager_id = NULL WHERE employee_id = ${answers.manUpdateEmp}`)
                .catch((err) => {
                    console.log(err);
                    console.log(chalk.red.bold("Something went wrong"));
                    dbConnection.end();
                })
                console.log(chalk.magenta(`     Employee manager updated`))
            } else{
            dbConnection.query(`UPDATE employee SET manager_id = ${answers.manUpdateMan} WHERE employee_id = ${answers.manUpdateEmp}`)
            .catch((err) => {
                console.log(err);
                console.log(chalk.red.bold("Something went wrong"));
                dbConnection.end();
            })
            console.log(chalk.magenta(`     Employee manager updated`))
            }
            })            
            .then(() => {
            return this.run();
        })
    }
}

module.exports = EmpolyeeTracker;