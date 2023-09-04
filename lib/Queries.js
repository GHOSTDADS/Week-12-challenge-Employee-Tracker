const { dbConnection } = require('../config/connection');

const departmentChoices = async () => {
    const departmentQuery = `SELECT id AS value, department_name AS name FROM department;`;
    const departments = await dbConnection.query(departmentQuery);
    return departments[0];
};   

const managerChoices = async () => {
    const managerQuery = `SELECT employee_id AS value, CONCAT( first_name, " " , last_name) AS name FROM employee;`;
    const managers = await dbConnection.query(managerQuery);
    return managers[0];
};   

const roleChoices = async () => {
    const roleQuery = `SELECT id AS value, title AS name FROM role;`;
    const roles = await dbConnection.query(roleQuery);
    return roles[0];
}; 



module.exports = { departmentChoices, managerChoices, roleChoices };