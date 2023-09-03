INSERT INTO department (department_name)
VALUES  ("IT"),
        ("HR"),
        ("Mathmatics"),
        ("Management");

INSERT INTO role (title, salary, department_id)
VALUES  ('Manager', "100000", 4),
        ('Receptionist', "60000", 2),
        ('Helpdesk Level 1', "60000", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Anne', "Hathaway", 1, NULL),
        ('Hellen', "Carter", 2, 1),
        ('Alex', "Babic", 3, 1);