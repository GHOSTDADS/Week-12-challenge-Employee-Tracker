
USE employee_db;

-- WHEN I choose to view all employees
-- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

-- SELECT E.employee_id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", role.title AS "Job Title", department.department_name AS Department, role.salary AS Salary, CONCAT( M.first_name, " " , M.last_name) AS "Manager" FROM employee E LEFT JOIN role ON E.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee M ON E.manager_id = M.employee_id;

-- SELECT role.title AS "Job Title", role.id AS "Role ID", department.department_name AS "Department Name", role.salary AS Salary 
-- FROM role 
-- LEFT JOIN department ON role.department_id = department.id;

INSERT INTO department (department_name) VALUES ("Sales");
SELECT * FROM department;