INSERT INTO department (name)
VALUES
('Finance'),
('Technology'),
('Legal'),
('Administration');

INSERT INTO role (title, salary, department_id)
VALUES
('Accountant', 90000, 1),
('CFO', 400000, 1),
('Controller', 130000, 1),
('Data Scientist', 80000, 2),
('Software Engineer', 150000, 2),
('Lawyer', 150000, 3),
('IT Support', 95000, 2),
('Office Administrator', 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Sarah', 'Jones', 2, null),
('Carina', 'Row', 2, null),
('Stacy', 'Paris', 3, null),
('Victor', 'Fiore', 1, null),
('Landon', 'Looper', 4, null),
('Raj', 'Mason', 1, null),
('Gearson', 'Rolly', 4, null),
('Fiona', 'Apple', 1, null);

INSERT INTO manager (first_name, last_name, role_id, department_id)
VALUES
('Sweetheart', 'Shore', 1, 1),
('Sunrise', 'Moonset', 2, 2),
('Smiles', 'Devon', 3, 3);